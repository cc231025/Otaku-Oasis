'use client'
import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {getAnimeList} from "@/utils/supabase/modules/userAnimeRelations";
import Header from "@/components/header";
import {getLoggedInUser, getUserByUsername} from "@/utils/supabase/modules/userAthentication";
import AnimeListElement from "@/components/anime/animeElements/animeListElement";
import SearchBar from "@/components/searchBar";
import SortByAnimeList from "@/components/anime/animeFilters/sortByAnimeList";
import Loading from "@/components/loading";
import ResourceNotExisting from "@/components/ressourceNotExisting";
import {modifySrc} from "@/utils/supabase/modules/modifyImgSrc";

// The users personal anime list page, Here he can view and edit his list + change the watch state and last episode watched - if logged in
export default function UserPage({params}) {

    // Set different UseStates, if he is logge din and its his page

    const [user, setUser] = useState(null)
    const [loggedInUser, setLoggedInUser] = useState(null)

    // the full list containing the actual data
    const [animeList, setAnimeList] = useState(null)
    // Just the list name (watching, planning ... ) on which the animelist is filtered via switch case
    const [currentListName, setCurrentListName] = useState('animeList')
    // The query if the user searches through his list
    const [query, setQuery] = useState('')

    // additional sorting states and if they are editing
    const [sortBy, setSortBy] = useState('dateDesc')
    const [isEditing, setIsEditing] = useState(null);


    // Triggered in the single mapped animes in the list
    // Check if it should be removed from the list as a whole or just updated

    // This function only manipulates the client-sided list, supabase changes are handled in the single list item components
    function updateAnimeLists(updatedAnime, anime_id, removeFromListQuestionMark) {
        const removeAnimeFromList = (list, anime_id) => list.filter(anime => anime.anime_id !== anime_id);
        const updateAnimeInList = (list, updatedAnime, anime_id) => list.map(anime => anime.anime_id === anime_id ? updatedAnime : anime);


        if (removeFromListQuestionMark) {
            const newAnimeList = removeAnimeFromList(animeList, anime_id);
            setAnimeList(newAnimeList);
            return
        }
        const newAnimeList = updateAnimeInList(animeList, updatedAnime, anime_id);
        setAnimeList(newAnimeList);
    }


    useEffect(() => {

        getAnime()
        getUser()
        loggedInUserCurrent()

    }, []);


    // Get all the animes on first render
    // If there is nothing in there it will stay at null and a message for the user to add something will be displayed further down
    async function getAnime() {
        const {animeList} = await getAnimeList(params.username)
        if (animeList.length === 0) {
            setAnimeList(null)
        } else {
            // Else it is as default sorted descending by date added and set
            setAnimeList(animeList)
            sortAnimeListByDate(animeList, 'dateDesc')

        }
    }


    // Different sorting options, either by date added ascending/descending
    function sortAnimeListByDate(animeList, order = 'dateDesc') {
        if (order === 'dateAsc') {
            animeList.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else {
            animeList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

    }

    // Or alphabetically
    function sortAnimeListAlphabetically(animeList, order = 'AZ') {
        if (order === 'AZ') {
            animeList.sort((a, b) => a.anime_JSON.title.localeCompare(b.anime_JSON.title));
        } else {
            animeList.sort((a, b) => b.anime_JSON.title.localeCompare(a.anime_JSON.title));
        }
    }

    // Of course users can also search by keywords
    function sortByQuery() {
        if (query === '') {
            return animeList
        }
        return animeList.filter(anime => anime.anime_JSON.title.toLowerCase().includes(query.toLowerCase()))
    }


    // Check if the User is Logged in and set it,
    // Later it will check if the logged-in User is the owner of this animelist in the single animeList Element to display the edit button
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
                                                width={500} // original width of the image
                                                height={500} // original height of the image
                                                alt="Picture of the anime"
                                                className=" w-16 h-16 sm:w-32 sm:h-32 object-cover self-center rounded-full"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-center"></div>
                                            <h1 className=" text-lg   sm:text-2xl md:text-3xl text-font_brighter_highlight mt-10 sm:mt-20 flex">Animelist
                                                of<Link
                                                    href={`/user/${user.username}`}
                                                    className="ml-2 hover:text-font_brighter_highlight text-main_color">{user.username}</Link>
                                            </h1>


                                        </div>
                                    </div>
                                </div>


                                <>
                                    {animeList === null ?

                                        <ResourceNotExisting
                                            message={'No Anime added to this list yet'}/>


                                        :

                                        // If there is an AnimeList - display the different filter options and searchbar
                                        <div className="flex w-full lg:w-4/6  flex-col  justify-center self-center">


                                            <div className="flex gap-6 flex-wrap m-2 lg:mx-8 my-8 justify-center">
                                                <button onClick={() => {
                                                    setCurrentListName('animeList');
                                                }}
                                                        className={` text-base md:text-xl px-2 py-1 rounded-lg w-40 ${currentListName === 'animeList' ? 'bg-main_color hover:bg-main_color_darker text-font_brighter_highlight' : 'bg-background_lighter hover:bg-main_color text-font_brighter_highlight'}`}>Full
                                                    List
                                                </button>
                                                <button onClick={() => {
                                                    setCurrentListName('watching');
                                                }}
                                                        className={` text-base md:text-xl px-2 py-1 rounded-lg w-40 ${currentListName === 'watching' ? 'bg-main_color hover:bg-main_color_darker text-font_brighter_highlight' : 'bg-background_lighter hover:bg-main_color text-font_brighter_highlight'}`}>Watching
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
                                                    sortBy={sortBy} setSortBy={setSortBy} animeList={animeList}
                                                    sortAnimeListByDate={sortAnimeListByDate}
                                                    sortAnimeListAlphabetically={sortAnimeListAlphabetically}
                                                />
                                            </div>

                                            <div className="flex justify-center">
                                                <div className="flex flex-wrap gap-4 justify-center ">
                                                    {/*This is where the magic happens
                                                    The List is always filtered based on the currentListName -
                                                    which in turn is set for every anime in the planning and finished propertys */}

                                                    {animeList.filter(anime => {
                                                        switch (currentListName) {
                                                            case 'watching':
                                                                return !anime.planning && !anime.finished;
                                                            case 'planned':
                                                                return anime.planning;
                                                            case 'finished':
                                                                return anime.finished;
                                                            default:
                                                                return true;
                                                        }
                                                        //     Then the anime is further filtered by query if there is one
                                                        //     Note that the orders a-z, date is sorted already beforehand when the list is set initially
                                                    }).filter(anime => anime.anime_JSON.title.toLowerCase().includes(query.toLowerCase())).map((anime, key) => {
                                                        return (
                                                            <div className="flex flex-wrap gap-6 justify-center mb-4"
                                                                 key={key}>
                                                                <AnimeListElement index={key}
                                                                                  updateAnimeLists={updateAnimeLists}
                                                                                  loggedInUser={loggedInUser}
                                                                                  user={user}
                                                                                  anime={anime}
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
                        }
                    </>
                }
            </div>
        </>
    )
}
