import React from "react";
import { createRoot } from "react-dom/client";
import { WishlistApp } from "./WishlistApp";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <WishlistApp />
  </React.StrictMode>
);
