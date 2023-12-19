// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-64ef0.firebaseapp.com",
  projectId: "mern-estate-64ef0",
  storageBucket: "mern-estate-64ef0.appspot.com",
  messagingSenderId: "103460243758",
  appId: "1:103460243758:web:802794f80b4272e7db52bf"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);