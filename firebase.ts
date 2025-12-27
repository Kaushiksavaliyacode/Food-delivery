import { initializeApp } from "firebase/app";
import * as firebaseAnalytics from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDi8kzDtNwuQrdPG7L8n53U-0mK4aQx5fc",
  authDomain: "food-delivery-3fa78.firebaseapp.com",
  projectId: "food-delivery-3fa78",
  storageBucket: "food-delivery-3fa78.firebasestorage.app",
  messagingSenderId: "1046284268128",
  appId: "1:1046284268128:web:17a1b61ca2d5baa21b8905",
  measurementId: "G-9TKQLQ510K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Safe Analytics initialization to prevent "Component analytics has not been registered" error
export let analytics: any = null;

if (typeof window !== 'undefined') {
  // Fix: Using wildcard import and cast to any to bypass "no exported member" errors 
  // which occur in some TypeScript environments when resolving modular Firebase sub-packages.
  const analyticsLib = firebaseAnalytics as any;
  
  if (analyticsLib && typeof analyticsLib.isSupported === 'function') {
    analyticsLib.isSupported().then((supported: boolean) => {
      if (supported && typeof analyticsLib.getAnalytics === 'function') {
        analytics = analyticsLib.getAnalytics(app);
        console.log("Firebase Analytics: Initialized");
      }
    }).catch((err: any) => {
      console.warn("Firebase Analytics: Not supported in this environment", err);
    });
  }
}

export default app;