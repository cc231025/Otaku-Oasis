'use client'
import {getTopAiringAnimes} from "@/utils/jikan/jikanAnime";
import {useEffect, useState} from "react";
import TopMediumElement from "@/components/topMediumElement";

// TopAiringAnime used on the Homepage, Note I left mangas here since I started with Top mangas and didn't want to rewrite everything
// It behaves the same anyway, with the only difference really being the Jikan query used
export default function TopAiringAnime () {
    const [mangas, setMangas] = useState(null)





    useEffect(() => {

        queryAnime()

    }, []);

    async function queryAnime() {
        const manga = await getTopAiringAnimes()
        if (manga.length === 0) {
            setMangas(null)
        } else {
            setMangas(manga)
        }
    }


    return (
        <div className="w-96 flex flex-col gap-2">
            <p className="text-2xl font-bold mb-4 text-font_dark_icons_text">Top Recent Anime</p>

            {mangas !== null && mangas.map((manga, key) => {
                return (
                    <TopMediumElement key={key} type='anime' index={key} manga={manga}/>

                )

            })
            }
        </div>


    )
}