'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { getSliderAnime } from '@/utils/supabase/modules/userAnimeRelations';
import { SliderElement } from '@/components/sliderElement';

// Slider created using the Embla Carousel Module
// It's very easy to set up, costumize certain attributes and style
// Its filled using data from supabase I handpicked and uploaded
export function Slider() {
    const [anime, setAnime] = useState(null);

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);
    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    useEffect(() => {
        querySlider();
    }, []);

    async function querySlider() {
        const anime = await getSliderAnime();
        if (anime.length === 0) {
            setAnime(null);
        } else {
            setAnime(anime);
        }
    }

    return (
        <div className="embla flex flex-col gap-6 relative">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container max-h-[35rem] mt-8">
                    {anime !== null &&
                        anime.map((anime, key) => {
                            return (
                                <div key={key} className="px-[10rem] embla__slide">
                                    <SliderElement index={key} anime={anime}/>
                                </div>
                            );
                        })}
                </div>
            </div>
            <button className="embla__prev absolute left-0 sm:left-10 md:left-20  top-1/2 transform -translate-y-1/2" onClick={scrollPrev}>
                <svg id="slider" width="35" height="35" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                          strokeLinejoin="round"/>
                </svg>
            </button>
            <button className="embla__next absolute right-0 sm:right-10 md:right-20 top-1/2 transform -translate-y-1/2" onClick={scrollNext}>
                <svg id="slider" width="35" height="35" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                          strokeLinejoin="round"/>
                </svg>
            </button>
        </div>
    );
}
