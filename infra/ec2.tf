resource "aws_instance" "mercadin" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  key_name                    = var.key_name
  vpc_security_group_ids      = [aws_security_group.mercadin.id]
  associate_public_ip_address = true

  user_data = templatefile("${path.module}/user_data.sh", {
    db_password          = var.db_password
    supabase_url         = var.supabase_url
    supabase_jwt_secret  = var.supabase_jwt_secret
    supabase_anon_key    = var.supabase_anon_key
    supabase_service_key = var.supabase_service_key
    app_repo_url         = var.app_repo_url
    app_branch           = var.app_branch
    domain               = var.domain
  })

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  tags = {
    Name = "mercadin"
  }
}
