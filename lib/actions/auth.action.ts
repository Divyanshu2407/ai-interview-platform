'use server';


import { db, auth } from "@/Firebase/admin";
import {cookies} from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams){
    const{ uid, name, email } = params;

    try{
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists){
            return {
                success: false,
                message: `User already exists!`,
            };
        }
        await db.collection('users').doc(uid).set({ name, email});

        return {
        success: true,
        message: "Account created successfully. Please sign in.",
        };
    } catch (error: any ) {
        console.error('Error creating a user', error);

        if(error.code === 'auth/email-already-exists'){
            return{
                success: false,
                message: "Email already exists",
            };
        }
        return {
            success: false,
            message: "Failed to create an account. Please sign in again.",
        };
    }
}

export async function signIn(params: SignInParams){
    const {email, idToken} = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if (!userRecord) {
            return {
                success: false,
                message: " User doesn't exist. Please create an account.",
            }
        };

        await setSessionCookie(idToken);
        return {
            success: true,
            message: `Successfully logged in!`,
        };

    } catch (error: any){
        console.log("Sign-in error:", error);

        return {
            succeess: false,
            messsage: "Failed to log into account. Please try again.",
        };
    }
}

export async function setSessionCookie(idToken: string){
    const cookieStore = await cookies();
try{
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK*1000,
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'

    });
} catch(error){
    console.error("❌ Error creating session cookie:", error);
    throw new Error("Failed to create session cookie.");
}
}

export async function getCurrentUser(): Promise<User | null >{

    const cookieStore = await cookies();

     const sessionCookie  = cookieStore.get('session')?.value;
     if(!sessionCookie) return null;

     try{
         const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

         const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

         if(!userRecord.exists) return null;

         return{
             ...userRecord.data(),
             id: userRecord.id,
         } as User;


     }catch(error){
         console.log(error)

         return null;
     }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user;
}