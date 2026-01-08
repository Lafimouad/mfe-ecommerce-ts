#!/bin/bash

# Deployment script for all MFEs to AWS S3 + CloudFront
# Run: ./deploy.sh

set -e

echo "🚀 Starting MFE Deployment Process..."

# Configuration - UPDATE THESE WITH YOUR AWS VALUES
AWS_REGION="us-east-1"
AWS_PROFILE="default"  # Change if using a specific AWS profile

# S3 Bucket names - UPDATE THESE
BUCKET_HOST="mfe-ecommerce-host"
BUCKET_PRODUCTS="mfe-ecommerce-products"
BUCKET_CART="mfe-ecommerce-cart"
BUCKET_CHECKOUT="mfe-ecommerce-checkout"
BUCKET_AUTH="mfe-ecommerce-auth"
BUCKET_SEARCH="mfe-ecommerce-search"
BUCKET_WISHLIST="mfe-ecommerce-wishlist"
BUCKET_ORDERS="mfe-ecommerce-orders"
BUCKET_UI="mfe-ecommerce-ui"

# CloudFront Distribution IDs - UPDATE AFTER CREATING DISTRIBUTIONS
CF_HOST=""
CF_PRODUCTS=""
CF_CART=""
CF_CHECKOUT=""
CF_AUTH=""
CF_SEARCH=""
CF_WISHLIST=""
CF_ORDERS=""
CF_UI=""

# Function to build and deploy an MFE
deploy_mfe() {
    local name=$1
    local path=$2
    local bucket=$3
    local cf_id=$4
    
    echo ""
    echo "📦 Building $name..."
    cd "$path"
    npm run build
    
    echo "☁️  Uploading $name to S3..."
    aws s3 sync dist/ "s3://$bucket" \
        --delete \
        --region "$AWS_REGION" \
        --profile "$AWS_PROFILE" \
        --cache-control "public, max-age=31536000" \
        --exclude "index.html" \
        --exclude "remoteEntry.js"
    
    # Upload index.html and remoteEntry.js without cache
    aws s3 cp dist/index.html "s3://$bucket/index.html" \
        --region "$AWS_REGION" \
        --profile "$AWS_PROFILE" \
        --cache-control "no-cache, no-store, must-revalidate"
    
    if [ -f "dist/remoteEntry.js" ]; then
        aws s3 cp dist/remoteEntry.js "s3://$bucket/remoteEntry.js" \
            --region "$AWS_REGION" \
            --profile "$AWS_PROFILE" \
            --cache-control "no-cache, no-store, must-revalidate"
    fi
    
    # Invalidate CloudFront cache if distribution ID is provided
    if [ -n "$cf_id" ]; then
        echo "🔄 Invalidating CloudFront cache for $name..."
        aws cloudfront create-invalidation \
            --distribution-id "$cf_id" \
            --paths "/*" \
            --region "$AWS_REGION" \
            --profile "$AWS_PROFILE" > /dev/null
    fi
    
    echo "✅ $name deployed successfully!"
    cd ..
}

# Build order matters for Module Federation
BASE_DIR=$(pwd)

echo ""
echo "Building in dependency order..."

# 1. Deploy UI components first (no dependencies)
deploy_mfe "mfe-ui" "$BASE_DIR/mfe-ui" "$BUCKET_UI" "$CF_UI"

# 2. Deploy remote apps (depend on nothing)
deploy_mfe "mfe-products" "$BASE_DIR/mfe-products" "$BUCKET_PRODUCTS" "$CF_PRODUCTS"
deploy_mfe "mfe-cart" "$BASE_DIR/mfe-cart" "$BUCKET_CART" "$CF_CART"
deploy_mfe "mfe-checkout" "$BASE_DIR/mfe-checkout" "$BUCKET_CHECKOUT" "$CF_CHECKOUT"
deploy_mfe "mfe-auth" "$BASE_DIR/mfe-auth" "$BUCKET_AUTH" "$CF_AUTH"
deploy_mfe "mfe-search" "$BASE_DIR/mfe-search" "$BUCKET_SEARCH" "$CF_SEARCH"
deploy_mfe "mfe-wishlist" "$BASE_DIR/mfe-wishlist" "$BUCKET_WISHLIST" "$CF_WISHLIST"
deploy_mfe "mfe-orders" "$BASE_DIR/mfe-orders" "$BUCKET_ORDERS" "$CF_ORDERS"

# 3. Deploy host last (depends on all remotes)
deploy_mfe "mfe-store-host" "$BASE_DIR/mfe-store-host" "$BUCKET_HOST" "$CF_HOST"

echo ""
echo "🎉 All MFEs deployed successfully!"
echo ""
echo "📍 Your application should be available at:"
echo "   https://$BUCKET_HOST.s3-website-$AWS_REGION.amazonaws.com"
echo "   or via CloudFront distribution (if configured)"
