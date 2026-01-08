import React, { Suspense, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./styles.css";

const ProductsApp = React.lazy(() =>
  import("products/ProductsApp").then((m) => ({ default: m.ProductsApp }))
);
const CartApp = React.lazy(() =>
  import("cart/CartApp").then((m) => ({ default: m.CartApp }))
);
const CheckoutApp = React.lazy(() =>
  import("checkout/CheckoutApp").then((m) => ({ default: m.CheckoutApp }))
);
const AuthApp = React.lazy(() =>
  import("auth/AuthApp").then((m) => ({ default: m.AuthApp }))
);
const SearchApp = React.lazy(() =>
  import("search/SearchApp").then((m) => ({ default: m.SearchApp }))
);
const WishlistApp = React.lazy(() =>
  import("wishlist/WishlistApp").then((m) => ({ default: m.WishlistApp }))
);
const OrdersApp = React.lazy(() =>
  import("orders/OrdersApp").then((m) => ({ default: m.OrdersApp }))
);

const App = () => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    // Initialize cart count from localStorage
    const savedCart = localStorage.getItem("mfe-cart-items");
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        const count = items.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );
        setCartCount(count);
      } catch (e) {
        console.error("Failed to load cart count");
      }
    }

    // Initialize wishlist count from localStorage
    const savedWishlist = localStorage.getItem("mfe-wishlist-items");
    if (savedWishlist) {
      try {
        const items = JSON.parse(savedWishlist);
        setWishlistCount(items.length);
      } catch (e) {
        console.error("Failed to load wishlist count");
      }
    }

    // Listen for cart updates
    const handleCartUpdate = (e: any) => {
      const items = JSON.parse(localStorage.getItem("mfe-cart-items") || "[]");
      const count = items.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );
      setCartCount(count);
    };

    // Listen for wishlist updates
    const handleWishlistUpdate = (e: any) => {
      const items = JSON.parse(localStorage.getItem("mfe-wishlist-items") || "[]");
      setWishlistCount(items.length);
    };

    window.addEventListener("mfe:cart:update", handleCartUpdate);
    window.addEventListener("mfe:wishlist:update", handleWishlistUpdate);
    return () => {
      window.removeEventListener("mfe:cart:update", handleCartUpdate);
      window.removeEventListener("mfe:wishlist:update", handleWishlistUpdate);
    };
  }, []);

  return (
    <BrowserRouter>
      <nav
        style={{
          display: "flex",
          gap: 12,
          padding: 12,
          backgroundColor: "#f5f5f5",
          alignItems: "center",
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/search">Search</Link>
        <Link to="/cart" style={{ position: "relative" }}>
          Cart
          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -8,
                right: -12,
                backgroundColor: "#dc3545",
                color: "white",
                borderRadius: "50%",
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              {cartCount}
            </span>
          )}
        </Link>
        <Link to="/wishlist" style={{ position: "relative" }}>
          Wishlist
          {wishlistCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -8,
                right: -12,
                backgroundColor: "#dc3545",
                color: "white",
                borderRadius: "50%",
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              {wishlistCount}
            </span>
          )}
        </Link>
        <Link to="/checkout">Checkout</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/auth" style={{ marginLeft: "auto" }}>
          Account
        </Link>
      </nav>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <div style={{ padding: 20 }}>
                <h1>Welcome to Our Store</h1>
                <p>Explore our products, manage your wishlist, and track your orders!</p>
              </div>
            }
          />
          <Route path="/products/*" element={<ProductsApp />} />
          <Route path="/search/*" element={<SearchApp />} />
          <Route path="/cart/*" element={<CartApp />} />
          <Route path="/wishlist/*" element={<WishlistApp />} />
          <Route path="/checkout/*" element={<CheckoutApp />} />
          <Route path="/orders/*" element={<OrdersApp />} />
          <Route path="/auth/*" element={<AuthApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
