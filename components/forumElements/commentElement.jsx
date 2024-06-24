'use client'

import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import {modifySrc} from "@/utils/supabase/modules/modifyImgSrc";

// Single Comment element used in the single Post view
export default function CommentElement({
                                           comment,
                                           isEditing,
                                           setIsEditing,
                                           post,
                                           loggedInUser,
                                           saveCommentEditParent,
                                           deleteComment
                                       }) {
    // UseState to instantly change the comment content without having to wait for supabase response on edit
    const [commentContent, setCommentContent] = useState(comment.comment_content);


    // When the user clicks cancel in edit view, we reset the commentcontent to its original state
    const resetCommentContent = () => {
        setCommentContent(comment.comment_content)
        setIsEditing({
            status: false,
            comment_id: null
        })
    }


    // Save the edit, if the value didn't change return, otherwise upload to supabase
    const saveCommentEdit = (e) => {
        e.preventDefault()
        setIsEditing({
            status: false,
            comment_id: null
        })

        if (comment.comment_content === commentContent) {
            return
        }

        saveCommentEditParent(comment.id, commentContent)
    }

    return (

        <>

            <div className="flex justify-between pr-4 ">
                <div className="flex gap-2 ">

                    <Image
                        src={modifySrc(comment.image_uuid)}
                        width={500}
                        height={500}
                        alt="Profile Picture"
                        className="w-6 h-6 object-cover self-center rounded-full"
                    />

                    <div
                        className="flex gap-2 text-center justify-end align-middle font-bold ">

                        <div
                            className="flex flex-col justify-end text-font_brighter_highlight">
                            <Link className="underline hover:text-main_color "
                                  href={`/user/${comment.username}`}> {comment.username}</Link>

                        </div>

                    </div>
                </div>
                {(loggedInUser && loggedInUser.user_id === comment.user_id) &&

                    <div className="flex flex-col justify-end text-font_brighter_highlight">

                        <button
                            onClick={() => setIsEditing({
                                status: true,
                                comment_id: comment.id
                            })}
                            className="p-1 bg-main_color rounded-full hover:bg-main_color_darker transition duration-300 ease-in-out">
                            <Image
                                src="/icons/edit.svg"
                                width={20}
                                height={20}
                                alt="profile"
                            />
                        </button>
                    </div>


                }
            </div>
            <p>{comment.comment_content}</p>


            <div className="grid grid-cols-2 pr-4 w-full">
                <div className="flex flex-col justify-end">
                    {comment.edited &&
                        <p className="text-xs justify-self-start font-bold text-secondary_color">edited</p>}
                </div>
                {(loggedInUser && loggedInUser.user_id === comment.user_id) &&
                    <button
                        className="p-1 bg-red-800 justify-self-end rounded-full hover:bg-orange-700 transition duration-300 ease-in-out"
                        onClick={() => {
                            deleteComment(comment.id)
                        }}>

                        <Image
                            src="/icons/close.svg"
                            width={20}
                            height={20}
                            alt="Menu"
                            priority
                        />
                    </button>
                }
            </div>

            {/*Display the edit view if isEditing is true and its the current id that is edited*/}
            {(isEditing.status && isEditing.comment_id === comment.id) && (
                <div
                    className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center">
                    <div
                        className="absolute w-full h-full bg-background bg-opacity-50"></div>
                    <form onSubmit={saveCommentEdit}
                          className="relative z-60 bg-background_lighter p-8 rounded-xl mx-4 md:mx-0 md:w-5/6 lg:w-4/6 xl:w-3/6 w-full flex flex-col  gap-8"
                    >
                        <div className="flex flex-col gap-4 ">
                            <textarea placeholder="Comment"
                                      value={commentContent}
                                      onChange={(e) => setCommentContent(e.target.value)}
                                      className="resize-none bg-main_color_darker h-48 rounded border-2 border-background drop-shadow-2xl p-1 focus:bg-main_color text-font_dark_icons_text focus:text-font_brighter_highlight"
                                      id="content" name="content" required/>
                        </div>
                        <div className="flex justify-between">
                            <button onClick={resetCommentContent}
                                    className="bg-red-950 hover:bg-main_color_darker font-bold text-lg py-2 px-3 rounded">
                                Cancel
                            </button>

                            <button type="submit"
                                    className="bg-main_color hover:bg-main_color_darker text-lg font-bold py-2 px-4 rounded">
                                Edit
                            </button>

                        </div>

                    </form>
                </div>
            )}


        </>
    )
}