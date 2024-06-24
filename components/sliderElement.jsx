import Image from "next/image";
import Link from "next/link";

// Single Slider element
// Not much to say just styling and using the props we passed it
export function SliderElement(props) {
    const anime = props.anime;

    const imageLoader = ({ src, width = 500, quality = 75 }) => {
        return `${src}?w=${width}&q=${quality}`;
    };

    return (
        <div className="w-auto flex lg:bg-background_lighter justify-center lg:justify-start xl:gap-20 rounded-2xl max-h-[35rem] lg:h-[35rem]">
            <div className=" h-full lg:max-w-1/3 flex items-center justify-center">
                <Link  href={`/anime/${anime.mal_id}`} className="h-full flex justify-start max-w-96 min-w-72">
                    <Image
                        loader={imageLoader}
                        src={anime.images.jpg.large_image_url}
                        width={320}
                        height={480}
                        alt="Picture of the anime"
                        className="object-cover h-full self-start w-full rounded-lg"
                    />
                </Link>
            </div>
            <div className=" hidden w-2/3 p-4 lg:flex flex-col justify-evenly gap-4 px-8 pt-2 ">
                <h1 className="text-4xl font-bold text-main_color text-center">{anime.title}</h1>
                <p className=" text-sm xl:text-base  text-font_brighter_highlight">
                {anime.synopsis.length > 700 ? anime.synopsis.substring(0, 700) + "..." : anime.synopsis}
                </p>
                <div className="flex gap-2 flex-2">
                    {anime.genres.slice(0, 3).map((theme, index) => {
                        return (
                            <p
                                className=" text-xs bg-main_color text-font_brighter_highlight px-1 py-[1px] rounded-lg"
                                key={index}
                            >
                                {theme.name}
                            </p>
                        );
                    })}
                </div>
                <div className=" w-full flex justify-end">
                    <Link href={`/anime/${anime.mal_id}`} className="bg-main_color font-bold text-base lg:text-lg xl:text-2xl text-font_brighter_highlight px-4 py-2 rounded-lg"> More Info                        </Link>
                </div>
            </div>
        </div>
    );
}
