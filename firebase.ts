import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCC1R7dUSCAxG1FktvfbVdEPiOvCW0-n5w",
  authDomain: "food-delivery-4c66d.firebaseapp.com",
  projectId: "food-delivery-4c66d",
  storageBucket: "food-delivery-4c66d.firebasestorage.app",
  messagingSenderId: "985390911424",
  appId: "1:985390911424:web:944c2b17983fa1820b4225",
  measurementId: "G-DT7240YMGD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;