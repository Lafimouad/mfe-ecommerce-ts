
import React from 'react';
import { createRoot } from 'react-dom/client';
import CheckoutApp from './CheckoutApp';
const mount = (el: HTMLElement) => createRoot(el).render(<CheckoutApp/>);

export default mount;
export * from './CheckoutApp';
