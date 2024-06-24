'use client'
import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {removeRelation, updateChapterRelation, updateRelation} from "@/utils/supabase/modules/userMangaRelations";

// Again, this is the same as animeListElement almost
// Refer to that component for more detailed comments and explanations
export default function MangaListElement ({...props}) {

    const [userMangaRelation, setUserMangaRelation] = useState(props.manga)
    const manga = props.manga.manga_JSON
    const user = props.user
    const loggedInUser = props.loggedInUser
    const isLoggedIn = (loggedInUser && user.user_id === loggedInUser.id)
    const isEditing = props.isEditing
    const setIsEditing = props.setIsEditing
    const key = props.index + 1
    const type = props.type

    const [currentChapter, setCurrentChapter] = useState(props.manga.current_chapter)

    useEffect(() => {
        setUserMangaRelation(props.manga);
    }, [props.manga]);

    const imageLoader = ({ src, width = 500, quality = 75 }) => {
        return `${src}?w=${width}&q=${quality}`
    }

    const updateChapter = async (event) => {

        if (event.target.id !== userMangaRelation.current_chapter && event.target.innerText !== 'Update') {
            props.updateMangaLists({...userMangaRelation, current_chapter: Number(event.target.id) + 1}, userMangaRelation.manga_id, false)
            const newRelation = await updateChapterRelation(user.user_id, manga.mal_id, Number(event.target.id ) +1)

        }else if (event.target.id !== userMangaRelation.current_chapter && event.target.innerText === 'Update'){
            props.updateMangaLists({...userMangaRelation, current_chapter: Number(event.target.id) + 1}, userMangaRelation.manga_id, false)
            const newRelation = await updateChapterRelation(user.user_id, manga.mal_id, event.target.id)

        }


    }

    const updateList = async (e) => {
        let planning, finished;
        switch (e.target.id) {
            case "watching":
                if (userMangaRelation.planning === false && userMangaRelation.finished === false) return false
                planning = false
                finished = false
                if (props.currentListName !== 'mangaList') props.setCurrentListName('watching')
                break;
            case 'planning':
                if (userMangaRelation.planning === true && userMangaRelation.finished === false) return false
                planning = true
                finished = false
                if (props.currentListName !== 'mangaList') props.setCurrentListName('planned')

                break;
            case 'finished':
                if (userMangaRelation.planning === false && userMangaRelation.finished === true) return false
                planning = false
                finished = true
                if (props.currentListName !== 'mangaList') props.setCurrentListName('finished')
                break
        }
        props.updateMangaLists({...userMangaRelation, planning: planning, finished: finished}, userMangaRelation.manga_id, false)
        const newRelation = await updateRelation(user.user_id, manga.mal_id, planning, finished)
    }

    const removeFromList = async (e) => {
        props.updateMangaLists({}, userMangaRelation.manga_id, true)
        await removeRelation(user.user_id, manga.mal_id)
    }

    return (
        <div className="relative group">
            <div key={key}>
                <Link href={`/manga/${manga.mal_id}`}>

                    <Image
                        loader={imageLoader}
                        src={manga.images.jpg.large_image_url}
                        width={500}
                        height={500}
                        alt="Picture of the anime"
                        className=" w-40 h-[15rem] object-cover hover:scale-105 transition duration-300 ease-in-out"

                    />
                </Link>
                <div
                    className="w-40 bg-background_lighter text-xs flex justify-between p-1">
                    <p>{manga.status}</p>
                    <p className="bg-main_color px-2 rounded">{manga.type}</p>


                </div>
                <p className="w-40 mt-2 text-xs md:text-sm ">{manga.title_english !== null ? manga.title_english : manga.title}</p>
            </div>

            {isLoggedIn && (
                <div className="absolute top-48 right-1 flex items-center justify-center ">
                    <button
                        onClick={() => setIsEditing(manga.mal_id)}
                        className="p-2 bg-main_color rounded-full hover:bg-main_color_darker transition duration-300 ease-in-out">
                        <Image
                            src="/icons/edit.svg"
                            width={18}
                            height={18}
                            alt="profile"
                        />
                    </button>
                </div>
            )}

            {isEditing === manga.mal_id && (
                <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center">
                    <div className="absolute w-full h-full bg-background bg-opacity-50"
                         onClick={() => setIsEditing(null)}></div>
                    <div className="relative z-60 bg-background_lighter p-8 rounded-xl  max-h-1/2 mx-4 md:mx-0 w-full md:w-5/6 lg:w-1/2">
                        <div className="flex flex-col py-1 justify-between gap-12">
                            <p className={`text-font_brighter_highlight flex-1 text-center flex justify-center items-center ${manga.title.length > 30 ? 'text-lg' : 'text-2xl'}`}>
                                {manga.title_english !== null ? manga.title_english : manga.title}
                            </p>
                            <div>
                                <p className="text-lg">Chapters</p>
                                <div className="flex gap-2 flex-wrap mt-4 overflow-auto max-h-[14rem]">
                                    {manga.chapters !== null ? (
                                            <>
                                                {Array.from({length: manga.chapters}).map((_, index) => (
                                                    <button onClick={(isLoggedIn) ? updateChapter : undefined}
                                                            className={`p-1 border hover:bg-main_color border-black rounded w-10 bg-background_lighter ${(userMangaRelation !== undefined && (userMangaRelation.finished === true || userMangaRelation.current_chapter >= index + 1)) && 'bg-main_color'}`}
                                                            key={index} id={index}>
                                                        {index + 1}
                                                    </button>
                                                ))}
                                            </>
                                        ) :

                                        (
                                            <div className="flex flex-col gap-2 pl-4 pb-2">
                                                {userMangaRelation !== undefined ? (
                                                    <>
                                                        <p>Enter your last watched chapter to track it!</p>
                                                        <div className="flex items-center gap-2">

                                                            <input
                                                                type="number"
                                                                value={currentChapter === 0 ? '' : currentChapter}
                                                                onChange={(e) => setCurrentChapter(e.target.value === '0' ? '' : Number(e.target.value))}
                                                                onKeyDown={(e) => {
                                                                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                className="w-24 py-1  border border-black rounded bg-background_lighter text-center"
                                                            />

                                                            <button
                                                                id={currentChapter}
                                                                onClick={userMangaRelation !== undefined ? (e) => updateChapter(e) : undefined}
                                                                className="p-1 border hover:bg-main_color border-black rounded bg-background_lighter"
                                                            >
                                                                Update
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p>Add to list to track your last watched chapter</p>
                                                )}
                                            </div>
                                        )}

                                </div>
                            </div>
                            <div className="flex gap-4 justify-between flex-wrap ">
                                <div className="flex gap-4 flex-wrap ">
                                    <button onClick={updateList} id="watching"
                                            className={`hover:bg-main_color_darker font-bold text-base md:text-lg py-2 px-3 rounded ${userMangaRelation.planning === false && userMangaRelation.finished === false ? 'bg-main_color' : 'bg-background_lighter'}`}>
                                        Watching
                                    </button>
                                    <button onClick={updateList} id="finished"
                                            className={`hover:bg-main_color_darker font-bold text-base md:text-lg py-2 px-3 rounded ${userMangaRelation.finished === true ? 'bg-main_color' : 'bg-background_lighter'}`}>
                                        Finished
                                    </button>
                                    <button onClick={updateList} id="planning"
                                            className={`hover:bg-main_color_darker font-bold text-base md:text-lg py-2 px-3 rounded ${userMangaRelation.planning === true ? 'bg-main_color' : 'bg-background_lighter'}`}>
                                        Planning
                                    </button>
                                    <button onClick={removeFromList}
                                            className="bg-red-950 hover:bg-main_color_darker font-bold text-base md:text-lg py-2 px-3 rounded">
                                        Remove
                                    </button>
                                </div>
                                <div className="flex justify-end w-full">
                                    <button onClick={() => setIsEditing(null)}
                                            className="bg-main_color hover:bg-main_color_darker text-lg font-bold py-2 px-4 rounded">
                                        Done
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
