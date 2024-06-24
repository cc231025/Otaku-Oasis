'use client'

import Header from "@/components/header";
import Image from "next/image";
import {getLoggedInUser} from "@/utils/supabase/modules/userAthentication";
import {useEffect, useState} from "react";
import {getCookie} from "cookies-next";
import {getPosts, uploadPost} from "@/utils/supabase/modules/userForumRelations";
import ForumPostElement from "@/components/forumElements/forumPostElement";
import Loading from "@/components/loading";


export default function ForumPage() {
    // My very basic forum
    // Set usestates for log-in state if iscreating for view toggle
    // And all the posts users have created
    const [loggedInUser, setLoggedInUser] = useState(null)
    const [isCreating, setIsCreating] = useState(false)

    const [posts, setPosts] = useState([])

    // Get the posts from supabase and check for login status

    useEffect(() => {

        queryPosts()
        loggedInUserCurrent()

    }, []);


    async function queryPosts() {

        try {
            const posts = await getPosts()
            setPosts(posts)
        } catch (error) {
            console.error(error)
        }
    }


    // Check if the user is logged in, if yes get the data from cookies
    async function loggedInUserCurrent() {

        try {
            const currentUser = await getLoggedInUser()
            const cookieValue = getCookie('user_data');
            if (cookieValue) {
                const parsedValue = JSON.parse(cookieValue);
                setLoggedInUser(parsedValue);
            }
        } catch {
            setLoggedInUser(null)
        }
    }


    // Save a post in supabase and also set it clientsided instantly
    const savePost = async (e) => {
        e.preventDefault()
        if (loggedInUser) {
            try {
                const newPost = await uploadPost(loggedInUser, document.getElementById('title').value, document.getElementById('content').value)
                setPosts([...posts, newPost])

            } catch (error) {
                console.error(error)
            }
        }
        setIsCreating(false)
    }


    return (
        <>
            <Header/>
            <div className="flex justify-center mt-20">
                <div className="flex flex-col mx-4 md:mx-0 md:w-5/6 lg:w-4/6 xl:w-3/6 gap-4 ">
                    <div className="flex justify-between px-4">
                        <h1 className="font-bold text-2xl">Recent Posts</h1>
                        {/*If the users logged in enable the create Post icon*/}
                        {loggedInUser && (
                            <div className="flex items-center gap-4 justify-center">
                                <p className="font-bold hidden sm:block">Create new</p>
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="p-2 bg-main_color rounded-full hover:bg-main_color_darker transition duration-300 ease-in-out">
                                    <Image
                                        src="/icons/edit.svg"
                                        width={24}
                                        height={24}
                                        alt="profile"
                                    />
                                </button>
                            </div>
                        )}

                    </div>


                    <div className=" bg-background_lighter px-2 md:px-8 py-4 ">
                        {/*Map the posts in reverse, to always have the newest at the top*/}

                        {posts.length === 0 ? <Loading/>
                            :
                            [...posts].reverse().map((post, index) => {
                                return <ForumPostElement key={index} post={post} index={index}/>
                            })

                        }


                    </div>
                </div>
            </div>


            {isCreating && (
                <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center">
                    <div className="absolute w-full h-full bg-background bg-opacity-50"></div>
                    <form
                        className="relative z-60 bg-background_lighter p-8 rounded-xl mx-4 md:mx-0 w-full md:w-5/6 lg:w-4/6 xl:w-3/6 flex flex-col  gap-8"
                        onSubmit={savePost}>
                        <div className="flex flex-col gap-4 ">
                            <input placeholder="Title"
                                   className="bg-main_color_darker font-bold rounded border-2 border-background drop-shadow-2xl p-1 focus:bg-main_color text-font_dark_icons_text focus:text-font_brighter_highlight"
                                   id="title" name="title" type="text" required/>
                            <textarea placeholder="Content"
                                      className="resize-none bg-main_color_darker h-72 rounded border-2 border-background drop-shadow-2xl p-1 focus:bg-main_color text-font_dark_icons_text focus:text-font_brighter_highlight"
                                      id="content" name="content" required/>
                        </div>
                        <div className="flex justify-between">
                            <button onClick={() => setIsCreating(false)}
                                    className="bg-red-950 hover:bg-main_color_darker font-bold text-lg py-2 px-3 rounded">
                                Cancel
                            </button>
                            <button type="submit"
                                    className="bg-main_color hover:bg-main_color_darker text-lg font-bold py-2 px-4 rounded">
                                Post
                            </button>

                        </div>

                    </form>
                </div>
            )}


        </>
    )

}