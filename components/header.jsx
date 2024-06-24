'use client'

import React, {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import BurgerMenu from "@/components/burgerMenu";
import {getCookie} from "cookies-next";
import {modifySrc} from "@/utils/supabase/modules/modifyImgSrc";


export default function Header() {
    // On first render get the cookie value if there is one, the current pathname and set the current user

    const [user, setUser] = useState(null);

    useEffect(() => {
        setPathName(window.location.pathname);
        const cookieValue = getCookie('user_data');
        if (cookieValue) {
            const parsedValue = JSON.parse(cookieValue);
            setUser(parsedValue);
        }

    }, []);


    // State for managing the mobile menu open/close status
    const [isOpen, setIsOpen] = useState(false);

    // toggle the mobile/burger menu
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // State to track if the client has loaded

    // State to store the current path name, this is used to highlight our position on the site
    const [pathName, setPathName] = useState('');


    return (
        <>
            <div className="w-full flex justify-center bg-background_lighter">
                <div
                    className=" z-10 p-4 pr-12  flex font-bold items-center justify-between w-full md:w-4/6 h-24  sticky top-0 bg-background_lighter">

                    <div className=" md:flex flex-1 ">


                        <div className="text-xl font-bold text-center flex items-end">
                            <Link
                                className="flex text-blue-700 px-3 bg-main_color py-2 rounded-xl hover:bg-main_color ${"
                                href="/">
                                <Image
                                    src={'/icons/about.svg'}
                                    width={15}
                                    height={15}
                                    alt="Logo"
                                    className="align-center w-auto h-auto min-h-6 min-w-6 inline-block align-bottom "
                                    priority
                                />
                            </Link>
                        </div>


                    </div>

                    {/* MOBILE MENU ICON */}
                    <div className="lg:hidden relative flex gap-8 items-center justify-end flex-1">

                        <button onClick={toggleMenu}>
                            <Image
                                src="/icons/burgerMenu.svg"
                                width={24}
                                height={24}
                                alt="Menu"
                                priority
                            />


                        </button>


                    </div>

                    {/* RIGHT LINKS */}
                    <div className="hidden lg:flex gap-4 xl:gap-8 items-center justify-end flex-1">

                        <Link id="/anime"
                              className={`flex gap-2 justify-end pr-3 pl-8 lg:px-3 py-2 rounded-xl hover:bg-main_color ${pathName.startsWith('/anime') ? 'bg-main_color text-font_brighter_highlight' : ''}`}
                              href="/anime">
                            Anime</Link>

                        <Link id="/manga"
                              className={`flex gap-2 justify-end pr-3 pl-8 lg:px-3 py-2 rounded-xl hover:bg-main_color ${pathName.startsWith('/manga') ? 'bg-main_color text-font_brighter_highlight' : ''}`}
                              href="/manga">
                            Manga</Link>


                        <Link id="/forum"
                              className={`flex gap-2 justify-end pr-3 pl-8 lg:px-3 py-2 rounded-xl hover:bg-main_color ${pathName.startsWith('/forum') ? 'bg-main_color text-font_brighter_highlight' : ''}`}
                              href="/forum">
                            Forum</Link>


                        {/*If the user is logged in display nav elements to his lists and his profile*/}
                        {user !== null ?
                            (<>

                                <Link id="/AnimeList"
                                      className={`flex gap-2 justify-end pr-3 pl-8 lg:px-3 py-2 rounded-xl hover:bg-main_color ${pathName.startsWith(`/user/${user.username}/animeList`) ? 'bg-main_color text-font_brighter_highlight' : ''}`}
                                      href={`/user/${user.username}/animeList`}>
                                    Animelist</Link>


                                <Link id="/MangaList"
                                      className={`flex gap-2 justify-end pr-3 pl-8 lg:px-3 py-2 rounded-xl hover:bg-main_color ${pathName.startsWith(`/user/${user.username}/mangaList`) ? 'bg-main_color text-font_brighter_highlight' : ''}`}
                                      href={`/user/${user.username}/mangaList`}>
                                    MangaList</Link>


                                <Link
                                    id="/user"
                                    className={`flex items-center gap-4 justify-end p-1 rounded-full hover:bg-main_color ${
                                        pathName === `/user/${user.username}` ? 'bg-main_color text-font_brighter_highlight' : ''
                                    }`}
                                    href={`/user/${user.username}`}
                                >
                                    <div className="relative w-14 h-14">
                                        <Image
                                            src={modifySrc(user.image_uuid)}
                                            layout="fill"
                                            objectFit="cover"
                                            alt="Profile Picture"
                                            className="rounded-full"
                                        />
                                    </div>
                                    {/*<span className="self-center text-base">{user.username}</span>*/}
                                </Link>


                            </>)
                            // Otherwise a nav element to login

                            :
                            <Link id="/login"
                                  className={`flex gap-2 justify-end pr-3 pl-8 lg:px-3 py-2 rounded-xl hover:bg-main_color ${pathName.startsWith('/login') ? 'bg-main_color text-font_brighter_highlight' : ''}`}
                                  href="/login">
                                <Image
                                    src="/icons/login.svg"
                                    width={24} // adjust according to your needs
                                    height={24} // adjust according to your needs
                                    alt="login"
                                />
                                Login</Link>
                        }

                    </div>


                </div>
                {/*    Determine if Mobile should be open, translate to also adjust the bg of the mobile view if it is open or not
            Basically with translate we create the slide in slide out animation*/}
                <div
                    className="dropdown-menu w-2/3 full lg:hidden fixed h-screen bg-opacity-95 bg-background_lighter top-[6rem] left-0 z-20 transition-transform duration-200 ease-in-out drop-shadow-2xl"
                    style={{transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'}}>
                    {isOpen && (
                        <BurgerMenu toggleMenu={toggleMenu} user={user} pathName={pathName}/>

                    )}
                </div>
            </div>


        </>
    );
};

