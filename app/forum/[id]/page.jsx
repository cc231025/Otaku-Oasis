'use client'


import {useEffect, useState} from "react";
import {getLoggedInUser} from "@/utils/supabase/modules/userAthentication";
import {getCookie} from "cookies-next";
import {
    getSinglePost,
    removeComment,
    uploadComment,
    uploadCommentEdit
} from "@/utils/supabase/modules/userForumRelations";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import CommentElement from "@/components/forumElements/commentElement";
import Loading from "@/components/loading";
import ResourceNotExisting from "@/components/ressourceNotExisting";
import {modifySrc} from "@/utils/supabase/modules/modifyImgSrc";

export default function SinglePost({params}) {
    // Same as the main forum page
    // Just get only a single post, and allow users to edit delete or create their comments

    const [loggedInUser, setLoggedInUser] = useState(null)
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState({})

    const [isCreating, setIsCreating] = useState(false)
    const [isEditing, setIsEditing] = useState({
        status: false,
        comment_id: null
    })


    useEffect(() => {

        queryPost()
        loggedInUserCurrent()

    }, []);


    async function queryPost() {

        try {
            const {post, comments} = await getSinglePost(params.id)

            setPost(post)
            setComments(comments)
        } catch (error) {
            setPost('Post does not exist')
        }
    }

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


    // Save the comment in supabase and set it client sided
    const saveComment = async (e) => {
        e.preventDefault()
        if (loggedInUser) {
            try {
                const newComment = await uploadComment(loggedInUser, post, document.getElementById('content').value)
                setComments([...comments, newComment])

            } catch (error) {
                console.error(error)
            }

        }

        setIsCreating(false)
    }


    // Save an edited comment, this uploadeCommentEdit will also return the editedComment which will have the edited parameter set to true
    // This determines if the edited note will be displayed or not
    const saveCommentEdit = async (comment_id, comment_content) => {
        if (loggedInUser) {
            try {
                const editedComment = await uploadCommentEdit(comment_id, comment_content)
                setComments(comments.map(comment => comment.id === editedComment.id ? editedComment : comment));
            } catch (error) {
                console.error(error)
            }

        }
    }


    const deleteComment = async (comment_id) => {
        if (loggedInUser) {
            try {
                await removeComment(comment_id)
                setComments(comments.filter(comment => comment.id !== comment_id));
            } catch (error) {
                console.error(error)
            }

        }
    }


    return (
        <>
            <Header/>
            {/*Handle Errors and invalid Post Ids*/}

            {post === null ? (<Loading/>)
                :
                <>

                    {post === 'Post does not exist' ?

                        <ResourceNotExisting

                            message={'Post does not exist :/'}
                        />


                        :

                        //         Set the posters profile image fetched from the posts image uuid parameter
                        <div className="flex justify-center mt-20">
                            <div className="flex flex-col mx-4 md:mx-0 w-full md:w-5/6 lg:w-4/6 xl:w-3/6 gap-4">
                                <div className=" bg-background_lighter px-10 py-8  flex gap-4 flex-col ">


                                    <div className="flex gap-2">

                                        <Image
                                            src={modifySrc(post.image_uuid)}
                                            width={500}
                                            height={500}
                                            alt="Profile Picture"
                                            className="w-8 h-8 object-cover self-center rounded-full"
                                        />

                                        <div className="flex gap-2 text-center justify-end align-middle font-bold ">

                                            <div className="flex flex-col justify-end text-font_brighter_highlight">
                                                <Link className="underline hover:text-main_color "
                                                      href={`/user/${post.username}`}> {post.username}</Link>

                                            </div>

                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 ">
                                        <h1 className="font-bold text-lg text-font_brighter_highlight">{post.post_title}</h1>
                                        <p>{post.post_content}</p>
                                    </div>
                                    {/*Enable Comment Button if logged in*/}
                                    {loggedInUser &&
                                        <button onClick={() => {
                                            setIsCreating(true)
                                        }}
                                                className="self-end bg-main_color hover:bg-main_color_darker text-font_brighter_highlight rounded px-2 py-1 ">Comment</button>
                                    }
                                    <hr className=""></hr>


                                    {/*Map through all comments and pass the necessary props to every single one*/}
                                    <div className="flex flex-col gap-2 pl-4">
                                        <h1 className="font-bold text-lg text-font_brighter_highlight">Comments</h1>
                                        {comments.map((comment, index) => (
                                            <div key={index}
                                                 className={`flex flex-col gap-2 py-2 border-b ${index === 0 && 'border-t'}`}>

                                                <CommentElement
                                                    saveCommentEditParent={saveCommentEdit}
                                                    deleteComment={deleteComment}
                                                    comment={comment}
                                                    isEditing={isEditing}
                                                    setIsEditing={setIsEditing}
                                                    post={post}
                                                    loggedInUser={loggedInUser}/>

                                            </div>


                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                </>
            }

            {/*Enable create view if the user is creating a new comment ...*/}
            {isCreating && (
                <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center">
                    <div className="absolute w-full h-full bg-background bg-opacity-50"></div>
                    <form
                        className="relative z-60 bg-background_lighter p-8 rounded-xl w-full mx-4 md:mx-0 md:w-5/6 lg:w-4/6 xl:w-3/6  flex flex-col  gap-8"
                        onSubmit={saveComment}>
                        <div className="flex flex-col gap-4 ">
                            <textarea placeholder="Comment"
                                      className="resize-none bg-main_color_darker h-48 rounded border-2 border-background drop-shadow-2xl p-1 focus:bg-main_color text-font_dark_icons_text focus:text-font_brighter_highlight"
                                      id="content" name="content" required/>
                        </div>
                        <div className="flex justify-between">
                            <button onClick={() => setIsCreating(false)}
                                    className="bg-red-950 hover:bg-main_color_darker font-bold text-lg py-2 px-3 rounded">
                                Cancel
                            </button>
                            <button type="submit"
                                    className="bg-main_color hover:bg-main_color_darker text-lg font-bold py-2 px-4 rounded">
                                Comment
                            </button>

                        </div>

                    </form>
                </div>
            )}


        </>
    )
}
