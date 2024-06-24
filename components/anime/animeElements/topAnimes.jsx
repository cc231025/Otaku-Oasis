'use client'
import { getTopAnimes} from "@/utils/jikan/jikanAnime";
import {useEffect, useState} from "react";
import TopMediumElement from "@/components/topMediumElement";

// TopAnime used on the Homepage, Note I left mangas here since I started with Topmangas and didnt want to rewrite everything
// It behaves the same anyway with minor differences
export default function TopAnimes () {

    const [mangas, setMangas] = useState(null)



    useEffect(() => {

        queryAnime()

    }, []);

    // get the topAnime from jikan and set them
    async function queryAnime() {
        const manga = await getTopAnimes()
        if (manga.length === 0) {
            setMangas(null)
        } else {
            setMangas(manga)
        }
    }


    return (
        <div className="w-96 flex flex-col gap-2">
            <p className="text-2xl font-bold mb-4 text-font_dark_icons_text">Top Anime</p>

            {mangas !== null && mangas.map((manga, key) => {
                return (
                    <TopMediumElement key={key} type='anime' index={key} manga={manga}/>

                )

            })
            }
        </div>


    )
}