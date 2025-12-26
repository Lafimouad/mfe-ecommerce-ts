import React from "react";
import { createRoot } from "react-dom/client";
import { CartApp } from "./CartApp";
const mount = (el: HTMLElement) => createRoot(el).render(<CartApp />);

export default mount;
export * from "./CartApp";
