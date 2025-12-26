import React, { Suspense } from "react";
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

const App = () => (
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
      <Link to="/cart">Cart</Link>
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

createRoot(document.getElementById("root")!).render(<App />);
