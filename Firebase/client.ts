// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDSXXsQCqXGHTQOAazUN30huceTBU4SBWc",
    authDomain: "rayapp-2407.firebaseapp.com",
    projectId: "rayapp-2407",
    storageBucket: "rayapp-2407.firebasestorage.app",
    messagingSenderId: "606418758399",
    appId: "1:606418758399:web:c10de795ff314a6cb17aca",
    measurementId: "G-810ZRS4E51"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig): getApp();


export const auth = getAuth(app);
export const db = getFirestore(app);
