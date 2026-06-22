output "public_ip" {
  description = "Public IP of the EC2 instance. Point your domain DNS here and run certbot via SSH. The IP changes on stop/start — update DNS when needed."
  value       = aws_instance.mercadin.public_ip
}

output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.mercadin.id
}
