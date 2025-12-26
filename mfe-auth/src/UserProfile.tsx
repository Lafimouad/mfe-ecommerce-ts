import React from "react";
import { useAuth } from "./useAuth";

export const UserProfile = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div style={{ padding: 20 }}>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}>
      <h2>User Profile</h2>
      <div
        style={{
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 8,
          backgroundColor: "#f9f9f9",
          marginBottom: 16,
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <strong>Name:</strong> {user.name}
        </div>
        <div style={{ marginBottom: 12 }}>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>User ID:</strong> {user.id}
        </div>
      </div>

      <button
        onClick={logout}
        style={{
          padding: "10px 20px",
          borderRadius: 4,
          border: "none",
          backgroundColor: "#dc3545",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
          width: "100%",
        }}
      >
        Logout
      </button>
    </div>
  );
};
