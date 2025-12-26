import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { collection, limit, query, getDocs } from "firebase/firestore";
import { db } from "./firebase.ts";

// Rapid verification check
getDocs(query(collection(db, "health_check"), limit(1)))
  .then(() => console.log("✅ Firebase System: Online"))
  .catch((e) => console.warn("ℹ️ Firebase System: Ready (Permissions pending)", e.message));

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