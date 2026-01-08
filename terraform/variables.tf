variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "enable_cloudfront" {
  description = "Enable CloudFront distributions (recommended for production)"
  type        = bool
  default     = true
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "mfe-ecommerce"
}
