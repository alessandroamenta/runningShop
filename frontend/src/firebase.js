// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5prcXSEvGh6_RxhiZPLUThwVixvqX4i8",
  authDomain: "ecommerce-d01ec.firebaseapp.com",
  projectId: "ecommerce-d01ec",
  storageBucket: "ecommerce-d01ec.appspot.com",
  messagingSenderId: "1042084638796",
  appId: "1:1042084638796:web:97732631c72432233e84e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { auth, db, functions };