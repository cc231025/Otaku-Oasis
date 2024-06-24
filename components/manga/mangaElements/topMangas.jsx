'use client'
import {useEffect, useState} from "react";
import TopMediumElement from "@/components/topMediumElement";
import {getTopMangas} from "@/utils/jikan/jikanManga";

// Used in the homepage to display the top 9 mangas by rank
export default function TopMangas () {
    const [mangas, setMangas] = useState(null)



    useEffect(() => {

        queryManga()

    }, []);

    // Get the data from Jikan and set it

    async function queryManga() {
        const manga = await getTopMangas()
        if (manga.length === 0) {
            setMangas(null)
        } else {
            setMangas(manga)
        }
    }

    return (
            <div className="w-96 flex flex-col gap-2">
                <p className="text-2xl font-bold mb-4 text-font_dark_icons_text">Top Manga</p>
        { mangas !== null && mangas.map((manga, key)=> {
                return(
                    <TopMediumElement key={key} type='notANimehahahihi' index={key} manga={manga} />

                )

            })
        }
            </div>


    )
}