import React, { useState, useEffect } from "react";

interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "ORD-2026-001",
    date: "2026-01-05T10:30:00Z",
    items: [
      { id: 1, title: "Scooter", price: 299, quantity: 1 },
      { id: 2, title: "Headphones", price: 199, quantity: 2 },
    ],
    total: 697,
    status: "delivered",
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-2026-002",
    date: "2026-01-07T14:20:00Z",
    items: [{ id: 3, title: "Laptop", price: 999, quantity: 1 }],
    total: 999,
    status: "shipped",
    trackingNumber: "TRK987654321",
  },
  {
    id: "ORD-2026-003",
    date: "2026-01-08T09:15:00Z",
    items: [
      { id: 4, title: "Smartphone", price: 699, quantity: 1 },
      { id: 7, title: "Watch", price: 249, quantity: 1 },
    ],
    total: 948,
    status: "processing",
  },
];

export const OrdersApp = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    // Load orders from localStorage (in real app, fetch from API)
    const saved = localStorage.getItem("mfe-orders");
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load orders");
        setOrders(mockOrders);
      }
    } else {
      setOrders(mockOrders);
      localStorage.setItem("mfe-orders", JSON.stringify(mockOrders));
    }

    // Listen for new order events from checkout
    const handleNewOrder = (e: any) => {
      const newOrder = e.detail;
      setOrders((prev) => {
        const updated = [newOrder, ...prev];
        localStorage.setItem("mfe-orders", JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener("mfe:order:created", handleNewOrder);
    return () =>
      window.removeEventListener("mfe:order:created", handleNewOrder);
  }, []);

  const getStatusColor = (status: Order["status"]) => {
    const colors = {
      pending: "#ffc107",
      processing: "#17a2b8",
      shipped: "#007bff",
      delivered: "#28a745",
      cancelled: "#dc3545",
    };
    return colors[status];
  };

  const getStatusIcon = (status: Order["status"]) => {
    const icons = {
      pending: "⏳",
      processing: "📦",
      shipped: "🚚",
      delivered: "✓",
      cancelled: "✗",
    };
    return icons[status];
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const reorder = (order: Order) => {
    order.items.forEach((item) => {
      window.dispatchEvent(new CustomEvent("mfe:add", { detail: item }));
    });
    alert("Items added to cart!");
  };

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h2>My Orders</h2>

      {/* Filter */}
      <div
        style={{ marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap" }}
      >
        {[
          "all",
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              padding: "8px 16px",
              border: "1px solid #ddd",
              borderRadius: 4,
              backgroundColor: filterStatus === status ? "#007bff" : "white",
              color: filterStatus === status ? "white" : "black",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
          <p style={{ fontSize: 18 }}>No orders found</p>
          <p>Start shopping to see your orders here!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 20,
                backgroundColor: "#f9f9f9",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: 16,
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 8px 0" }}>Order {order.id}</h3>
                  <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
                    Placed on {new Date(order.date).toLocaleDateString()} at{" "}
                    {new Date(order.date).toLocaleTimeString()}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 16px",
                    backgroundColor: getStatusColor(order.status),
                    color: "white",
                    borderRadius: 4,
                    fontWeight: "bold",
                  }}
                >
                  <span>{getStatusIcon(order.status)}</span>
                  <span style={{ textTransform: "capitalize" }}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div
                style={{
                  backgroundColor: "white",
                  padding: 16,
                  borderRadius: 4,
                  marginBottom: 16,
                }}
              >
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div>
                      <strong>{item.title}</strong>
                      <span style={{ color: "#666", marginLeft: 8 }}>
                        × {item.quantity}
                      </span>
                    </div>
                    <div>${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: 12,
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Tracking & Actions */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  {order.trackingNumber && (
                    <p style={{ margin: 0, fontSize: 14 }}>
                      <strong>Tracking:</strong> {order.trackingNumber}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() =>
                      setSelectedOrder(
                        selectedOrder?.id === order.id ? null : order
                      )
                    }
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "white",
                      border: "1px solid #007bff",
                      color: "#007bff",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    {selectedOrder?.id === order.id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                  {order.status === "delivered" && (
                    <button
                      onClick={() => reorder(order)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      Reorder
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {selectedOrder?.id === order.id && (
                <div
                  style={{
                    marginTop: 16,
                    padding: 16,
                    backgroundColor: "white",
                    borderRadius: 4,
                    border: "1px solid #ddd",
                  }}
                >
                  <h4 style={{ marginTop: 0 }}>Order Timeline</h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: "#28a745",
                        }}
                      />
                      <span>
                        Order Placed -{" "}
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                    </div>
                    {order.status !== "pending" && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: "#28a745",
                          }}
                        />
                        <span>Processing Started</span>
                      </div>
                    )}
                    {(order.status === "shipped" ||
                      order.status === "delivered") && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: "#28a745",
                          }}
                        />
                        <span>Shipped</span>
                      </div>
                    )}
                    {order.status === "delivered" && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: "#28a745",
                          }}
                        />
                        <span>Delivered</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
