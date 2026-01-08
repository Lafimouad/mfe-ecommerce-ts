# 🛒 E-Commerce Micro-Frontend Application

A modern e-commerce platform built with **React**, **TypeScript**, and **Module Federation** (Webpack 5) using a micro-frontend architecture.

## 📦 Architecture

This project consists of 8 independent micro-frontends:

| MFE | Port | Description |
|-----|------|-------------|
| **mfe-store-host** | 3000 | Host application with navigation and routing |
| **mfe-products** | 3001 | Product listing and catalog |
| **mfe-cart** | 3002 | Shopping cart management |
| **mfe-checkout** | 3003 | Checkout and payment flow |
| **mfe-auth** | 3004 | Authentication (login/signup) |
| **mfe-search** | 3005 | Advanced product search with filters |
| **mfe-wishlist** | 3006 | Save products for later |
| **mfe-orders** | 3007 | Order history and tracking |
| **mfe-ui** | 3008 | Shared UI components |

## ✨ Features

### 🔍 Search (NEW)
- Advanced product search
- Category filters
- Price range sliders
- Sort by relevance, price, or name
- Real-time filtering

### ❤️ Wishlist (NEW)
- Save products for later
- Move items to cart
- Persistent storage
- Badge counter in navigation

### 📦 Orders (NEW)
- Order history
- Order status tracking (pending, processing, shipped, delivered)
- Order details with timeline
- Reorder functionality
- Mock order data with tracking numbers

### 🛍️ Products
- Product catalog
- Add to cart functionality
- Custom events for cross-MFE communication

### 🛒 Cart
- Add/remove items
- Quantity adjustment
- Real-time total calculation
- LocalStorage persistence
- Clear cart functionality

### 💳 Checkout
- Simple checkout flow
- Protected route (requires auth)

### 🔐 Authentication
- Login/Signup forms
- User profile
- Session management
- Protected routes

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. **Install dependencies for all micro-frontends:**

```bash
# Install for host
cd mfe-store-host && npm install && cd ..

# Install for products
cd mfe-products && npm install && cd ..

# Install for cart
cd mfe-cart && npm install && cd ..

# Install for checkout
cd mfe-checkout && npm install && cd ..

# Install for auth
cd mfe-auth && npm install && cd ..

# Install for search (NEW)
cd mfe-search && npm install && cd ..

# Install for wishlist (NEW)
cd mfe-wishlist && npm install && cd ..

# Install for orders (NEW)
cd mfe-orders && npm install && cd ..

# Install for UI components
cd mfe-ui && npm install && cd ..
```

### Running the Application

You need to run all micro-frontends simultaneously. Open 9 terminal windows/tabs:

**Terminal 1 - Host:**
```bash
cd mfe-store-host && npm start
```

**Terminal 2 - Products:**
```bash
cd mfe-products && npm start
```

**Terminal 3 - Cart:**
```bash
cd mfe-cart && npm start
```

**Terminal 4 - Checkout:**
```bash
cd mfe-checkout && npm start
```

**Terminal 5 - Auth:**
```bash
cd mfe-auth && npm start
```

**Terminal 6 - Search:**
```bash
cd mfe-search && npm start
```

**Terminal 7 - Wishlist:**
```bash
cd mfe-wishlist && npm start
```

**Terminal 8 - Orders:**
```bash
cd mfe-orders && npm start
```

**Terminal 9 - UI:**
```bash
cd mfe-ui && npm start
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 🔄 Cross-MFE Communication

The application uses **Custom Events** for communication between micro-frontends:

| Event | Direction | Purpose |
|-------|-----------|---------|
| `mfe:add` | Products/Search → Cart | Add item to cart |
| `mfe:cart:update` | Cart → Host | Update cart count badge |
| `mfe:wishlist:add` | Search → Wishlist | Add item to wishlist |
| `mfe:wishlist:update` | Wishlist → Host | Update wishlist count badge |
| `mfe:order:created` | Checkout → Orders | Create new order |

## 💾 Data Persistence

All data is stored in **localStorage**:

- `mfe-cart-items` - Shopping cart items
- `mfe-wishlist-items` - Wishlist items
- `mfe-orders` - Order history
- `mfe-auth-user` - User session

## 🏗️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Webpack 5** - Module Federation
- **React Router** - Routing
- **LocalStorage** - Client-side persistence

## 📁 Project Structure

```
mfe-ecommerce-ts/
├── mfe-store-host/          # Host application
│   ├── src/
│   │   ├── bootstrap.tsx    # Main app component
│   │   ├── remotes.d.ts     # Remote type definitions
│   │   └── styles.css       # Global styles
│   ├── webpack.config.js    # Module Federation config
│   └── package.json
├── mfe-products/            # Products micro-frontend
├── mfe-cart/                # Cart micro-frontend
├── mfe-checkout/            # Checkout micro-frontend
├── mfe-auth/                # Authentication micro-frontend
├── mfe-search/              # Search micro-frontend (NEW)
├── mfe-wishlist/            # Wishlist micro-frontend (NEW)
├── mfe-orders/              # Orders micro-frontend (NEW)
└── mfe-ui/                  # Shared UI components
```

## 🎯 Next Steps

Consider adding:

- 🔐 **Real backend API** (REST/GraphQL)
- 💳 **Payment integration** (Stripe/PayPal)
- 📧 **Email notifications**
- 🖼️ **Product images**
- ⭐ **Reviews & ratings**
- 🔔 **Real-time notifications**
- 📱 **Mobile responsive design**
- 🌙 **Dark mode**
- 🌐 **Internationalization (i18n)**
- 🧪 **Unit & E2E tests**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

Built with ❤️ using Micro-Frontend Architecture
