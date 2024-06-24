'use client'

import {useEffect, useRef, useState} from "react"
import {getAnime, getTopAnimesNoLimit} from "@/utils/jikan/jikanAnime";
import Image from "next/image";
import SearchBar from "@/components/searchBar";
import GenreFilter from "@/components/anime/animeFilters/genreFilter";
import FormatFilter from "@/components/anime/animeFilters/formatFilter";
import StatusFilter from "@/components/anime/animeFilters/statusFilter";
import ProducerFilter from "@/components/anime/animeFilters/producerFilter";
import Header from "@/components/header";
import AnimeCards from "@/components/anime/animeElements/animeCards";
import Pagination from "@/components/pagination";
import Loading from "@/components/loading";

export default function Anime() {
    // Set various useStates for animequery, standard Topanime list at first load, current page and which dropdown is currently open
    const [anime, setAnime] = useState(null)
    const [topAnime, setTopAnime] = useState(null)
    const [query, setQuery] = useState('')

    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)

    const [dropdownSelect, setDropdownSelect] = useState('')

    // Define allOptions useState, which will be used to query anime with different filters
    const [allOptions, setAllOptions] = useState({
        format: [],
        genre: [],
        releaseYear: [],
        status: [],
        producer: [],
    })

    // On first render, check if there is a last query, the user might return to
    // (Say the user filters for something, checks out the details, therefore leaves this page, and on return the query is gone and he has to set everything again)
    // To avoid this store query always in localstorage and reset when topanime is querryied again

    useEffect(() => {


        const lastQuery = sessionStorage.getItem('lastQuery');
        const lastAllOptions = JSON.parse(sessionStorage.getItem('lastAllOptions'));
        const lastCurrentPage = Number(sessionStorage.getItem('lastCurrentPage'));
        const scrollPosition = Number(sessionStorage.getItem('scrollPosition'));



        if ((lastQuery !== '' && lastAllOptions !== null) || (JSON.stringify(lastAllOptions) !== JSON.stringify(allOptions) && lastAllOptions !== null)) {

            setAllOptions(lastAllOptions)
            setPage(lastCurrentPage)

            queryLastAnime(lastQuery, lastAllOptions, lastCurrentPage)
        } else {

            queryTopAnime()

        }

        if (scrollPosition) {
            window.scrollTo(0, scrollPosition);
        }


    }, []);


    // Always store the current query when something changes
    useEffect(() => {
        return () => {
            sessionStorage.setItem('lastQuery', query);
            sessionStorage.setItem('lastAllOptions', JSON.stringify(allOptions));
            sessionStorage.setItem('lastCurrentPage', JSON.stringify(page));

            sessionStorage.setItem('scrollPosition', window.scrollY.toString());
        };
    }, [query, allOptions, page]);


    // If the current page changes query either the anime search or topanime with additional page parameter
    const firstRender = useRef(true);


    useEffect(() => {

        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        if (query !== '' || (JSON.stringify(allOptions) !== JSON.stringify({
            format: [],
            genre: [],
            releaseYear: [],
            status: [],
            producer: [],
        }))) {
            queryAnime(page)
        } else {
            queryTopAnime()
        }

    }, [page]);

    // Triggered by user button input, Set the localstorage query,alloptions, query, currentanimes to null again and get the topanimes from the start

    const submitTopAnimeQuery = () => {
        sessionStorage.setItem('lastQuery', '');
        sessionStorage.setItem('lastAllOptions', null);
        sessionStorage.setItem('lastCurrentPage', JSON.stringify(1));
        setAllOptions({
            format: [],
            genre: [],
            releaseYear: [],
            status: [],
            producer: [],
        })
        setQuery('')
        setAnime(null)

        queryTopAnime()

    }


    // Get top anime list
    async function queryTopAnime() {
        const {anime, last_page} = await getTopAnimesNoLimit(page)
        if (anime.length === 0) {
            anime(null)
        } else {
            setTopAnime(anime)
            setLastPage(last_page)
        }
    }


    // On submit filter button or searchbar start animequery with first page
    const submitAnimeQuery = () => {
        setPage(1)
        queryAnime(1)

    }


    // Query for specific anime passing the different options, query and the page
    // Also close all dropdown menus
    async function queryAnime(page) {
        setDropdownSelect('')
        const {anime, last_page} = await getAnime(query, allOptions, page)
        if (anime.length === 0) {
            setAnime([])
        } else {
            setAnime(anime)
            setLastPage(last_page)
        }
    }

    // Query last anime if the localstorage items aren't empty on render
    async function queryLastAnime(query, allOptions, page) {
        setDropdownSelect('')
        const {anime, last_page} = await getAnime(query, allOptions, page)
        if (anime.length === 0) {
            setAnime([])
        } else {
            setAnime(anime)
            setLastPage(last_page)
        }
    }

    // If options get deleted, handle the logic here and set the alloptions accordingly

    const rmFromAllOptions = (value, element, key) => {
        switch (key) {
            case 'genre':
                setAllOptions((prev) => ({
                    ...prev,
                    genre: prev.genre.filter((o) => o !== element)
                }));
                break;
            case 'format':
                setAllOptions((prev) => ({
                    ...prev,
                    format: prev.format.filter((o) => o !== element)
                }));
                break;
            case 'status':
                setAllOptions((prev) => ({
                    ...prev,
                    status: [],
                }));
                break;

            case 'producer':
                setAllOptions((prev) => ({
                    ...prev,
                    producer: [],
                }));
                break;
            case 'releaseYear':
                setAllOptions((prev) => ({
                    ...prev,
                    releaseYear: [],
                }));
                break;

        }


    }


    return (
        <>          <Header/>
            <div className="w-full flex justify-center">
                <div className="w-full lg:w-5/6 ">

                    {/*Filter elements and buttons / navigation*/}
                    <div className="flex justify-center gap-4 lg:gap-8 mt-8 lg:mt-16 flex-wrap">
                        <button
                            className="w-40 lg:w-52 hover:bg-main_color_darker h-10 bg-main_color px-2 border text-font_brighter_highlight border-black h text-lg rounded-lg"
                            onClick={submitTopAnimeQuery}>Top Anime
                        </button>
                        <SearchBar queryAnime={submitAnimeQuery} setQuery={setQuery}/>

                        <GenreFilter allOptions={allOptions} setAllOptions={setAllOptions}
                                     dropdownSelect={dropdownSelect} setDropdownSelect={setDropdownSelect}/>

                        <FormatFilter allOptions={allOptions} setAllOptions={setAllOptions}
                                      dropdownSelect={dropdownSelect} setDropdownSelect={setDropdownSelect}/>
                        <StatusFilter dropdownSelect={dropdownSelect} setDropdownSelect={setDropdownSelect}
                                      allOptions={allOptions} setAllOptions={setAllOptions}/>
                        <ProducerFilter dropdownSelect={dropdownSelect} setDropdownSelect={setDropdownSelect}
                                        allOptions={allOptions} setAllOptions={setAllOptions}/>


                        <button
                            className="w-40 lg:w-52 hover:bg-main_color_darker h-10 bg-main_color px-2 border text-font_brighter_highlight border-black h text-lg rounded-lg"
                            onClick={submitAnimeQuery}>Filter
                        </button>
                    </div>


                    <div className="flex w-full justify-center flex-wrap">
                        {/*If alloptions isn't empty map through them and display them with a removal option */}
                        <div className=" flex flex-wrap gap-2 justify-center lg:gap-8 my-8 mx-4 lg:mx-16 ">
                            {
                                allOptions && Object.entries(allOptions).map(([key, value]) => {
                                    return value.map((element, index) => {
                                        return <div key={index}
                                                    className="px-3 py-1 bg-main_color_darker text-font_brighter_highlight text-sm lg:text-base rounded-lg flex justify-between gap-4 align-middle">
                                            <p>{element.label}</p>
                                            <button onClick={() => {
                                                rmFromAllOptions(value, element, key)
                                            }}
                                                    className="self-center rounded-full hover:bg-main_color border border-font_dark_icons_text ">

                                                <Image
                                                    src="/icons/close.svg"
                                                    width={16}
                                                    height={16}
                                                    alt="Menu"
                                                    priority
                                                />
                                            </button>
                                        </div>


                                    })
                                })
                            }


                        </div>


                    </div>


                    <div className="justify-end mb-2 mr-4 md:mr-20 flex">
                        <Pagination page={page} setPage={setPage} lastPage={lastPage} allOptions={allOptions}
                                    setAllOptions={setAllOptions}/>
                    </div>


                    <div>

                        {/*Logic for rendering either topanimes query result or nothing found message*/}
                        {anime === null ? (topAnime === null ? <Loading/> :
                                <div className="mb-20">
                                    <p className="text-2xl mb-4 mx-16">Top Anime</p>


                                    <AnimeCards anime={topAnime}/>
                                    <Pagination page={page} setPage={setPage} lastPage={lastPage} allOptions={allOptions}
                                                setAllOptions={setAllOptions}/>
                                </div>)


                            :
                            (anime.length === 0 ?
                                <div className="w-full flex justify-center">
                                    <p className="text-2xl mt-16">No anime found</p>
                                </div>
                                :
                                <div className="mb-20">
                                    <AnimeCards anime={anime}/>
                                    <Pagination page={page} setPage={setPage} lastPage={lastPage}
                                                allOptions={allOptions}
                                                setAllOptions={setAllOptions}/>
                                </div>)
                        }


                    </div>
                </div>
            </div>
        </>
    )

}