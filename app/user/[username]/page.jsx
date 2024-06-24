'use client'
import {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import {getUserByUsername, logout} from "@/utils/supabase/modules/userAthentication";
import {deleteCookie, getCookie} from "cookies-next";
import {useRouter} from "next/navigation";
import Loading from "@/components/loading";
import ResourceNotExisting from "@/components/ressourceNotExisting";
import {modifySrc} from "@/utils/supabase/modules/modifyImgSrc";
import {getPostsByUsername} from "@/utils/supabase/modules/userForumRelations";

// The users landing page,
// via the params.username the user is queried in supabase
export default function UserPage({params}) {
    // Set useStates, if the user is logged in he has the options to logout or change his profile image here

    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState(null)

    const [loggedIn, setLoggedIn] = useState(false)


    useEffect(() => {

        getUser()
        checkIfLoggedIn()
        getPosts()

    }, []);

    // Try to get the user, if it fails, set the User to this nice not existing message and display it
    async function getUser() {
        const user = await getUserByUsername(params.username)
        if (user.length === 0) {
            setUser('This user does not exist :/')
        } else {
            setUser(user[0])
        }
    }

    // Check if the user is logged in via the cookie,
    // Note when the user wants to actually change his profile image a save auth is method is checked again via supabase
    async function checkIfLoggedIn() {
        const userData = getCookie('user_data');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            if (parsedUser.username === params.username) {
                setLoggedIn(true)
            }
        }
    }


    async function getPosts() {
        const posts = await getPostsByUsername(params.username)
        if (posts.length === 0) {
            setPosts('No Posts yet')
        } else {
            setPosts(posts)
        }
    }


    const router = useRouter(); // get the router object


    // Handle logout with supabase and delete the user_data cookie
    const handleLogout = async (event) => {
        event.preventDefault();
        await logout();
        deleteCookie('user_data');
        router.push('/');
    };

    // Reformat the creation date of the Posts
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    }


    return (
        <><Header/>
            <div className="w-full flex justify-center ">
                <div className="w-full flex flex-col justify-center gap-8 ">
                    {user === null ?
                        <Loading/>

                        : (<>

                            {user === 'This user does not exist :/' ?


                                <ResourceNotExisting
                                    message={'This user does not exist :/'}
                                />

                                :
                                <div className="flex flex-col w-full justify-center items-center ">
                                    <div className="flex gap-16 w-full justify-center bg-background_lighter">


                                        <div
                                            className="flex gap-8 md:gap-16 w-full md:w-4/6 mx-4 md:mx-0 bg-background_lighter my-4">
                                            <div className="flex flex-col gap-4">
                                                <Image
                                                    src={modifySrc(user.image_uuid)}
                                                    width={500} // original width of the image
                                                    height={500} // original height of the image
                                                    alt="Picture of the profile"
                                                    className=" w-32   h-32 md:w-40 lg:w-60  md:h-40 lg:h-60 object-cover self-center rounded-full"
                                                />
                                                {/*If the user is logged in, display the edit and logout buttons*/}
                                                {loggedIn &&
                                                    <>
                                                        <Link
                                                            className="self-center text-font_brighter_highlight text-lg  text-center bg-main_color px-2 rounded-lg "
                                                            href={`/user/${params.username}/edit`}>Edit Image</Link>

                                                        <Link onClick={handleLogout}
                                                              className="self-center text-font_brighter_highlight text-lg  text-center bg-main_color px-2 rounded-lg "
                                                              href={`/user/${params.username}/edit`}>Logout</Link>
                                                    </>
                                                }
                                            </div>
                                            <div>
                                                <div className="flex justify-center"></div>
                                                <h1 className="text-3xl md:text-5xl text-main_color mt-32 ">{user.username}</h1>


                                            </div>

                                        </div>
                                    </div>

                                    <div
                                        className=" m-4 w-5/6 md:w-4/6 flex  lg:flex-row md:gap-0 gap-4 flex-col justify-between items-center text-font_brighter_highlight">


                                        <div
                                            className=" m-4 w-full lg:w-1/2  flex gap-4  flex-col justify-between items-center text-font_brighter_highlight ">
                                            <Link
                                                className="w-full bg-background_lighter flex justify-center mx-4 rounded-lg h-40 md:h-56 hover:text-main_color text-5xl font-bold text-white "
                                                style={{
                                                    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/animelist.jpg')",
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                                href={`/user//${params.username}/animeList`}><p
                                                className="self-center">Animelist</p></Link>
                                            <Link
                                                className="w-full bg-background_lighter flex justify-center mx-4 rounded-lg h-40 md:h-56 hover:text-main_color text-5xl font-bold text-white"
                                                style={{
                                                    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/mangalist.jpg')",
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                                href={`/user/${params.username}/mangaList`}><p
                                                className="self-center">Mangalist</p>
                                            </Link>
                                        </div>


                                        {posts === null ? (
                                            <div className="w-1/2">
                                                <Loading/>
                                            </div>
                                        ) : posts === 'No Posts yet' ? (
                                            <div
                                                className=" m-0 lg:m-4 w-full lg:w-1/2  flex flex-col self-start gap-4 p-4 justify-center bg-background_lighter text-font_brighter_highlight rounded-lg">
                                                <p className="text-center text-3xl font-bold border-b border-background pb-2"> Forum
                                                    Posts</p>
                                                <Link href={`/forum`}
                                                      className=" self-center text-xl text-main_color"> No Posts yet
                                                </Link>

                                            </div>
                                        ) : (
                                            <div
                                                className=" m-0 lg:m-4 w-full lg:w-1/2  flex flex-col self-start gap-4 p-4 justify-center bg-background_lighter text-font_brighter_highlight rounded-lg">
                                                <p className="text-center text-3xl font-bold border-b border-background pb-2"> Forum
                                                    Posts</p>

                                                {posts.map((post) => (
                                                    <Link
                                                        key={post.id}
                                                        href={`/forum/${post.id}`}
                                                        className="w-full bg-background_lighter flex justify-center  hover:bg-main_color text-3xl rounded-lg "
                                                    >
                                                        <div
                                                            className="self-center w-full px-4 py-2 border-b border-background pb-2">
                                                            <h2 className="text-lg ">{post.post_title}</h2>
                                                            <div className="flex justify-end">
                                                                <p className="self-end text-secondary_color text-sm">{formatDate(post.created_at)}</p>
                                                            </div>
                                                        </div>
                                                    </Link>

                                                ))}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            }</>)
                    }

                </div>
            </div>
        </>
    )


};
