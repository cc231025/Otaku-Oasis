import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {modifySrc} from "@/utils/supabase/modules/modifyImgSrc";


//My Mobile Burger Menu implemented in my Header component
// It basically has the exact same functionalities and Links only the icons/images are smaller etc...
// And I display the Username here as well, since I have the space, and it looks cleaner in the mobile context
export default function BurgerMenu({toggleMenu, user, pathName}){

    return (
        <>
            <div className="flex flex-col gap-4 p-4 ">
                <button onClick={toggleMenu} className=" self-end rounded-full bg-main_color hover:bg-gray-50 p-2 ">

                    <Image
                        src="/icons/close.svg"
                        width={16}
                        height={16}
                        alt="Menu"
                        priority
                    />
                </button>

                <Link id="/anime"
                      className={`flex gap-2 justify-start pr-3 pl-4 lg:px-3 py-2 rounded-xl hover:bg-main_color ${pathName.startsWith('/anime')  ? 'bg-main_color text-font_brighter_highlight' : ''}`}
                      href="/anime">
                    Anime</Link>


                <Link id="/manga"
                      className={`flex gap-2 justify-start pr-3 pl-4 lg:px-3 py-2 rounded-xl hover:bg-main_color ${pathName.startsWith('/manga')   ? 'bg-main_color text-font_brighter_highlight' : ''}`}
                      href="/manga">
                    Manga</Link>

                <Link id="/forum"
                      className={`flex gap-2 justify-start pr-3 pl-4 lg:px-3 py-2 rounded-xl hover:bg-main_color ${pathName.startsWith('/forum')   ? 'bg-main_color text-font_brighter_highlight' : ''}`}
                      href="/forum">
                    Forum</Link>






                {user ?
                    (<>
                        <Link id="/AnimeList"
                              className={`flex gap-2 justify-start pr-3 pl-4 lg:px-3 py-2 rounded-xl hover:bg-main_color ${pathName.startsWith(`/user/${user.username}/animeList`)  ? 'bg-main_color text-font_brighter_highlight' : ''}`}
                              href={`/user/${user.username}/animeList`}>
                            Animelist</Link>




                        <Link id="/MangaList"
                              className={`flex gap-2 justify-start pr-3 pl-4 lg:px-3 py-2 rounded-xl hover:bg-main_color ${pathName.startsWith(`/user/${user.username}/mangaList`)  ? 'bg-main_color text-font_brighter_highlight' : ''}`}
                              href={`/user/${user.username}/mangaList`}>
                            MangaList</Link>


                        <Link id="/user"
                              className={`flex gap-2 justify-start pr-3 pl-4 lg:pr-3 lg:pl-8 py-2 rounded-xl hover:bg-main_color ${pathName === `/user/${user.username}` ? 'bg-main_color text-font_brighter_highlight' : ''}`}
                              href={`/user/${user.username}`}>
                            <div className="relative w-8 h-8">
                                <Image
                                    src={modifySrc(user.image_uuid)}
                                    layout="fill"
                                    objectFit="cover"
                                    alt="Profile Picture"
                                    className="rounded-full"
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                            {user.username}
                            </div>
                        </Link>



                    </>)





                    :
                    <Link id="/login"
                    className={`flex gap-2 justify-start pr-3 pl-4 lg:px-3 py-2 rounded-xl hover:bg-main_color ${pathName === '/login' ? 'bg-main_color text-font_brighter_highlight' : ''}`}
                    href="/login">
                    <Image
                    src="/icons/login.svg"
                    width={24}
                    height={24}
                    alt="login"
                    />
                    Login</Link>

                }

            </div>
        </>
    );
}