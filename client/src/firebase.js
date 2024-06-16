// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-be1e8.firebaseapp.com",
  projectId: "mern-auth-be1e8",
  storageBucket: "mern-auth-be1e8.appspot.com",
  messagingSenderId: "577212442570",
  appId: "1:577212442570:web:54ad0588047aee35969133"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);