import React from "react";
import { createRoot } from "react-dom/client";
import { SearchApp } from "./SearchApp";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <SearchApp />
  </React.StrictMode>
);
