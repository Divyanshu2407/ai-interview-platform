import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getApps, cert, initializeApp } from "firebase-admin/app";

const initFirebaseAdmin = () => {

    const apps = getApps();

        if(!apps.length){
            initializeApp({
                credential: cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                }),
            });
        }
        return{
            auth: getAuth(),
            db: getFirestore()
        };
};

export const {auth, db} = initFirebaseAdmin();