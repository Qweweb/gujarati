import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBuK0Er2x-Qh5NlnFyxmAmdq3KrL3ujtI8",
  authDomain: "gujaratiapp-com.firebaseapp.com",
  projectId: "gujaratiapp-com",
  storageBucket: "gujaratiapp-com.firebasestorage.app",
  messagingSenderId: "238840600492",
  appId: "1:238840600492:web:placeholder" // Not critical if used via Capacitor native plugin
};

export const app = initializeApp(firebaseConfig);
