#!/bin/bash
set -euo pipefail
exec > /var/log/mercadin-setup.log 2>&1

# ------------------------------------------------------------------
# 1. Swap (avoid OOM on t2.micro)
# ------------------------------------------------------------------
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile swap swap defaults 0 0' >> /etc/fstab

# ------------------------------------------------------------------
# 2. System packages
# ------------------------------------------------------------------
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y ca-certificates curl git nginx

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

systemctl enable docker
systemctl start docker

# ------------------------------------------------------------------
# 3. Node 24 + pnpm
# ------------------------------------------------------------------
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt-get install -y nodejs
npm install -g pnpm@10.31.0

# ------------------------------------------------------------------
# 4. Application user
# ------------------------------------------------------------------
useradd -m -s /bin/bash mercadin
usermod -aG docker mercadin

# ------------------------------------------------------------------
# 5. Environment file (secrets)
# ------------------------------------------------------------------
mkdir -p /etc/mercadin
cat > /etc/mercadin/env <<'ENVEOF'
DATABASE_URL=postgresql://postgres:${db_password}@localhost:5433/mercadin
SUPABASE_URL=${supabase_url}
SUPABASE_JWT_SECRET=${supabase_jwt_secret}
SUPABASE_ANON_KEY=${supabase_anon_key}
SUPABASE_SERVICE_ROLE_KEY=${supabase_service_key}
NODE_ENV=production
ENVEOF
chown root:mercadin /etc/mercadin/env
chmod 640 /etc/mercadin/env

# ------------------------------------------------------------------
# 6. Clone repository
# ------------------------------------------------------------------
git clone -b ${app_branch} ${app_repo_url} /opt/mercadin
chown -R mercadin:mercadin /opt/mercadin

# ------------------------------------------------------------------
# 7. Start PostgreSQL via Docker Compose (only postgres, no pgAdmin)
# ------------------------------------------------------------------
docker compose -f /opt/mercadin/server/docker-compose.yml up -d postgres

echo "Waiting for PostgreSQL to accept connections..."
until docker exec mercadin_postgres pg_isready -U postgres; do
  sleep 2
done

# ------------------------------------------------------------------
# 8. Backend: install, generate, migrate, build
# ------------------------------------------------------------------
sudo -u mercadin bash -c '
  set -a; source /etc/mercadin/env; set +a

  cd /opt/mercadin
  pnpm install --frozen-lockfile

  cd server
  npx prisma generate
  npx prisma migrate deploy
  pnpm build
'

# ------------------------------------------------------------------
# 9. systemd unit for NestJS API
# ------------------------------------------------------------------
cat > /etc/systemd/system/mercadin.service <<'UNITEOF'
[Unit]
Description=Mercadin API
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=mercadin
WorkingDirectory=/opt/mercadin/server
ExecStart=/usr/bin/node dist/src/main.js
Restart=on-failure
RestartSec=5
EnvironmentFile=/etc/mercadin/env

[Install]
WantedBy=multi-user.target
UNITEOF

systemctl daemon-reload
systemctl enable mercadin
systemctl start mercadin

echo "Waiting for API to respond..."
until curl -sf http://127.0.0.1:3050 > /dev/null 2>&1; do
  sleep 2
done
echo "API is up!"

# ------------------------------------------------------------------
# 10. Frontend: web export with production API URL
# ------------------------------------------------------------------
sudo -u mercadin bash -c '
  cd /opt/mercadin/client
  EXPO_PUBLIC_API_URL=https://${domain}/api pnpm build
'

# ------------------------------------------------------------------
# 11. Nginx reverse proxy + static files
# ------------------------------------------------------------------
cat > /etc/nginx/sites-available/mercadin <<'NGINXEOF'
server {
    listen 80;
    server_name ${domain};

    location /api/ {
        proxy_pass http://127.0.0.1:3050/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api-docs {
        proxy_pass http://127.0.0.1:3050/api-docs;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        root /opt/mercadin/client/dist;
        try_files $uri /index.html;
    }
}
NGINXEOF

ln -sf /etc/nginx/sites-available/mercadin /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
systemctl restart nginx

# ------------------------------------------------------------------
# 12. Certbot (installed but not run — requires DNS to be pointed first)
# ------------------------------------------------------------------
apt-get install -y certbot python3-certbot-nginx

echo "========================================="
echo "Setup complete. To enable HTTPS, point"
echo "your domain DNS to this instance IP and"
echo "run: sudo certbot --nginx -d ${domain}"
echo "========================================="
