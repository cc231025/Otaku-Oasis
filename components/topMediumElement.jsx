'use client'

import Link from "next/link";
import Image from "next/image";

// Single Top medium Element of the Homepage, takes in either Anime or Manga data and displays the basics
// Based on the type props change the link to anime or manga
export default function TopMediumElement ({...props}) {
    const manga = props.manga
    const key = props.index + 1
    const type = props.type


    const imageLoader = ({ src, width = 500, quality = 75 }) => {
        return `${src}?w=${width}&q=${quality}`
    }

    return (<>

            <Link className="rounded-xl flex justify-start w-full h-20 bg-background_lighter gap-4 py-[1px] px-2"
                  href={type ==='anime' ? `/anime/${manga.mal_id}` :  `/manga/${manga.mal_id}`}>
                <div className="flex items-center justify-center h-full text-4xl font-bold text-main_color">
                    {key}
                </div>
                <div className="h-full w-[3.25rem] flex-shrink-0">
                    <Image
                        loader={imageLoader}
                        src={manga.images.webp.image_url}
                        width={80}
                        height={120}
                        alt="Picture of the anime"
                        className="object-cover h-full w-full"
                    />
                </div>
                <div className="flex flex-col py-1">
                    <p className={`text-font_brighter_highlight text-sm md:text-base flex-1 flex items-center ${manga.title.length > 30 ? 'text-base' : 'text-lg'}`}>{manga.title_english !== null ? manga.title_english : manga.title}</p>
                    <div className="flex gap-2 flex-2">
                        {manga.genres.slice(0, 2).map((theme, index) => {
                            return <p
                                className={`text-xs bg-main_color text-font_brighter_highlight px-1 py-[1px] rounded-lg`}
                                key={index}>{theme.name}</p>
                        })}
                    </div>
                </div>
                <div
                    className="text-secondary_color w-full flex-1 text-lg flex items-center justify-end"> {manga.score}</div>
            </Link>


        </>
    )
}