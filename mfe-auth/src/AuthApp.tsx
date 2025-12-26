import React from "react";
import { Login } from "./Login";
import { Signup } from "./Signup";
import { UserProfile } from "./UserProfile";
import { useAuth } from "./useAuth";

export const AuthApp = () => {
  const { isAuthenticated } = useAuth();
  const [view, setView] = React.useState<"login" | "signup" | "profile">(
    "login"
  );

  React.useEffect(() => {
    if (isAuthenticated) {
      setView("profile");
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return <UserProfile />;
  }

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <button
          onClick={() => setView("login")}
          style={{
            padding: "8px 16px",
            borderRadius: 4,
            border: "1px solid #ddd",
            backgroundColor: view === "login" ? "#007bff" : "white",
            color: view === "login" ? "white" : "black",
            cursor: "pointer",
          }}
        >
          Login
        </button>
        <button
          onClick={() => setView("signup")}
          style={{
            padding: "8px 16px",
            borderRadius: 4,
            border: "1px solid #ddd",
            backgroundColor: view === "signup" ? "#28a745" : "white",
            color: view === "signup" ? "white" : "black",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>
      </div>

      {view === "login" ? <Login /> : <Signup />}
    </div>
  );
};
