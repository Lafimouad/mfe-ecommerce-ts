import React from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./AuthContext";
import { AuthApp } from "./AuthApp";

const App = () => (
  <AuthProvider>
    <AuthApp />
  </AuthProvider>
);

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
