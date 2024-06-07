// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "estateexplorere.firebaseapp.com",
    projectId: "estateexplorere",
    storageBucket: "estateexplorere.appspot.com",
    messagingSenderId: "481100629311",
    appId: "1:481100629311:web:64fa6181502a9efdaaff8a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);