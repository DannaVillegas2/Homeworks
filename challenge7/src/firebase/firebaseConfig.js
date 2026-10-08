import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxWeoLd-58CYTM3uF_vF8DwFylpmNjtzA",
  authDomain: "challenge7-78b7f.firebaseapp.com",
  projectId: "challenge7-78b7f",
  storageBucket: "challenge7-78b7f.firebasestorage.app",
  messagingSenderId: "60768195544",
  appId: "1:60768195544:web:d4148a8161c54c520258ad",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;