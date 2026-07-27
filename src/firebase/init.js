// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5SObt6nA64x2gm96PQHvkC-3uTmSe_Qg",
  authDomain: "project-yuhanpei.firebaseapp.com",
  projectId: "project-yuhanpei",
  storageBucket: "project-yuhanpei.firebasestorage.app",
  messagingSenderId: "979669416366",
  appId: "1:979669416366:web:bc03ed281bd5987f6e303f"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();
export default db;
