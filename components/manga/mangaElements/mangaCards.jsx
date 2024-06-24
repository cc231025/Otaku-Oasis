'use client'

import Link from "next/link";
import Image from "next/image";


export default function MangaCards (props) {
    // This is esentialy also the same component as animeCards;
    //  therefore, instead of refactoring everything to manga, I simply passed it as anime in props

    // The only difference here really is the href=/manga instead of /anime

    const anime = props.anime


    const imageLoader = ({ src, width = 500, quality = 75 }) => {
        return `${src}?w=${width}&q=${quality}`
    }

    return (<div className="flex flex-wrap gap-6 justify-center mb-4">
            {anime.map((anime, key) => {
                return (
                    <div key={key}>
                        <Link href={`/manga/${anime.mal_id}`}>

                            <Image
                                loader={imageLoader}
                                src={anime.images.jpg.large_image_url}
                                width={500}
                                height={500}
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