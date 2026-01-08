# Terraform configuration for MFE E-commerce deployment on AWS
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  # Uncomment to use S3 backend for state management
  # backend "s3" {
  #   bucket = "your-terraform-state-bucket"
  #   key    = "mfe-ecommerce/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "aws" {
  region = var.aws_region
}

# S3 buckets for each MFE
locals {
  mfe_apps = {
    host     = "mfe-ecommerce-host"
    products = "mfe-ecommerce-products"
    cart     = "mfe-ecommerce-cart"
    checkout = "mfe-ecommerce-checkout"
    auth     = "mfe-ecommerce-auth"
    search   = "mfe-ecommerce-search"
    wishlist = "mfe-ecommerce-wishlist"
    orders   = "mfe-ecommerce-orders"
    ui       = "mfe-ecommerce-ui"
  }
}

# S3 Buckets
resource "aws_s3_bucket" "mfe_buckets" {
  for_each = local.mfe_apps
  
  bucket = "${each.value}-${var.environment}"
  
  tags = {
    Name        = each.value
    Environment = var.environment
    Project     = "mfe-ecommerce"
  }
}

# S3 Bucket Website Configuration
resource "aws_s3_bucket_website_configuration" "mfe_website" {
  for_each = aws_s3_bucket.mfe_buckets
  
  bucket = each.value.id
  
  index_document {
    suffix = "index.html"
  }
  
  error_document {
    key = "index.html"
  }
}

# S3 Bucket Public Access Block
resource "aws_s3_bucket_public_access_block" "mfe_public_access" {
  for_each = aws_s3_bucket.mfe_buckets
  
  bucket = each.value.id
  
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# S3 Bucket Policy for Public Read
resource "aws_s3_bucket_policy" "mfe_bucket_policy" {
  for_each = aws_s3_bucket.mfe_buckets
  
  bucket = each.value.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${each.value.arn}/*"
      }
    ]
  })
  
  depends_on = [aws_s3_bucket_public_access_block.mfe_public_access]
}

# S3 Bucket CORS Configuration
resource "aws_s3_bucket_cors_configuration" "mfe_cors" {
  for_each = aws_s3_bucket.mfe_buckets
  
  bucket = each.value.id
  
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

# CloudFront Origin Access Identity
resource "aws_cloudfront_origin_access_identity" "mfe_oai" {
  for_each = var.enable_cloudfront ? local.mfe_apps : {}
  
  comment = "OAI for ${each.value}"
}

# CloudFront Distributions
resource "aws_cloudfront_distribution" "mfe_distribution" {
  for_each = var.enable_cloudfront ? aws_s3_bucket.mfe_buckets : {}
  
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for ${each.key}"
  default_root_object = "index.html"
  price_class         = "PriceClass_100" # Use only North America and Europe
  
  origin {
    domain_name = each.value.bucket_regional_domain_name
    origin_id   = "S3-${each.value.id}"
    
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.mfe_oai[each.key].cloudfront_access_identity_path
    }
  }
  
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${each.value.id}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    
    forwarded_values {
      query_string = false
      headers      = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]
      
      cookies {
        forward = "none"
      }
    }
    
    min_ttl     = 0
    default_ttl = 86400   # 1 day
    max_ttl     = 31536000 # 1 year
  }
  
  # Cache behavior for index.html and remoteEntry.js (no cache)
  ordered_cache_behavior {
    path_pattern           = "/index.html"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${each.value.id}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }
  
  ordered_cache_behavior {
    path_pattern           = "/remoteEntry.js"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${each.value.id}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    cloudfront_default_certificate = true
  }
  
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }
  
  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }
  
  tags = {
    Name        = each.key
    Environment = var.environment
    Project     = "mfe-ecommerce"
  }
}
