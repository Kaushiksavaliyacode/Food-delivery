
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Using a relative path and checking if registration is possible in the current context
    // In some sandboxed preview environments, Service Workers are blocked or have origin issues.
    navigator.serviceWorker.register('sw.js')
      .then(reg => {
        console.log('FoodGo Service Worker registered successfully with scope:', reg.scope);
      })
      .catch(err => {
        // Log as info/debug because this is expected in some sandboxed environments (like iframes)
        console.debug('Service Worker registration skipped or blocked by environment:', err.message);
      });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
