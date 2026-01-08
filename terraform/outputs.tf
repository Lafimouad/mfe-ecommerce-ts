output "s3_bucket_names" {
  description = "S3 bucket names for each MFE"
  value = {
    for k, v in aws_s3_bucket.mfe_buckets : k => v.id
  }
}

output "s3_website_endpoints" {
  description = "S3 website endpoints for each MFE"
  value = {
    for k, v in aws_s3_bucket_website_configuration.mfe_website : k => v.website_endpoint
  }
}

output "cloudfront_domain_names" {
  description = "CloudFront domain names for each MFE"
  value = var.enable_cloudfront ? {
    for k, v in aws_cloudfront_distribution.mfe_distribution : k => v.domain_name
  } : {}
}

output "cloudfront_distribution_ids" {
  description = "CloudFront distribution IDs for cache invalidation"
  value = var.enable_cloudfront ? {
    for k, v in aws_cloudfront_distribution.mfe_distribution : k => v.id
  } : {}
}

output "deployment_urls" {
  description = "Final deployment URLs (CloudFront if enabled, S3 otherwise)"
  value = var.enable_cloudfront ? {
    for k, v in aws_cloudfront_distribution.mfe_distribution : k => "https://${v.domain_name}"
  } : {
    for k, v in aws_s3_bucket_website_configuration.mfe_website : k => "http://${v.website_endpoint}"
  }
}
