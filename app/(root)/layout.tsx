import { ReactNode } from 'react'
import Link from "next/link";
import Image from "next/image";
import {isAuthenticated, signOut} from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";


const RootLayout = async ({children}: {children : ReactNode})  => {
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) redirect('/sign-in');
    return (
        <div className = "root-layout">
            <nav className="flex justify-between items-center px-5 py-1 shadow-md ">
                <Link href = "/" className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="logo" width = {78} height = {68} />
                    <h2 className = "text-primary-120"> PulseAI Prep </h2>
                </Link>

                <form action={signOut}>
                    <button
                        type="submit"
                        className="px-5 py-1 bg-pink-400 hover:bg-red-500 text-black font-bold rounded-full shadow-md
                       transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                        Log out
                    </button>
                </form>
            </nav>
                    {children}
            </div>
    )
}
export default RootLayout
