'use client'
import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {removeRelation, updateEpisodeRelation, updateRelation} from "@/utils/supabase/modules/userAnimeRelations";

export default function AnimeListElement ({...props}) {

    // Here get all the props, although I should have done this with deconstructing the props ...
    // Well now I know that it is possible

    const [userAnimeRelation, setUserAnimeRelation] = useState(props.anime)
    const anime = props.anime.anime_JSON
    const user = props.user
    const loggedInUser = props.loggedInUser
    const isLoggedIn = (loggedInUser && user.user_id === loggedInUser.id)
    const isEditing = props.isEditing
    const setIsEditing = props.setIsEditing
    const key = props.index + 1
    const type = props.type

    const [currentEpisode, setCurrentEpisode] = useState(props.anime.current_episode)

    // On any change to the anime props reset the relation
    useEffect(() => {
        setUserAnimeRelation(props.anime);
    }, [props.anime]);


    // To update the current episode, we first check for the event inner text
    // I just used this to separate between animes that are finished or airing.
    // Airing animes have episodes=null, so I have to let the user set them manually
    const updateEpisode = async (event) => {

        if (event.target.id !== userAnimeRelation.current_episode && event.target.innerText !== 'Update') {

            // Note that the difference here is simply if we pass event.target.id or / +1
            // This is because some poor management from my side, but it is a way that works reliably still
            // Basically when we map the current episodes (if there are some) we have 0 based index so the id will be -1
            // On manual input we don't have that, I realize now I could have achieved this a lot easier ...
            props.updateAnimeLists({...userAnimeRelation, current_episode: Number(event.target.id) + 1}, userAnimeRelation.anime_id, false)
            const newRelation = await updateEpisodeRelation(user.user_id, anime.mal_id, Number(event.target.id) + 1)

        }else if (event.target.id !== userAnimeRelation.current_episode && event.target.innerText === 'Update'){


            props.updateAnimeLists({...userAnimeRelation, current_episode: Number(event.target.id) + 1}, userAnimeRelation.anime_id, false)
            const newRelation = await updateEpisodeRelation(user.user_id, anime.mal_id, event.target.id)

        }


    }

    // Update the animes watch state (watching, finished, planning)
    // Here we first determine what we have to change,
    // then push it top superbas, and finally pass it to the parent component to update the whole list
    const updateList = async (e) => {
        let planning, finished;
        switch (e.target.id) {
            case "watching":
                if (userAnimeRelation.planning === false && userAnimeRelation.finished === false) return false
                planning = false
                finished = false
                if (props.currentListName !== 'animeList') props.setCurrentListName('watching')
                break;
            case 'planning':
                if (userAnimeRelation.planning === true && userAnimeRelation.finished === false) return false
                planning = true
                finished = false
                if (props.currentListName !== 'animeList') props.setCurrentListName('planned')

                break;
            case 'finished':
                if (userAnimeRelation.planning === false && userAnimeRelation.finished === true) return false
                planning = false
                finished = true
                if (props.currentListName !== 'animeList') props.setCurrentListName('finished')
                break
        }
        props.updateAnimeLists({...userAnimeRelation, planning: planning, finished: finished}, userAnimeRelation.anime_id, false)
        const newRelation = await updateRelation(user.user_id, anime.mal_id, planning, finished)
    }

    // Remove it from the whole list via parentComponentFunction and scrap the relation in supabase
    const removeFromList = async (e) => {
        props.updateAnimeLists({}, userAnimeRelation.anime_id, true)
        await removeRelation(user.user_id, anime.mal_id)
    }

    const imageLoader = ({ src, width = 500, quality = 75 }) => {
        return `${src}?w=${width}&q=${quality}`
    }

    return (
        <div className="relative group ">
            <div key={key}>
                <Link href={`/anime/${anime.mal_id}`}>

                    <Image
                        loader={imageLoader}
                        src={anime.images.jpg.large_image_url}
                        width={500} // original width of the image
                        height={500} // original height of the image
                        alt="Picture of the anime"
                        className=" w-40 h-[15rem] object-cover hover:scale-105 transition duration-300 ease-in-out"

                    />
                </Link>
                <div
                    className="w-40 bg-background_lighter text-xs flex justify-between p-1">
                    <p>{anime.status}</p>
                    <p className="bg-main_color px-2 rounded">{anime.type}</p>


                </div>
                <p className="w-40 mt-2 text-xs md:text-sm ">{anime.title_english !== null ? anime.title_english : anime.title}</p>
            </div>

            {/*Display the edit button only when the current logged in user is the 'owner' of this animelist*/}
            {isLoggedIn && (
                <div className="absolute top-48 right-1 flex items-center justify-center ">
                    <button
                        onClick={() => setIsEditing(anime.mal_id)}
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

            {/*Display the edit UI for the anime and pass the changes to the handler functions*/}
            {isEditing === anime.mal_id && (
                <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center">
                    <div className="absolute w-full h-full bg-background bg-opacity-50"
                         onClick={() => setIsEditing(null)}></div>
                    <div className="relative z-60 bg-background_lighter p-8 rounded-xl  max-h-1/2 mx-4 md:mx-0 w-full md:w-5/6 lg:w-1/2">
                        <div className="flex flex-col py-1 justify-between gap-12">
                            <p className={`text-font_brighter_highlight flex-1 text-center flex justify-center items-center ${anime.title.length > 30 ? 'text-lg' : 'text-2xl'}`}>
                                {anime.title_english !== null ? anime.title_english : anime.title}
                            </p>
                            <div>
                                <p className="text-lg">Episodes</p>
                                <div className="flex gap-2 flex-wrap mt-4 overflow-auto max-h-[14rem]">
                                    {anime.episodes !== null ? (
                                            <>
                                                {Array.from({length: anime.episodes}).map((_, index) => (
                                                    <button onClick={(isLoggedIn) ? updateEpisode : undefined}
                                                            className={`p-1 border hover:bg-main_color border-black rounded w-10 bg-background_lighter ${(userAnimeRelation !== undefined && (userAnimeRelation.finished === true || userAnimeRelation.current_episode >= index + 1)) && 'bg-main_color'}`}
                                                            key={index} id={index}>
                                                        {index + 1}
                                                    </button>
                                                ))}
                                            </>
                                        ) :

                                        (
                                            <div className="flex flex-col gap-2 pl-4 pb-2">
                                                {userAnimeRelation !== undefined ? (
                                                    <>
                                                        <p>Enter your last watched episode to track it!</p>
                                                        <div className="flex items-center gap-2">

                                                            <input
                                                                type="number"
                                                                value={currentEpisode === 0 ? '' : currentEpisode}
                                                                onChange={(e) => setCurrentEpisode(e.target.value === '0' ? '' : Number(e.target.value))}
                                                                onKeyDown={(e) => {
                                                                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                className="w-24 py-1  border border-black rounded bg-background_lighter text-center"
                                                            />

                                                            <button
                                                                id={currentEpisode}
                                                                onClick={userAnimeRelation !== undefined ? (e) => updateEpisode(e) : undefined}
                                                                className="p-1 border hover:bg-main_color border-black rounded bg-background_lighter"
                                                            >
                                                                Update
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p>Add to list to track your last watched episode</p>
                                                )}
                                            </div>
                                        )}

                                </div>
                            </div>
                            <div className="flex gap-4 justify-between flex-wrap ">
                                <div className="flex gap-4 flex-wrap ">
                                    <button onClick={updateList} id="watching"
                                            className={`hover:bg-main_color_darker font-bold text-base md:text-lg py-2 px-3 rounded ${userAnimeRelation.planning === false && userAnimeRelation.finished === false ? 'bg-main_color' : 'bg-background_lighter'}`}>
                                        Watching
                                    </button>
                                    <button onClick={updateList} id="finished"
                                            className={`hover:bg-main_color_darker font-bold text-base md:text-lg py-2 px-3 rounded ${userAnimeRelation.finished === true ? 'bg-main_color' : 'bg-background_lighter'}`}>
                                        Finished
                                    </button>
                                    <button onClick={updateList} id="planning"
                                            className={`hover:bg-main_color_darker font-bold text-base md:text-lg py-2 px-3 rounded ${userAnimeRelation.planning === true ? 'bg-main_color' : 'bg-background_lighter'}`}>
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
