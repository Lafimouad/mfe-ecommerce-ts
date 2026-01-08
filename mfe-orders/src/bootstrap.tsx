import React from "react";
import { createRoot } from "react-dom/client";
import { OrdersApp } from "./OrdersApp";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <OrdersApp />
  </React.StrictMode>
);
