import Image from "next/image";
import Link from "next/link";

//Just used to show a sharingan - not spinning - and a message which we can pass if a resource cant be found
export default function ResourceNotExisting(props) {

    return (
        <div className="w-full h-[calc(100vh-5rem)] flex flex-col gap-16 justify-center items-center">
            <div className="flex flex-col gap-10 justify-center">
                <div className="flex justify-center">
                <Image
                    src="/sharingan.png"
                    width={500}
                    height={500}
                    alt="404 Pizza"
                    className="w-32 h-32 object-cover rounded-xl"
                    priority
                />
                </div>
                <h1 className="text-4xl font-bold text-font_brighter_highlight">{props.message}</h1>
            </div>

        </div>
    )
}