// Importa las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Importa Firestore

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBv5ipir0BGX42WZXWZrnictMClaJ5FVao",
    authDomain: "openlab-dd1fc.firebaseapp.com",
    projectId: "openlab-dd1fc",
    storageBucket: "openlab-dd1fc.firebasestorage.app",
    messagingSenderId: "888456062103",
    appId: "1:888456062103:web:6f37fd8558cf9c433035d2"
};

// Inicializa Firebase
const appFirebase = initializeApp(firebaseConfig);
export const auth = getAuth(appFirebase); // Autenticación
export const db = getFirestore(appFirebase); // Firestore
export default appFirebase;
