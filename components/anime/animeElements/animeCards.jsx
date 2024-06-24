'use client'

import Link from "next/link";
import Image from "next/image";

// Take anime Array as props and map through it
export default function AnimeCards (props) {
    const anime = props.anime

    // Image loader is needed for external image sources here, otherwise it would just default to my public folder
    const imageLoader = ({ src, width = 500, quality = 75 }) => {
        return `${src}?w=${width}&q=${quality}`
    }

    return (<div className="flex flex-wrap gap-6 justify-center mb-4">
            {anime.map((anime, key) => {
                return (
                    <div key={key}>
                        <Link href={`/anime/${anime.mal_id}`}>

                            <Image
                                loader={imageLoader}
                                src={anime.images.jpg.large_image_url}
                                width={500} // original width of the image
                                height={500} // original height of the image
                                alt="Picture of the anime"
                                className="lg:w-56 lg:h-[19rem] w-40 h-[15rem] object-cover hover:scale-105 transition duration-300 ease-in-out"

                            />
                        </Link>
                        <div
                            className="w-40 lg:w-56 bg-background_lighter text-xs lg:text-sm flex justify-between p-1">
                            <p>{anime.status}</p>
                            <p className="bg-main_color px-2 rounded">{anime.type}</p>


                        </div>
                        <p className="w-40 lg:w-56 mt-2 text-sm md:text-base lg:text-lg">{anime.title_english !== null ? anime.title_english : anime.title}</p>
                    </div>

                )

            })}


        </div>
    )
}