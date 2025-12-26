import React, { useState } from "react";
export const CheckoutApp = () => {
  const [done, setDone] = useState(false);
  return (
    <div style={{ padding: 20 }}>
      <h2>Checkout</h2>
      <p style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
        🔒 This page would be protected in a real app. Users should be logged in
        to checkout.
      </p>
      {done ? "Paid!" : <button onClick={() => setDone(true)}>Pay now</button>}
    </div>
  );
};
