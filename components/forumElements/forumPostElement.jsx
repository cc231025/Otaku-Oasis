'use client'

import Image from "next/image";
import Link from "next/link";
import {post} from "axios";
import {useRouter} from "next/navigation";
import {modifySrc} from "@/utils/supabase/modules/modifyImgSrc";


export default function ForumPostElement (props) {
    // Single Post element used in the forum page
    // Lets the user check out either the authors profile or the whole post
    const router = useRouter()


    return(
        <Link href={`/forum/${props.post.id}`} className={` hover:scale-105 transition duration-300 ease-in-out flex gap-4 flex-col border-b border-background px-2 py-4 ${props.index === 0 && 'border-t'}`}>

            <div className="flex gap-2">

                <Image
                    src={modifySrc(props.post.image_uuid)}
                    width={500}
                    height={500}
                    alt="Profile Picture"
                    className="w-8 h-8 object-cover self-center rounded-full"
                />

                <div className="flex gap-2 text-center justify-end align-middle font-bold ">

                    <div className="flex flex-col justify-end text-font_brighter_highlight">
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation()
                                router.push(`/user/${props.post.username}`);
                            }}
                            className="underline hover:text-main_color"
                        >
                            {props.post.username}
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex flex-col gap-2 ">
                <h1 className="font-bold text-lg text-font_brighter_highlight">{props.post.post_title}</h1>
                <p>{props.post.post_content}</p>
            </div>
        </Link>
    )

}