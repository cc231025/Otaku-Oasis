'use client'
import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";
import {getLoggedInUser, getUserByUsername} from "@/utils/supabase/modules/userAthentication";
import SearchBar from "@/components/searchBar";
import SortByAnimeList from "@/components/anime/animeFilters/sortByAnimeList";
import {getMangaList} from "@/utils/supabase/modules/userMangaRelations";
import MangaListElement from "@/components/manga/mangaElements/mangaListElement";
import Loading from "@/components/loading";
import ResourceNotExisting from "@/components/ressourceNotExisting";
import {modifySrc} from "@/utils/supabase/modules/modifyImgSrc";

// This page is again almost the same as animeList/page.jsx so refer to that for detailed comments

// Differences: episodes to chapters
// Note that the state 'watching' is also the same here even though 'reading' would be more precise of course,
// But this way I did not have to rewrite the whole page and all functions for it to work the same way

export default function UserPage({params}) {
    const [user, setUser] = useState(null)
    const [loggedInUser, setLoggedInUser] = useState(null)

    const [mangaList, setMangaList] = useState(null)
    const [currentListName, setCurrentListName] = useState('mangaList')
    const [query, setQuery] = useState('')


    const [sortBy, setSortBy] = useState('dateDesc')
    const [isEditing, setIsEditing] = useState(null);


    function updateMangaLists(updatedManga, manga_id, removeFromListQuestionMark) {
        const removeMangaFromList = (list, manga_id) => list.filter(manga => manga.manga_id !== manga_id);
        const updateMangaInList = (list, updatedManga, manga_id) => list.map(manga => manga.manga_id === manga_id ? updatedManga : manga);

        if (removeFromListQuestionMark) {
            const newMangaList = removeMangaFromList(mangaList, manga_id);
            setMangaList(newMangaList);
            return
        }
        const newMangaList = updateMangaInList(mangaList, updatedManga, manga_id);
        setMangaList(newMangaList);
    }


    useEffect(() => {

        getManga()
        getUser()
        loggedInUserCurrent()

    }, []);

    async function getManga() {
        const {mangaList} = await getMangaList(params.username)
        if (mangaList.length === 0) {
            setMangaList(null)
        } else {
            setMangaList(mangaList)
            sortMangaListByDate(mangaList, 'dataDesc')

        }
    }


    function sortMangaListByDate(mangaList, order = 'dateDesc') {
        if (order === 'dateAsc') {
            mangaList.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else {
            mangaList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

    }

    function sortMangaListAlphabetically(mangaList, order = 'AZ') {
        if (order === 'AZ') {
            mangaList.sort((a, b) => a.manga_JSON.title.localeCompare(b.manga_JSON.title));
        } else {
            mangaList.sort((a, b) => b.manga_JSON.title.localeCompare(a.manga_JSON.title));
        }
    }

    function sortByQuery() {
        if (query === '') {
            return mangaList
        }
        return mangaList.filter(manga => manga.manga_JSON.title.toLowerCase().includes(query.toLowerCase()))
    }


    async function loggedInUserCurrent() {
        try {
            const currentUser = await getLoggedInUser()

            setLoggedInUser(currentUser)
        } catch (error) {
            setLoggedInUser(null)


        }
    }


    async function getUser() {
        const user = await getUserByUsername(params.username)

        if (user.length === 0) {
            setUser('This user does not exist :/')
        } else {
            setUser(user[0])
        }
    }


    return (<>
            <Header/>
            <div className="mb-20">
                {user === null ? <Loading/>

                    : <>
                        {user === 'This user does not exist :/' ?


                            <ResourceNotExisting

                                message={'This user does not exist :/'}
                            />

                            :


                            <div className="flex flex-col justify-center">

                                <div className="flex gap-16 w-full justify-center bg-background_lighter">
                                    <div
                                        className="flex gap-6 sm:gap-16 w-full mx-8 lg:mx-0 lg:w-4/6 bg-background_lighter my-4">
                                        <div className="flex flex-col gap-4 ">
                                            <Image
                                                src={modifySrc(user.image_uuid)}
                                                width={500}
                                                height={500}
                                                alt="Picture of the manga"
                                                className=" w-16 h-16 sm:w-32 sm:h-32 object-cover self-center rounded-full"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-center"></div>
                                            <h1 className=" text-lg   sm:text-2xl md:text-3xl text-font_brighter_highlight mt-10 sm:mt-20 flex">Mangalist
                                                of<Link
                                                    href={`/user/${user.username}`}
                                                    className="ml-2 hover:text-font_brighter_highlight text-main_color">{user.username}</Link>
                                            </h1>


                                        </div>
                                    </div>
                                </div>

                                <>
                                    {mangaList === null ?

                                        <ResourceNotExisting
                                            message={'No Manga added to this list'}/>


                                        :

                                        <div className="flex w-full lg:w-4/6  flex-col  justify-center self-center">


                                            <div className="flex gap-6 flex-wrap m-2 lg:mx-8 my-8 justify-center">
                                                <button onClick={() => {
                                                    setCurrentListName('mangaList');
                                                }}
                                                        className={` text-base md:text-xl px-2 py-1 rounded-lg w-40 ${currentListName === 'mangaList' ? 'bg-main_color hover:bg-main_color_darker text-font_brighter_highlight' : 'bg-background_lighter hover:bg-main_color text-font_brighter_highlight'}`}>Full
                                                    List
                                                </button>
                                                <button onClick={() => {
                                                    setCurrentListName('watching');
                                                }}
                                                        className={` text-base md:text-xl px-2 py-1 rounded-lg w-40 ${currentListName === 'watching' ? 'bg-main_color hover:bg-main_color_darker text-font_brighter_highlight' : 'bg-background_lighter hover:bg-main_color text-font_brighter_highlight'}`}>Reading
                                                </button>
                                                <button onClick={() => {
                                                    setCurrentListName('finished');
                                                }}
                                                        className={` text-base md:text-xl px-2 py-1 rounded-lg w-40 ${currentListName === 'finished' ? 'bg-main_color hover:bg-main_color_darker text-font_brighter_highlight' : 'bg-background_lighter hover:bg-main_color text-font_brighter_highlight'}`}>Finished
                                                </button>
                                                <button onClick={() => {
                                                    setCurrentListName('planned');
                                                }}
                                                        className={` text-base md:text-xl px-2 py-1 rounded-lg w-40 ${currentListName === 'planned' ? 'bg-main_color hover:bg-main_color_darker text-font_brighter_highlight' : 'bg-background_lighter hover:bg-main_color text-font_brighter_highlight'}`}>Planned
                                                </button>
                                                <SearchBar queryAnime={sortByQuery} setQuery={setQuery}/>
                                                <SortByAnimeList
                                                    sortBy={sortBy} setSortBy={setSortBy} animeList={mangaList}
                                                    sortAnimeListByDate={sortMangaListByDate}
                                                    sortAnimeListAlphabetically={sortMangaListAlphabetically}
                                                />
                                            </div>


                                            <div className="flex justify-center">
                                                <div className="flex flex-wrap gap-4 justify-center ">


                                                    {mangaList.filter(manga => {
                                                        switch (currentListName) {
                                                            case 'watching':
                                                                return !manga.planning && !manga.finished;
                                                            case 'planned':
                                                                return manga.planning;
                                                            case 'finished':
                                                                return manga.finished;
                                                            default:
                                                                return true;
                                                        }
                                                    }).filter(manga => manga.manga_JSON.title.toLowerCase().includes(query.toLowerCase())).map((manga, key) => {
                                                        return (
                                                            <div className="flex flex-wrap gap-6 justify-center mb-4"
                                                                 key={key}>
                                                                <MangaListElement index={key}
                                                                                  updateMangaLists={updateMangaLists}
                                                                                  loggedInUser={loggedInUser}
                                                                                  user={user} manga={manga}
                                                                                  isEditing={isEditing}
                                                                                  setIsEditing={setIsEditing}
                                                                                  setCurrentListName={setCurrentListName}
                                                                                  currentListName={currentListName}


                                                                />
                                                            </div>
                                                        )
                                                    })}


                                                </div>
                                            </div>


                                        </div>
                                    }</>
                            </div>

                        }</>
                }
            </div>
        </>
    )
}
