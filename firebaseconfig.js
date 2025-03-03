// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2QDJJb0LXEkEaqHx74n7yMoBsu6GEQ6g",
  authDomain: "boticario-b56db.firebaseapp.com",
  databaseURL: "https://boticario-b56db-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "boticario-b56db",
  storageBucket: "boticario-b56db.firebasestorage.app",
  messagingSenderId: "161696311980",
  appId: "1:161696311980:web:f6e59819d2b9136e054d09",
  measurementId: "G-HS8BTHKJMR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };