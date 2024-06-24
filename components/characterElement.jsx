
import Image from 'next/image'

export default function CharacterElement({character}) {
    // Single characterElement displayed in single Anime view

    const imageLoader = ({src, width = 500, quality = 75}) => {
        return `${src}?w=${width}&q=${quality}`
    }

    return (<>

            <div className="h-full w-[4.5rem] flex-shrink-0 ">
                <Image
                    loader={imageLoader}
                    src={character.character.images.webp.image_url}
                    width={80} // or any preferred width
                    height={120} // or any preferred height
                    alt="Picture of the anime"
                    className="object-cover h-full w-full rounded-l-2xl"
                />
            </div>
            <div className="flex justify-evenly text-center w-full  flex-col py-2">
                <p className="fle flex-wrap text-base sm:text-xl">{character.character.name}</p>
                <p className="text-xs sm:text-sm">{character.role}</p>

            </div>
        </>
    )
}