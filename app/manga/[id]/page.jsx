'use client'

import {useEffect, useState} from "react";
import Image from "next/image";
import {
    getUserRelation,
    removeRelation,
    updateChapterRelation,
    updateRelation,
    uploadRelation
} from "@/utils/supabase/modules/userMangaRelations";
import Header from "@/components/header";
import CharacterElement from "@/components/characterElement";
import Link from "next/link";
import {useRouter} from 'next/navigation';
import {getSingleManga} from "@/utils/jikan/jikanManga";
import Loading from "@/components/loading";
import ResourceNotExisting from "@/components/ressourceNotExisting";

export default function SingleProductPageManga({params}) {

    // Same thing this is essentially the Anime Detail Page, so please also refer to that for detailed comments

    // Differences really are just different elements that I display because of the medium,
    // So I don't have trailers here or streaming link, but instead author, volumes, chapters ...

    const router = useRouter(); // get the router object


    const [manga, setManga] = useState(null)
    const [characters, setCharacters] = useState(null)

    const [user, setUser] = useState(null)
    const [userMangaRelation, setUserMangaRelation] = useState(undefined)
    const [currentChapter, setCurrentChapter] = useState(0)


    useEffect(() => {

        queryManga()
        queryUserRelation()

    }, []);

    async function queryManga() {
        try {
            const {manga, characters} = await getSingleManga(params.id)
            if (manga.length === 0) {
                setManga(null)
            } else {
                setManga(manga)
                setCharacters(characters)
            }
        } catch {
            setManga('error')
        }
    }


    async function queryUserRelation() {
        const userRelation = await getUserRelation(params.id)

        const {userAuth, relation} = userRelation;
        if (userAuth !== null) {
            setUser(userAuth)
        }
        if (relation !== undefined) {
            setUserMangaRelation(relation)
            setCurrentChapter(relation.current_chapter)


        }
    }


// ##################################################################################################################################
    const addToList = async () => {
        if (user !== null) {
            const newRelation = await uploadRelation(manga.mal_id, user.id, user.user_metadata.username, manga)
            setUserMangaRelation(newRelation)
        } else {
            router.push('/login')
        }
    }

    const updateList = async (e) => {

        let planning
        let finished

        switch (e.target.id) {
            case "watching":
                if (userMangaRelation.planning === false && userMangaRelation.finished === false) return false
                planning = false
                finished = false
                break;
            case 'planning':
                if (userMangaRelation.planning === true && userMangaRelation.finished === false) return false

                planning = true
                finished = false
                break;

            case 'finished':
                if (userMangaRelation.planning === false && userMangaRelation.finished === true) return false
                planning = false
                finished = true
                break
        }

        setUserMangaRelation({...userMangaRelation, planning: planning, finished: finished})

        const newRelation = await updateRelation(user.id, manga.mal_id, planning, finished)


    }

    const removeFromList = async (e) => {
        setUserMangaRelation(undefined)

        await removeRelation(user.id, manga.mal_id)

    }

    const updateChapter = async (event) => {

        if (event.target.id !== userMangaRelation.current_chapter && event.target.innerText !== 'Update') {
            setUserMangaRelation({...userMangaRelation, current_chapter: Number(event.target.id) + 1})


            const newRelation = await updateChapterRelation(user.id, manga.mal_id, Number(event.target.id) + 1)
        } else if (event.target.id !== userMangaRelation.current_chapter && event.target.innerText === 'Update') {

            setUserMangaRelation({...userMangaRelation, current_chapter: Number(event.target.id)})


            const newRelation = await updateChapterRelation(user.id, manga.mal_id, event.target.id)

        }


    }


    // ##################################################################################################################################


    const imageLoader = ({src, width = 500, quality = 75}) => {
        return `${src}?w=${width}&q=${quality}`
    }


    return (<>
            <Header/>

            <div className="w-full flex justify-center">
                <div
                    className=" px-4 lg:px-0 lg:w-5/6 justify-center flex-col items-center md:items-start md:flex-row pt-8 flex gap-4 ">
                    {manga === null ?
                        <Loading/>
                        : <>
                            {manga === 'error' ?
                                <ResourceNotExisting
                                    message={'Invalid mal_id, Manga does not exist!'}

                                />

                                : <>


                                    <div
                                        className="flex flex-col sm:flex-row md:flex-col  gap-4 w-80 sm:w-full md:w-72 bg-background_lighter p-2 ">
                                        <Image
                                            loader={imageLoader}
                                            src={manga.images.webp.large_image_url}
                                            width={500} // original width of the image
                                            height={500} // original height of the image
                                            alt="Picture of the manga"
                                            className="w-72 h-[25.5rem] object-cover self-center"
                                        />

                                        <div className="flex flex-col gap-2 ">


                                            <div className="flex gap-2 flex-2 text-sm flex-wrap"> Genre:
                                                {manga.genres.map((genre, index) => {
                                                    return <p
                                                        className=" text-xs bg-main_color text-font_brighter_highlight px-1 py-[1px] rounded-lg"
                                                        key={index}>{genre.name}</p>
                                                })}
                                            </div>
                                            <div className="flex gap-2 flex-2 text-sm flex-wrap"> Themes:
                                                {manga.themes.map((genre, index) => {
                                                    return <p
                                                        className=" text-xs bg-main_color text-font_brighter_highlight px-1 py-[1px] rounded-lg"
                                                        key={index}>{genre.name}</p>
                                                })}
                                            </div>

                                            <div className="flex gap-2 flex-2 text-sm flex-wrap"> Authors:
                                                {manga.authors.map((author, index) => {
                                                    const nameParts = author.name.split(',').map(part => part.trim());
                                                    const formattedName = nameParts.reverse().join(' ');
                                                    return <p className="" key={index}>{formattedName}</p>
                                                })}
                                            </div>

                                            <p>Status: {manga?.status}</p>
                                            <p>Type: {manga?.type}</p>
                                            <p>Publishing Date: {manga.published?.string}</p>
                                            <p>Type: {manga?.type}</p>


                                            <p>Score: {manga?.score}</p>
                                            <p>Volumes: {manga?.volumes}</p>
                                            <p>Rank: {manga?.rank}</p>


                                            <div className="flex gap-2 flex-2 text-sm flex-wrap"> Links:
                                                {manga.external.map((external, index) => {
                                                    return <Link href={external.url} target="_blank"
                                                                 rel="noopener noreferrer"
                                                                 className=" text-xs bg-main_color text-font_brighter_highlight px-1 py-[1px] rounded-lg"
                                                                 key={index}>{external.name}</Link>
                                                })}
                                            </div>
                                        </div>

                                    </div>

                                    <div className="w-full md:w-2/3 flex flex-col  gap-6 self-center mb-20">

                                        <p className="text-3xl font-bold text-font_brighter_highlight pt-2">{manga.title_english !== null ? manga.title_english : manga.title}</p>
                                        <p className="bg-background_lighter p-4 text-sm md:text-base rounded-lg">{manga?.synopsis}</p>

                                        {userMangaRelation === undefined ?
                                            <button
                                                className="self-start font-bold bg-main_color text-font_brighter_highlight py-2 px-3 hover:bg-main_color_darker text-lg rounded-lg"
                                                onClick={addToList}>Add to list</button>
                                            : <div className="flex gap-4 flex-wrap">
                                                <button onClick={updateList} id="watching"
                                                        className={` hover:bg-main_color_darker font-bold text-lg py-2 px-3 rounded ${userMangaRelation.planning === false && userMangaRelation.finished === false ? 'bg-main_color' : 'bg-background_lighter'}`}>
                                                    Reading
                                                </button>

                                                <button onClick={updateList} id="finished"
                                                        className={` hover:bg-main_color_darker font-bold text-lg py-2 px-3 rounded ${userMangaRelation.finished === true ? 'bg-main_color' : 'bg-background_lighter'}`}>
                                                    Finished
                                                < /button>

                                                <button onClick={updateList} id="planning"
                                                        className={` hover:bg-main_color_darker font-bold text-lg py-2 px-3 rounded ${userMangaRelation.planning === true ? 'bg-main_color' : 'bg-background_lighter'}`}>
                                                    Planning
                                                </button>
                                                <button onClick={removeFromList} id="planning"
                                                        className="bg-red-950 hover:bg-main_color_darker font-bold text-lg py-2 px-3 rounded">Remove
                                                </button>
                                            </div>}

                                        <p className="text-2xl">Chapters</p>

                                        <div className="flex gap-2 flex-wrap overflow-auto max-h-[14rem]">
                                            {manga.chapters !== null ? (
                                                <>
                                                    {Array.from({length: manga.chapters}).map((_, index) => (
                                                        <button
                                                            onClick={userMangaRelation !== undefined ? updateChapter : undefined}
                                                            className={`p-1 border hover:bg-main_color border-black rounded w-10 bg-background_lighter ${(userMangaRelation !== undefined && (userMangaRelation.finished === true || userMangaRelation.current_chapter >= index + 1)) && 'bg-main_color'}`}
                                                            key={index}
                                                            id={index}
                                                        >
                                                            {index + 1}
                                                        </button>
                                                    ))}
                                                </>
                                            ) : (
                                                <div className="flex flex-col gap-2 pl-4 pb-2">
                                                    {userMangaRelation !== undefined ? (
                                                        <>
                                                            <p>Enter your last watched episode to track it!</p>
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
                                                        <p>Add to list to track your last watched episode</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>


                                        {manga.relations.length === 0 ? <div></div> :
                                            <>
                                                <p className="text-2xl">Related</p>

                                                <div className=" flex flex-col gap-2">
                                                    {manga.relations.map((relation, index) => {
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
