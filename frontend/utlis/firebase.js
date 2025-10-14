// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "playtubelogin-2e200.firebaseapp.com",
  projectId: "playtubelogin-2e200",
  storageBucket: "playtubelogin-2e200.firebasestorage.app",
  messagingSenderId: "893360410747",
  appId: "1:893360410747:web:28779d4cf9787bd23352de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider}