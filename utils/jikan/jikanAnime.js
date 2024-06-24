'use server'

import axios from 'axios';


// Get an Anime by different filters and querystring if there are any
export const getAnime = async (query, allOptions, page) => {

    // Build the query string with all the necessary data
    const queryURL = await buildQueryString(query, allOptions, page)

    // Then try to send a get Request to the Jikan API
    try {
        const response = await axios.get(queryURL)
        return { anime: response.data.data, last_page: response.data.pagination.last_visible_page };
    } catch (error) {
        console.error('Error fetching anime data:', error);
        throw error;
    }
};


// Single Anime always the same query string just with different id,
// Also characters additionally since they are not included, not even in the anime_id/full query
export const getSingleAnime = async (id) => {
    let anime
    let characters

    try {
        anime = await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`)
    } catch (error) {
        console.error('Error fetching anime data:', error);
        throw error;
    }

    try{
        characters = await axios.get(`https://api.jikan.moe/v4/anime/${id}/characters`)
    }
    catch (error) {
        console.error('Error fetching character data:', error);
        throw error;
    }

    return {anime: anime.data.data, characters: characters.data.data}





};

// Build the complete query string for the detailed anime search
export const buildQueryString = async (query, allOptions, page) => {
    // Take the base Url and initiate the params array with safeforwork search first

    const baseUrl = 'https://api.jikan.moe/v4/anime';
    const queryParams = ['sfw=true'];


    // If there is a query set the query addition
    if (query !== '') queryParams.push(`q=${encodeURIComponent(query)}`);

    // Push all genres in the array that the user selected
    if (allOptions.genre.length !== 0){
        let arr = []
        for (let i = 0; i < allOptions.genre.length ; i++){
            arr.push(allOptions.genre[i].id)
        }
         arr = arr.join(',')
            queryParams.push(`genres=${arr}`)
    }

    // I dont think I left releaseYear in... but better safe than sorry
    if (allOptions.releaseYear.length !== 0){

        queryParams.push(`start_date=${allOptions.releaseYear[0].label}-01-01&end_date=${Number(allOptions.releaseYear[0].label) + 1}-01-01`);
    }

    if (allOptions.format.length !== 0) queryParams.push(`type=${allOptions.format[0].label}`);
    if (allOptions.status.length !== 0) queryParams.push(`status=${allOptions.status[0].label}`);
    if (allOptions.producer.length !== 0) queryParams.push(`producer=${allOptions.producer[0].id}`);

    // Bpush the curent page also in the array
    queryParams.push(`page=${page}`)

    // Basically after having the complete array we just join it by &, this puts all parameters we give it together to create one URL that works
    return `${baseUrl}?${queryParams.join('&')}`;
}


// 9 Top anime based on rank I think used in the homepage
export const getTopAnimes = async () => {


    try {
        const response = await axios.get(`https://api.jikan.moe/v4/top/anime?sfw=true&limit=9`)
        return response.data.data;
    } catch (error) {
        console.error('Error fetching anime data:', error);
        throw error;
    }
};

// Top anime for the anime browse page
export const getTopAnimesNoLimit = async (page) => {

    try {
        const response = await axios.get(`https://api.jikan.moe/v4/top/anime?sfw=true&limit=24&page=${page}`)
        return { anime: response.data.data, last_page: response.data.pagination.last_visible_page };
    } catch (error) {
        console.error('Error fetching anime data:', error);
        throw error;
    }
};


// 9 Top Airing anime based on rank I think used in the homepage

export const getTopAiringAnimes = async () => {
    try {
        const response = await axios.get(`https://api.jikan.moe/v4/top/anime?filter=airing&sfw=true&limit=9`)
        return response.data.data;
    } catch (error) {
        console.error('Error fetching anime data:', error);
        throw error;
    }
};
