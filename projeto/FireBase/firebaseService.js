import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export class FirebaseService {
    constructor() {
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

        // Inicializar Firebase
        const app = initializeApp(firebaseConfig);
        this.db = getFirestore(app);
    }

    // Buscar produtos da coleção "products"
    async getCollection(collectionName) {
        const collectionArray = [];
        const collectionRef = collection(this.db, collectionName);
        const snapshot = await getDocs(collectionRef);

        snapshot.forEach((doc) => {
            collectionArray.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return collectionArray;
    }

    async updateCollection(collectionName, name, ref, id){
        const docRef = doc(this.db, collectionName, id);
        await updateDoc(docRef, {
            name: `${name}`,
            ref: `${ref}`
          });
    }

    // Adicionar produto
    async addProduct(name, ref, img) {
        try {
            const productsRef = collection(this.db, "products");
            const docRef = await addDoc(productsRef, {
                name: `${name}`,
                ref: `${ref}`,
                img: `${img}`
            });
            return {
                success: true,
                id: docRef.id
            };
        } catch (error) {
            console.error("Erro ao adicionar produto:", error);
            return {
                success: false,
                error
            };
        }
    }

    // Deletar produto
    async deleteProduct(productId) {
        try {
            const docRef = doc(this.db, "products", productId);
            await deleteDoc(docRef);
            return { success: true };
        } catch (error) {
            console.error("Erro ao apagar documento:", error);
            return {
                success: false,
                error
            };
        }
    }
}