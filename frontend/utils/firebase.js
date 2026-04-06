// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import{ getAuth, GoogleAuthProvider } from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginlearnsphere.firebaseapp.com",
  projectId: "loginlearnsphere",
  storageBucket: "loginlearnsphere.firebasestorage.app",
  messagingSenderId: "768249710106",
  appId: "1:768249710106:web:7e26ef281a4b4cdb7db3a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider();

export {auth,provider}