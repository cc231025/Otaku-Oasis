'use server'

import {createClient} from '@/utils/supabase/server'

const supabase = createClient()

// In here all my Supabase actions regarding users and their AnimeRelations or stored AnimeList is handled



// First get the current user with auth.getUser()
// Then check if there is an entry in user_animelist with this specific Anime_ID and user_id
export async function getUserRelation(anime_id) {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if(authError) return {userAuth: user, relation: undefined}


    const result = await supabase
        .from('user_animelist')
        .select('*')
        .eq('user_id', user.id)
        .eq('anime_id', anime_id);


    const {  data, error } = result;

    return { userAuth: user, relation: data[0] };
}


// Upload a new relation to the database
export async function uploadRelation (anime_id, user_id, username, anime){
    const supabase = createClient()


    const { data, error } = await supabase
        .from('user_animelist')
        .insert([
            {user_id: user_id, anime_id: anime_id, finished: false, planning: true, current_episode: 0, username: username, anime_JSON: anime},
        ])
        .select()

    if(error) throw error

    return data[0]

}

// Update a specific relation, this is only for planning finished watching status
export async function updateRelation ( user_id, anime_id, planning, finished){
    const supabase = createClient()



    const { data, error } = await supabase
        .from('user_animelist')
        .update({ finished: finished, planning: planning }, )
        .eq('user_id', user_id)
        .eq('anime_id', anime_id)
        .select()
    if(error) throw error

    return data
        [0]
}

// delete a relation from supabase
export async function removeRelation (user_id, anime_id ){
    const supabase = createClient()


    const { data, error } = await supabase
        .from('user_animelist')
        .delete()
        .eq('user_id', user_id)
        .eq('anime_id', anime_id)

    if(error) throw error

}



//Update the episode int in supabase
export async function updateEpisodeRelation (user_id, anime_id, episode ){
    const supabase = createClient()



    const { data, error } = await supabase
        .from('user_animelist')
        .update({ current_episode: Number(episode)} )
        .eq('user_id', user_id)
        .eq('anime_id', anime_id)
        .select()

    if(error) throw error
    return data[0]
}



// Get all animerelations with the username
export async function getAnimeList(username) {
    const supabase = createClient()



    const {data: animeList, error: userError} = await supabase
        .from('user_animelist')
        .select('*')
        .eq('username', username); // match by user id

    if (userError) {
        console.error('Error fetching AnimeList:', userError);
        return userError
    }

        return {animeList}


}

// Get the fixed slider anime data
export async function getSliderAnime() {
    const supabase = createClient()


    const result = await supabase
        .from('slider_anime')
        .select('anime')
    const { data, error } = result;

    if (error) {
        console.error(error);
        return;
    }

    // Map over the data array and return only the anime object from each item
    const animeData = data.map(item => item.anime);

    return(animeData);

}
