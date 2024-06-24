import Image from "next/image";
import Link from "next/link";

//A spinning Mangeco Sharingan, because it looks cool
// Used every time the client is still waiting for backend information either from supabase or Jikan API calls
export default function Loading() {

    return (
        <div className="w-full h-[calc(100vh-5rem)] flex flex-col gap-16 justify-center items-center">
            <div className="flex">
                <Image
                    src="/sharingan.png"
                    width={500}
                    height={500}
                    alt="404 Pizza"
                    className="w-32 h-32 object-cover rounded-xl animate-spin-slow"
                    priority
                />
            </div>

        </div>
    )
}