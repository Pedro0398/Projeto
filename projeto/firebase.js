// Importa as funções necessárias do Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

// 🔥 Configuração do Firebase (substitui pelos teus dados)
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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exporta a base de dados Firestore
export { db, collection, getDocs, addDoc };