#!/bin/bash

# AWS S3 Bucket and CloudFront Setup Script
# Run this once to set up your infrastructure
# Prerequisites: AWS CLI installed and configured

set -e

echo "🔧 Setting up AWS infrastructure for MFE deployment..."

# Configuration
AWS_REGION="us-east-1"
AWS_PROFILE="default"

# Bucket names
BUCKETS=(
    "mfe-ecommerce-host"
    "mfe-ecommerce-products"
    "mfe-ecommerce-cart"
    "mfe-ecommerce-checkout"
    "mfe-ecommerce-auth"
    "mfe-ecommerce-search"
    "mfe-ecommerce-wishlist"
    "mfe-ecommerce-orders"
    "mfe-ecommerce-ui"
)

# Function to create and configure S3 bucket
setup_bucket() {
    local bucket=$1
    
    echo ""
    echo "📦 Setting up bucket: $bucket"
    
    # Create bucket
    if aws s3 mb "s3://$bucket" --region "$AWS_REGION" --profile "$AWS_PROFILE" 2>/dev/null; then
        echo "✅ Bucket created"
    else
        echo "ℹ️  Bucket already exists"
    fi
    
    # Enable static website hosting
    aws s3 website "s3://$bucket" \
        --index-document index.html \
        --error-document index.html \
        --region "$AWS_REGION" \
        --profile "$AWS_PROFILE"
    
    # Set bucket policy for public read
    cat > /tmp/bucket-policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$bucket/*"
        }
    ]
}
EOF
    
    aws s3api put-bucket-policy \
        --bucket "$bucket" \
        --policy file:///tmp/bucket-policy.json \
        --region "$AWS_REGION" \
        --profile "$AWS_PROFILE"
    
    # Disable Block Public Access
    aws s3api put-public-access-block \
        --bucket "$bucket" \
        --public-access-block-configuration \
        "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false" \
        --region "$AWS_REGION" \
        --profile "$AWS_PROFILE"
    
    # Enable CORS
    cat > /tmp/cors-config.json <<EOF
{
    "CORSRules": [
        {
            "AllowedOrigins": ["*"],
            "AllowedMethods": ["GET", "HEAD"],
            "AllowedHeaders": ["*"],
            "MaxAgeSeconds": 3000
        }
    ]
}
EOF
    
    aws s3api put-bucket-cors \
        --bucket "$bucket" \
        --cors-configuration file:///tmp/cors-config.json \
        --region "$AWS_REGION" \
        --profile "$AWS_PROFILE"
    
    echo "✅ Bucket $bucket configured for static hosting"
    echo "🌐 URL: http://$bucket.s3-website-$AWS_REGION.amazonaws.com"
}

# Create and configure all buckets
for bucket in "${BUCKETS[@]}"; do
    setup_bucket "$bucket"
done

# Clean up temp files
rm -f /tmp/bucket-policy.json /tmp/cors-config.json

echo ""
echo "✅ All buckets created and configured!"
echo ""
echo "📝 Next steps:"
echo "1. (Optional) Create CloudFront distributions for each bucket for HTTPS and CDN"
echo "2. Update webpack configs with production URLs"
echo "3. Update deploy.sh with your bucket names and CloudFront IDs"
echo "4. Run: chmod +x deploy.sh && ./deploy.sh"
echo ""
echo "💡 To create CloudFront distributions, use AWS Console or run:"
echo "   aws cloudfront create-distribution --help"
