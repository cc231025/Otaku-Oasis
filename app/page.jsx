import Header from "@/components/header";

import {Slider} from "@/components/slider";
import TopMangas from "@/components/manga/mangaElements/topMangas";
import TopAnimes from "@/components/anime/animeElements/topAnimes";
import TopAiringAnime from "@/components/anime/animeElements/topAiringAnime";


export default function Home() {
    return (
        <>
            <Header/>
            <Slider/>

            <div className="mt-8 w-full flex items-center flex-col justify-center mb-20 ">
                <div className="w-5/6 flex justify-center gap-12 flex-wrap ">
                <TopMangas/>
                <TopAnimes/>

                    <TopAiringAnime/>

                </div>
            </div>

        </>


    );
}
