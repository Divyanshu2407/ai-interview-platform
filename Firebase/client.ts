import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDSXXsQCqXGHTQOAazUN30huceTBU4SBWc",
    authDomain: "rayapp-2407.firebaseapp.com",
    projectId: "rayapp-2407",
    storageBucket: "rayapp-2407.firebasestorage.app",
    messagingSenderId: "606418758399",
    appId: "1:606418758399:web:c10de795ff314a6cb17aca",
    measurementId: "G-810ZRS4E51"
};

const app = !getApps().length ? initializeApp(firebaseConfig): getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
