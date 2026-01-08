// Production URLs for deployed MFEs
// Update these after deploying to AWS S3/CloudFront

module.exports = {
  // Option 1: S3 Website URLs (HTTP only)
  s3: {
    host: "http://mfe-ecommerce-host.s3-website-us-east-1.amazonaws.com",
    products:
      "http://mfe-ecommerce-products.s3-website-us-east-1.amazonaws.com",
    cart: "http://mfe-ecommerce-cart.s3-website-us-east-1.amazonaws.com",
    checkout:
      "http://mfe-ecommerce-checkout.s3-website-us-east-1.amazonaws.com",
    auth: "http://mfe-ecommerce-auth.s3-website-us-east-1.amazonaws.com",
    search: "http://mfe-ecommerce-search.s3-website-us-east-1.amazonaws.com",
    wishlist:
      "http://mfe-ecommerce-wishlist.s3-website-us-east-1.amazonaws.com",
    orders: "http://mfe-ecommerce-orders.s3-website-us-east-1.amazonaws.com",
    ui: "http://mfe-ecommerce-ui.s3-website-us-east-1.amazonaws.com",
  },

  // Option 2: CloudFront URLs (HTTPS, recommended)
  // Update these after creating CloudFront distributions
  cloudfront: {
    host: "https://d123456abcdef.cloudfront.net",
    products: "https://d234567abcdef.cloudfront.net",
    cart: "https://d345678abcdef.cloudfront.net",
    checkout: "https://d456789abcdef.cloudfront.net",
    auth: "https://d567890abcdef.cloudfront.net",
    search: "https://d678901abcdef.cloudfront.net",
    wishlist: "https://d789012abcdef.cloudfront.net",
    orders: "https://d890123abcdef.cloudfront.net",
    ui: "https://d901234abcdef.cloudfront.net",
  },

  // Local development URLs
  local: {
    host: "http://localhost:3000",
    products: "http://localhost:3001",
    cart: "http://localhost:3002",
    checkout: "http://localhost:3003",
    auth: "http://localhost:3004",
    search: "http://localhost:3005",
    wishlist: "http://localhost:3006",
    orders: "http://localhost:3007",
    ui: "http://localhost:3008",
  },
};
