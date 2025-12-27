import React, { useState, useEffect } from "react";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

export const CartApp = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage on mount
    const savedCart = localStorage.getItem("mfe-cart-items");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart from localStorage");
      }
    }

    // Listen for add to cart events
    const handleAdd = (e: any) => {
      const product = e.detail;
      setItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    };

    window.addEventListener("mfe:add", handleAdd);
    return () => window.removeEventListener("mfe:add", handleAdd);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("mfe-cart-items", JSON.stringify(items));
    // Dispatch event for cart count badge
    window.dispatchEvent(
      new CustomEvent("mfe:cart:update", { detail: items.length })
    );
  }, [items]);

  const updateQuantity = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      setItems([]);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>Shopping Cart ({totalItems} items)</h2>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
          <p style={{ fontSize: 18 }}>Your cart is empty</p>
          <p>Add some products to get started!</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16,
                  marginBottom: 12,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 8px 0" }}>{item.title}</h3>
                  <p style={{ margin: 0, color: "#666" }}>${item.price} each</p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity === 1}
                      style={{
                        width: 32,
                        height: 32,
                        border: "1px solid #ddd",
                        borderRadius: 4,
                        backgroundColor: "white",
                        cursor: item.quantity === 1 ? "not-allowed" : "pointer",
                        fontSize: 18,
                        opacity: item.quantity === 1 ? 0.5 : 1,
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        minWidth: 30,
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      style={{
                        width: 32,
                        height: 32,
                        border: "1px solid #ddd",
                        borderRadius: 4,
                        backgroundColor: "white",
                        cursor: "pointer",
                        fontSize: 18,
                      }}
                    >
                      +
                    </button>
                  </div>

                  <div
                    style={{
                      minWidth: 80,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: "2px solid #333",
              paddingTop: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            style={{
              width: "100%",
              marginTop: 20,
              padding: 16,
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 16,
              fontWeight: "bold",
            }}
            onClick={() => (window.location.href = "/checkout")}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};
