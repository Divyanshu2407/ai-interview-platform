import {ReactNode} from 'react'
import Link from "next/link";
import Image from "next/image";
import {isAuthenticated} from "@/lib/actions/auth.action";
import {redirect} from "next/navigation";


const RootLayout = async ({children}: {children : ReactNode})  => {
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) redirect('/sign-in');
    return (
        <div className = "root-layout">
            <nav>
                <Link href = "/" className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="logo" width = {78} height = {68} />
                    <h2 className = "text-primary-120">AI Interview Platform</h2>
                </Link>
            </nav>
            {children}
            </div>
    )
}
export default RootLayout
