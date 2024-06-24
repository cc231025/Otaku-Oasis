// pages/404.js or pages/404.tsx
import Link from 'next/link';
import Header from "@/components/header";
import Image from "next/image";
import React from "react";

//Through some more NextJS routing magic this site is always displayed when an invalid Route is entered
export default function NotFound() {
    return (
        <>
            <Header/>
            <div className="w-full h-[calc(100vh-5rem)] flex flex-col gap-16 justify-center items-center">
                <div className="flex">
                    <p className="text-9xl mr-4 text-main_color"> 4</p>
                    <Image
                        src="/sharingan.png"
                        width={500}
                        height={500}
                        alt="404 Pizza"
                        className=" w-32 h-32 object-cover rounded-xl animate-spin-slow"
                        priority
                    />
                    <p className="text-9xl ml-4 text-main_color"> 4</p>
                </div>

                <h1 className="text-3xl"> Page not found</h1>
                <Link href="/">
                </Link>
            </div>
        </>
    );
}