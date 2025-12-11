
import React from 'react';
import { createRoot } from 'react-dom/client';
import ProductsApp from './ProductsApp';
const mount = (el: HTMLElement) => createRoot(el).render(<ProductsApp/>);

export default mount;
export * from './ProductsApp';
