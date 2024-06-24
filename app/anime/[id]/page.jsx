'use client'

import {getSingleAnime} from "@/utils/jikan/jikanAnime";
import {useEffect, useState} from "react";
import Image from "next/image";
import {
    getUserRelation,
    removeRelation,
    updateEpisodeRelation,
    updateRelation,
    uploadRelation
} from "@/utils/supabase/modules/userAnimeRelations";
import Header from "@/components/header";
import CharacterElement from "@/components/characterElement";
import Link from "next/link";
import {useRouter} from 'next/navigation';
import Loading from "@/components/loading";
import ResourceNotExisting from "@/components/ressourceNotExisting";

export default function SingleProductPage({params}) {

    const router = useRouter(); // get the router object

    // Declare various useStates for the single anime detail page
    // Anime data will be queried via the params.id which will be the mal_id in Jikan APi

    const [anime, setAnime] = useState(null)
    const [characters, setCharacters] = useState(null)

    // UserRelation is the current logged-in users relation with the Anime
    // So is it in his list? Finished? Watching? Which episode is he on...
    // This info is saved in supabase user_animelist table

    const [user, setUser] = useState(null)
    const [userAnimeRelation, setUserAnimeRelation] = useState(undefined)
    const [currentEpisode, setCurrentEpisode] = useState(0)

    useEffect(() => {

        queryAnime()
        queryUserRelation()

    }, []);

    // In here we actually do 2 queries every time, first we need the anime, and also the characters since Jikan doesn't provide them at once

    async function queryAnime() {
        try {
            const {anime, characters} = await getSingleAnime(params.id)
            if (anime.length === 0) {
                setAnime(null)
            } else {
                setAnime(anime)
                setCharacters(characters)
            }
        } catch {
            setAnime('error')
        }
    }

    // Check if user is logged in and get relation
    async function queryUserRelation() {
        const userRelation = await getUserRelation(params.id)

        const {userAuth, relation} = userRelation;
        if (userAuth !== null) {
            setUser(userAuth)
        }
        if (relation !== undefined) {
            setUserAnimeRelation(relation)
            setCurrentEpisode(relation.current_episode)

        }
    }


// ##################################################################################################################################
//     If the user is logged in handle all the functions here

    // Add a new relation in supabase and also set it via clientside for an instant response
    const addToList = async () => {
        if (user !== null) {
            const newRelation = await uploadRelation(anime.mal_id, user.id, user.user_metadata.username, anime)
            setUserAnimeRelation(newRelation)
        } else {
            router.push('/login')
        }
    }

    // Change relation status, again supabase upload and clientside changes

    const updateList = async (e) => {

        let planning
        let finished

        switch (e.target.id) {
            case "watching":
                if (userAnimeRelation.planning === false && userAnimeRelation.finished === false) return false
                planning = false
                finished = false
                break;
            case 'planning':
                if (userAnimeRelation.planning === true && userAnimeRelation.finished === false) return false

                planning = true
                finished = false
                break;

            case 'finished':
                if (userAnimeRelation.planning === false && userAnimeRelation.finished === true) return false
                planning = false
                finished = true
                break
        }

        setUserAnimeRelation({...userAnimeRelation, planning: planning, finished: finished})

        const newRelation = await updateRelation(user.id, anime.mal_id, planning, finished)
    }

    // Remove relation
    const removeFromList = async (e) => {
        setUserAnimeRelation(undefined)

        await removeRelation(user.id, anime.mal_id)

    }

    // Update episode, We have to differentiate here:
    // There is a difference if the anime is currently airing the episodes will be null
    // Which means we give the user an Input field where he can manually enter a number

    // This is handled differently in regard to the episode count

    const updateEpisode = async (event) => {
        if (event.target.id !== userAnimeRelation.current_episode && event.target.innerText !== 'Update') {
            setUserAnimeRelation({...userAnimeRelation, current_episode: Number(event.target.id) + 1})


            const newRelation = await updateEpisodeRelation(user.id, anime.mal_id, Number(event.target.id) + 1)
        } else if (event.target.id !== userAnimeRelation.current_episode && event.target.innerText === 'Update') {

            setUserAnimeRelation({...userAnimeRelation, current_episode: Number(event.target.id)})

            const newRelation = await updateEpisodeRelation(user.id, anime.mal_id, event.target.id)

        }

    }


    // ##################################################################################################################################


    const imageLoader = ({src, width = 500, quality = 75}) => {
        return `${src}?w=${width}&q=${quality}`
    }


    return (<>
            <Header/>

            <div className="w-full flex  justify-center">
                <div
                    className=" px-4 lg:px-0 lg:w-5/6 justify-center flex-col items-center md:items-start md:flex-row pt-8 flex gap-4 ">
                    {/*Check if the anime can already be displayed or if an error occurred*/}
                    {anime === null ?
                        <Loading/>
                        : <>
                            {anime === 'error' ?
                                <ResourceNotExisting
                                    message={'Invalid mal_id, Anime does not exist!'}

                                />

                                : <>
                                    {/*    Display various data from the anime JSON
                                    Note that for example anime?.status are failsafe if the prop doesn't exist or is null/undefined
                                    Otherwise the page might crash on differences in anime data*/}

                                    <div
                                        className="flex flex-col sm:flex-row md:flex-col  gap-4 w-80 sm:w-full md:w-72 bg-background_lighter p-2 ">
                                        <Image
                                            loader={imageLoader}
                                            src={anime.images.webp.large_image_url}
                                            width={500} // original width of the image
                                            height={500} // original height of the image
                                            alt="Picture of the anime"
                                            className="w-72 h-[25.5rem] object-cover self-center"
                                        />
                                        <div className="flex flex-col gap-2 ">

                                            <div className="flex gap-2 flex-2 text-sm flex-wrap"> Genre:
                                                {anime.genres.map((genre, index) => {
                                                    return <p
                                                        className=" text-xs bg-main_color text-font_brighter_highlight px-1 py-[1px] rounded-lg"
                                                        key={index}>{genre.name}</p>
                                                })}
                                            </div>
                                            <div className="flex gap-2 flex-2 text-sm flex-wrap"> Themes:
                                                {anime.themes.map((genre, index) => {
                                                    return <p
                                                        className=" text-xs bg-main_color text-font_brighter_highlight px-1 py-[1px] rounded-lg"
                                                        key={index}>{genre.name}</p>
                                                })}
                                            </div>

                                            <p>Status: {anime?.status}</p>
                                            <p>Type: {anime?.type}</p>
                                            <p>Source: {anime?.source}</p>
                                            <p>Aire Date: {anime.aired?.string}</p>
                                            <p>Studio: {anime?.studios[0]?.name}</p>
                                            <p>Type: {anime?.type}</p>


                                            <p>Score: {anime?.score}</p>
                                            <p>Duration: {anime?.duration}</p>
                                            <p>Rank: {anime?.rank}</p>
                                            <div
                                                className="flex gap-2 flex-wrap "> Stream: {anime?.streaming?.map((stream, key) => {
                                                return <Link className="text-blue-700" href={stream?.url} key={key}
                                                             target="_blank"
                                                             rel="noopener noreferrer">{stream.name}</Link>
                                            })}</div>
                                            {/*<p>Stream: {anime.streaming[0].name}</p>*/}

                                        </div>

                                    </div>

                                    <div className="w-full md:w-2/3 flex flex-col  gap-6 self-center mb-20">

                                        <p className="text-3xl font-bold text-font_brighter_highlight pt-2">{anime.title_english !== null ? anime.title_english : anime.title}</p>
                                        <p className="bg-background_lighter p-4 text-sm md:text-base rounded-lg">{anime?.synopsis}</p>

                                        {/*Insert UI for Users to change their AnimeRelations */}
                                        {userAnimeRelation === undefined ?
                                            <button
                                                className="self-start font-bold bg-main_color text-font_brighter_highlight py-2 px-3 hover:bg-main_color_darker text-lg rounded-lg"
                                                onClick={addToList}>Add to list</button>
                                            : <div className="flex gap-4 flex-wrap ">
                                                <button onClick={updateList} id="watching"
                                                        className={` hover:bg-main_color_darker font-bold text-lg py-2 px-3 rounded ${userAnimeRelation.planning === false && userAnimeRelation.finished === false ? 'bg-main_color' : 'bg-background_lighter'}`}>
                                                    Watching
                                                </button>

                                                <button onClick={updateList} id="finished"
                                                        className={` hover:bg-main_color_darker font-bold text-lg py-2 px-3 rounded ${userAnimeRelation.finished === true ? 'bg-main_color' : 'bg-background_lighter'}`}>
                                                    Finished
                                                < /button>

                                                <button onClick={updateList} id="planning"
                                                        className={` hover:bg-main_color_darker font-bold text-lg py-2 px-3 rounded ${userAnimeRelation.planning === true ? 'bg-main_color' : 'bg-background_lighter'}`}>
                                                    Planning
                                                </button>
                                                <button onClick={removeFromList} id="planning"
                                                        className="bg-red-950 hover:bg-main_color_darker font-bold text-lg py-2 px-3 rounded">Remove
                                                </button>
                                            </div>}

                                        <p className="text-2xl">Episodes</p>

                                        {/*Map over all possible Episodes if they arent null,
                                If there is an Anime Relation onclick the episodes can be set*/}
                                        <div className="flex gap-2 flex-wrap overflow-auto max-h-[14rem]">
                                            {anime.episodes !== null ? (
                                                <>
                                                    {Array.from({length: anime.episodes}).map((_, index) => (
                                                        <button
                                                            onClick={userAnimeRelation !== undefined ? updateEpisode : undefined}
                                                            className={`p-1 border hover:bg-main_color border-black rounded w-10 bg-background_lighter ${(userAnimeRelation !== undefined && (userAnimeRelation.finished === true || userAnimeRelation.current_episode >= index + 1)) && 'bg-main_color'}`}
                                                            key={index}
                                                            id={index}
                                                        >
                                                            {index + 1}
                                                        </button>
                                                    ))}
                                                </>
                                            ) : (
                                                // If the episodes are null, the anime is still airing,
                                                // and we have no info for the last episode,
                                                // So the user can enter it manually with an input element here
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


                                        {anime.relations.length === 0 ? <div></div> :
                                            <>
                                                <p className="text-2xl">Related</p>

                                                <div className=" flex flex-col gap-2">
                                                    {anime.relations.map((relation, index) => {
                                                        return (<div key={index}>
                                                                {relation.entry.map((entry, key) => {
                                                                    return (

                                                                        <Link
                                                                            href={entry.type === 'anime' ? `/anime/${entry.mal_id}` : `/manga/${entry.mal_id}`}
                                                                            key={key}
                                                                            className="flex w-full pb-2 justify-between bg-background_lighter min-h-10 px-2 hover:bg-main_color group">

                                                                            <p className="text-sm text-main_color w-1/4 self-center group-hover:text-white">{relation.relation}</p>
                                                                            <p className=" w-2/4 text-sm self-center">{entry.name}</p>
                                                                            <p className="  text-secondary_color text-sm self-center ">{entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}</p>

                                                                        </Link>
                                                                    )
                                                                })}
                                                            </div>


                                                        )
                                                    })}
                                                </div>
                                            </>


                                        }

                                        {characters.length === 0 ? <div></div> :
                                            <>
                                                <p className="text-2xl">Characters</p>

                                                <div
                                                    className="flex flex-wrap justify-center  gap-4 overflow-auto max-h-[24rem]">
                                                    {characters.map((character, index) => {
                                                        return (
                                                            <div key={index}
                                                                 className="flex gap-2  bg-background_lighter rounded-2xl pr-4 justify-between h-20">
                                                                <CharacterElement character={character}/>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>


                                        }
                                        {/*Embed a trailer if there is one with very useful iframe Element*/}
                                        {anime.trailer.embed_url === null ? <div> No trailer for this one :( </div> :

                                            <div className="aspect-w-16 aspect-h-9 h-[30rem]">
                                                <iframe
                                                    src={`${anime.trailer.embed_url}?autoplay=0`}
                                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="w-full h-full"
                                                ></iframe>
                                            </div>}

                                    </div>
                                </>
                            }
                        </>

                    }

                </div>
            </div>
        </>
    )


};
