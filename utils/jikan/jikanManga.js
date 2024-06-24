'use server'

import axios from 'axios';

// Again, basically the same an in JikanAnime.js
export const getManga = async (query, allOptions, page) => {

    const queryURL = await buildQueryStringManga(query, allOptions, page)

    try {
        const response = await axios.get(queryURL)
        return {manga: response.data.data, last_page: response.data.pagination.last_visible_page};
    } catch (error) {
        console.error('Error fetching Manga data:', error);
        throw error;
    }
};


export const getSingleManga = async (id) => {
    let manga
    let characters

    try {
        manga = await axios.get(`https://api.jikan.moe/v4/manga/${id}/full`)
    } catch (error) {
        console.error('Error fetching Manga data:', error);
        throw error;
    }

    try {
        characters = await axios.get(`https://api.jikan.moe/v4/manga/${id}/characters`)
    } catch (error) {
        console.error('Error fetching character data:', error);
        throw error;
    }

    return {manga: manga.data.data, characters: characters.data.data}

};


export const buildQueryStringManga = async (query, allOptions, page) => {

    const baseUrl = 'https://api.jikan.moe/v4/manga';
    const queryParams = ['sfw=true'];

    if (query !== '') queryParams.push(`q=${encodeURIComponent(query)}`);

    if (allOptions.genre.length !== 0) {
        let arr = []
        for (let i = 0; i < allOptions.genre.length; i++) {
            arr.push(allOptions.genre[i].id)
        }
        arr = arr.join(',')
        queryParams.push(`genres=${arr}`)
    }

    if (allOptions.format.length !== 0) queryParams.push(`type=${allOptions.format[0].label}`);
    if (allOptions.status.length !== 0) queryParams.push(`status=${allOptions.status[0].label}`);
    queryParams.push(`page=${page}`)

    return `${baseUrl}?${queryParams.join('&')}`;
}


export const getTopMangaNoLimit = async (page) => {


    try {
        const response = await axios.get(`https://api.jikan.moe/v4/top/manga?sfw=true&limit=24&page=${page}`)
        return {manga: response.data.data, last_page: response.data.pagination.last_visible_page};
    } catch (error) {
        console.error('Error fetching manga data:', error);
        throw error;
    }
};

export const getTopMangas = async () => {

    try {
        const response = await axios.get(`https://api.jikan.moe/v4/top/manga?sfw=true&limit=9`)
        return response.data.data;
    } catch (error) {
        console.error('Error fetching anime data:', error);
        throw error;
    }
};