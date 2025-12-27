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

const App = () => {
  const [cartCount, setCartCount] = useState(0);

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

    // Listen for cart updates
    const handleCartUpdate = (e: any) => {
      const items = JSON.parse(localStorage.getItem("mfe-cart-items") || "[]");
      const count = items.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );
      setCartCount(count);
    };

    window.addEventListener("mfe:cart:update", handleCartUpdate);
    return () =>
      window.removeEventListener("mfe:cart:update", handleCartUpdate);
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
        <Link to="/checkout">Checkout</Link>
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
              </div>
            }
          />
          <Route path="/products/*" element={<ProductsApp />} />
          <Route path="/cart/*" element={<CartApp />} />
          <Route path="/checkout/*" element={<CheckoutApp />} />
          <Route path="/auth/*" element={<AuthApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
