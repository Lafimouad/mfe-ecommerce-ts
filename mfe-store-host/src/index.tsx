import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./styles.css";

const ProductsApp = React.lazy(() => import("products/ProductsApp"));
const CartApp = React.lazy(() => import("cart/CartApp"));
const CheckoutApp = React.lazy(() => import("checkout/CheckoutApp"));

const App = () => (
  <BrowserRouter>
    <nav style={{ display: "flex", gap: 12, padding: 12 }}>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/checkout">Checkout</Link>
    </nav>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<div>Welcome</div>} />
        <Route path="/products/*" element={<ProductsApp />} />
        <Route path="/cart/*" element={<CartApp />} />
        <Route path="/checkout/*" element={<CheckoutApp />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

createRoot(document.getElementById("root")!).render(<App />);
