# The AWS region where resources will be created
variable "aws_region" {
  type        = string
  description = "The AWS region where resources will be created"
  default     = "us-west-2"
}

# The CIDR block for the VPC
variable "vpc_cidr" {
  type        = string
  description = "The CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

# The deployment environment (e.g., dev, staging, prod)
variable "environment" {
  type        = string
  description = "The deployment environment (e.g., dev, staging, prod)"
  default     = "dev"
}

# The name of the application
variable "app_name" {
  type        = string
  description = "The name of the application"
  default     = "swan-z-style"
}

# The instance class for the RDS database
variable "db_instance_class" {
  type        = string
  description = "The instance class for the RDS database"
  default     = "db.t3.micro"
}

# The name of the database
variable "db_name" {
  type        = string
  description = "The name of the database"
  default     = "swanzstyledb"
}

# The username for the database
variable "db_username" {
  type        = string
  description = "The username for the database"
  sensitive   = true
}

# The password for the database
variable "db_password" {
  type        = string
  description = "The password for the database"
  sensitive   = true
}

# The instance type for EC2 instances
variable "ec2_instance_type" {
  type        = string
  description = "The instance type for EC2 instances"
  default     = "t3.micro"
}

# Minimum number of instances in the auto scaling group
variable "min_size" {
  type        = number
  description = "Minimum number of instances in the auto scaling group"
  default     = 2
}

# Maximum number of instances in the auto scaling group
variable "max_size" {
  type        = number
  description = "Maximum number of instances in the auto scaling group"
  default     = 5
}