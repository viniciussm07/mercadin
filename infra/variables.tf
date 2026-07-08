variable "aws_profile" {
  description = "AWS CLI profile to use"
  type        = string
  default     = "default"
}

variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "key_name" {
  description = "Name of the EC2 key pair for SSH access"
  type        = string
}

variable "my_ip" {
  description = "Your public IP in CIDR notation for SSH access (e.g. 203.0.113.10/32)"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "domain" {
  description = "Domain name for the application (used in Nginx and Certbot)"
  type        = string
}

variable "db_password" {
  description = "PostgreSQL password (must match docker-compose.yml POSTGRES_PASSWORD)"
  type        = string
  sensitive   = true
}

variable "supabase_url" {
  description = "Supabase project URL for authentication"
  type        = string
  sensitive   = true
}

variable "supabase_jwt_secret" {
  description = "Supabase JWT secret for token validation"
  type        = string
  sensitive   = true
}

variable "supabase_anon_key" {
  description = "Supabase anonymous key"
  type        = string
  sensitive   = true
}

variable "supabase_service_key" {
  description = "Supabase service role key"
  type        = string
  sensitive   = true
}

variable "app_repo_url" {
  description = "Git repository URL to clone"
  type        = string
  default     = "https://github.com/viniciussm07/mercadin.git"
}

variable "app_branch" {
  description = "Git branch to deploy"
  type        = string
  default     = "main"
}
