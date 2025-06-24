
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxZSLcR3rkbmqzLr9KznbWWLDfLS_zhik",
  authDomain: "bike-buddies-22239.firebaseapp.com",
  projectId: "bike-buddies-22239",
  storageBucket: "bike-buddies-22239.firebasestorage.app",
  messagingSenderId: "408557536326",
  appId: "1:408557536326:web:1a580e1f890b7222db3647",
  measurementId: "G-PB1SX8R6DC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
