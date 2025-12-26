import React from "react";
import { createRoot } from "react-dom/client";
import { Button } from "./Button";
const mount = (el: HTMLElement) =>
  createRoot(el).render(<Button>Click me</Button>);

export default mount;
export * from "./Button";
