'use client'

import {useEffect, useRef, useState} from "react"
import Image from "next/image";
import SearchBar from "@/components/searchBar";
import Header from "@/components/header";
import StatusFilterManga from "@/components/manga/mangaFilters/statusFilter";
import FormatFilterManga from "@/components/manga/mangaFilters/formatFilter";
import GenreFilterManga from "@/components/manga/mangaFilters/genreFilter";
import {getManga, getTopMangaNoLimit} from "@/utils/jikan/jikanManga";
import MangaCards from "@/components/manga/mangaElements/mangaCards";
import Pagination from "@/components/pagination";
import Loading from "@/components/loading";

export default function Manga() {

    // This page is esentially the same as my anime/page.jsx , for detailed comments please refer to that page

    // The only real difference is that episodes are called chapters, and there are not as many filter options for manga

    const [manga, setManga] = useState(null)
    const [topManga, setTopManga] = useState(null)
    const [query, setQuery] = useState('')

    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)

    const [dropdownSelect, setDropdownSelect] = useState('')


    const [allOptions, setAllOptions] = useState({
        format: [],
        genre: [],
        releaseYear: [],
        status: [],
        producer: []
    })


    useEffect(() => {


        const lastQuery = sessionStorage.getItem('lastQueryManga');
        const lastAllOptions = JSON.parse(sessionStorage.getItem('lastAllOptionsManga'));
        const lastCurrentPage = Number(sessionStorage.getItem('lastCurrentPageManga'));
        const scrollPosition = Number(sessionStorage.getItem('scrollPositionManga'));

        if ((lastQuery !== '' && lastAllOptions !== null) || (JSON.stringify(lastAllOptions) !== JSON.stringify(allOptions) && lastAllOptions !== null)) {

            setAllOptions(lastAllOptions)
            setPage(lastCurrentPage)

            queryLastManga(lastQuery, lastAllOptions, lastCurrentPage)
        } else {
            queryTopManga()

        }

        if (scrollPosition) {
            window.scrollTo(0, scrollPosition);
        }


    }, []);


    useEffect(() => {
        return () => {
            sessionStorage.setItem('lastQueryManga', query);
            sessionStorage.setItem('lastAllOptionsManga', JSON.stringify(allOptions))
            sessionStorage.setItem('lastCurrentPageManga', JSON.stringify(page));

            sessionStorage.setItem('scrollPositionManga', window.scrollY.toString());
        };
    }, [query, allOptions, page]);


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
            queryManga(page)
        } else {
            queryTopManga()
        }

    }, [page]);

    const submitTopMangaQuery = () => {
        sessionStorage.setItem('lastQueryManga', '');
        sessionStorage.setItem('lastAllOptionsManga', null);
        sessionStorage.setItem('lastCurrentPageManga', JSON.stringify(1));
        setAllOptions({
            format: [],
            genre: [],
            releaseYear: [],
            status: [],
            producer: [],
        })
        setQuery('')
        setManga(null)

        queryTopManga()

    }


    async function queryTopManga() {
        const {manga, last_page} = await getTopMangaNoLimit(page)
        if (manga.length === 0) {
            manga(null)
        } else {
            setTopManga(manga)
            setLastPage(last_page)
        }
    }

    const submitMangaQuery = () => {
        setPage(1)
        queryManga(1)

    }


    async function queryManga(page) {
        setDropdownSelect('')
        const {manga, last_page} = await getManga(query, allOptions, page)
        if (manga.length === 0) {
            setManga([])
        } else {
            setManga(manga)
            setLastPage(last_page)
        }
    }


    async function queryLastManga(query, allOptions, page) {
        setDropdownSelect('')
        const {manga, last_page} = await getManga(query, allOptions, page)
        if (manga.length === 0) {
            setManga([])
        } else {
            setManga(manga)
            setLastPage(last_page)
        }
    }


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

        }


    }


    return (
        <>          <Header/>
            <div className="w-full flex justify-center">
                <div className="w-full lg:w-5/6 ">

                    <div className="flex justify-center gap-4 lg:gap-8 mt-8 lg:mt-16 flex-wrap">
                        <button
                            className="w-40 lg:w-52 hover:bg-main_color_darker h-10 bg-main_color px-2 border text-font_brighter_highlight border-black h text-lg rounded-lg"
                            onClick={submitTopMangaQuery}>Top Manga
                        </button>
                        <SearchBar queryAnime={submitMangaQuery} setQuery={setQuery}/>

                        <GenreFilterManga allOptions={allOptions} setAllOptions={setAllOptions}
                                          dropdownSelect={dropdownSelect} setDropdownSelect={setDropdownSelect}/>

                        <FormatFilterManga allOptions={allOptions} setAllOptions={setAllOptions}
                                           dropdownSelect={dropdownSelect} setDropdownSelect={setDropdownSelect}/>

                        <StatusFilterManga dropdownSelect={dropdownSelect} setDropdownSelect={setDropdownSelect}
                                           allOptions={allOptions} setAllOptions={setAllOptions}/>


                        <button
                            className="w-40 lg:w-52 hover:bg-main_color_darker h-10 bg-main_color px-2 border text-font_brighter_highlight border-black h text-lg rounded-lg"
                            onClick={submitMangaQuery}>Filter
                        </button>
                    </div>


                    <div className="flex w-full justify-center flex-wrap">

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


                        {manga === null ? (topManga === null ? <Loading/> :
                                <div className="mb-20">
                                    <p className="text-base md:text-xl lg:text-2xl mb-4 mx-8 lg:mx-16">Top Manga</p>

                                    {/*Note pass manga here as anime so I dont have to rewrite everything in the MangaCards component*/}
                                    <MangaCards anime={topManga}/>
                                    <Pagination page={page} setPage={setPage} lastPage={lastPage} allOptions={allOptions}
                                                setAllOptions={setAllOptions}/>
                                </div>)


                            :
                            (manga.length === 0 ?
                                    <div className="w-full flex justify-center">
                                        <p className="text-2xl mt-16">No manga found :(</p>
                                    </div>
                                    :
                                    <div className="mb-20">
                                        <MangaCards anime={manga}/>
                                        <Pagination page={page} setPage={setPage} lastPage={lastPage}
                                                    allOptions={allOptions}
                                                    setAllOptions={setAllOptions}/>
                                    </div>
                            )
                        }


                    </div>
                </div>
            </div>
        </>
    )

}