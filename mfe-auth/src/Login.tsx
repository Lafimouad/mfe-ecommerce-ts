import React, { useState } from "react";
import { useAuth } from "./useAuth";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError("Invalid credentials. Password must be at least 6 characters.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h2>Login</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <div>
          <label style={{ display: "block", marginBottom: 4 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 4,
              border: "1px solid #ddd",
            }}
            placeholder="user@example.com"
            disabled={isLoading}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 4 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 4,
              border: "1px solid #ddd",
            }}
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>

        {error && <div style={{ color: "red", fontSize: 14 }}>{error}</div>}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: 10,
            borderRadius: 4,
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: 16, textAlign: "center", fontSize: 14 }}>
        Demo: Use any email and password with 6+ characters
      </p>
    </div>
  );
};
