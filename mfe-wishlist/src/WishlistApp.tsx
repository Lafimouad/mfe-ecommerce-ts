import React, { useState, useEffect } from "react";

interface WishlistItem {
  id: number;
  title: string;
  price: number;
  addedAt: string;
}

export const WishlistApp = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    // Load wishlist from localStorage
    const saved = localStorage.getItem("mfe-wishlist-items");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load wishlist");
      }
    }

    // Listen for add to wishlist events
    const handleAdd = (e: any) => {
      const product = e.detail;
      setItems((prev) => {
        const exists = prev.find((item) => item.id === product.id);
        if (exists) {
          return prev; // Already in wishlist
        }
        return [
          ...prev,
          {
            ...product,
            addedAt: new Date().toISOString(),
          },
        ];
      });
    };

    window.addEventListener("mfe:wishlist:add", handleAdd);
    return () => window.removeEventListener("mfe:wishlist:add", handleAdd);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("mfe-wishlist-items", JSON.stringify(items));
    // Dispatch event for wishlist count badge
    window.dispatchEvent(
      new CustomEvent("mfe:wishlist:update", { detail: items.length })
    );
  }, [items]);

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const moveToCart = (item: WishlistItem) => {
    window.dispatchEvent(
      new CustomEvent("mfe:add", {
        detail: { id: item.id, title: item.title, price: item.price },
      })
    );
    removeItem(item.id);
  };

  const clearWishlist = () => {
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      setItems([]);
    }
  };

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
        <h2>My Wishlist ({items.length})</h2>
        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
          <p style={{ fontSize: 24, margin: "0 0 12px 0" }}>♥</p>
          <p style={{ fontSize: 18 }}>Your wishlist is empty</p>
          <p>Save items you love for later!</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 16,
                backgroundColor: "#f9f9f9",
                position: "relative",
              }}
            >
              <button
                onClick={() => removeItem(item.id)}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "none",
                  border: "none",
                  fontSize: 20,
                  cursor: "pointer",
                  color: "#dc3545",
                }}
                title="Remove from wishlist"
              >
                ×
              </button>

              <h3 style={{ margin: "0 0 8px 0" }}>{item.title}</h3>
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#28a745",
                }}
              >
                ${item.price}
              </p>
              <p style={{ margin: "0 0 16px 0", fontSize: 12, color: "#999" }}>
                Added {new Date(item.addedAt).toLocaleDateString()}
              </p>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => moveToCart(item)}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
