'use server'

import {createClient} from '@/utils/supabase/server'

const supabase = createClient()


// As usual, I had to do everything twice, so for more comments check the userAnimeRelations.js


export async function getUserRelation(manga_id) {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    // if(authError) throw authError

    if(authError) return {userAuth: user, relation: undefined}


    const result = await supabase
        .from('user_mangalist')
        .select('*')
        .eq('user_id', user.id)
        .eq('manga_id', manga_id);


    const {  data, error } = result;

    return { userAuth: user, relation: data[0] };
}



export async function uploadRelation (manga_id, user_id, username, manga){
    const supabase = createClient()


    const { data, error } = await supabase
        .from('user_mangalist')
        .insert([
            {user_id: user_id, manga_id: manga_id, finished: false, planning: true, current_chapter: 0, username: username, manga_JSON: manga},
        ])
        .select()

    return data[0]

}


export async function updateRelation ( user_id, manga_id, planning, finished){
    const supabase = createClient()



    const { data, error } = await supabase
        .from('user_mangalist')
        .update({ finished: finished, planning: planning }, )
        .eq('user_id', user_id)
        .eq('manga_id', manga_id)
        .select()
    if(error) throw error

    return data
        [0]
}


export async function removeRelation (user_id, manga_id ){
    const supabase = createClient()


    const { data, error } = await supabase
        .from('user_mangalist')
        .delete()
        .eq('user_id', user_id)
        .eq('manga_id', manga_id)

    if(error) throw error

}




export async function updateChapterRelation (user_id, manga_id, chapter ){
    const supabase = createClient()



    const { data, error } = await supabase
        .from('user_mangalist')
        .update({ current_chapter: Number(chapter)} )
        .eq('user_id', user_id)
        .eq('manga_id', manga_id)
        .select()

    if(error) throw error
    return data[0]
}




export async function getMangaList(username) {
    const supabase = createClient()



    const {data: mangaList, error: userError} = await supabase
        .from('user_mangalist')
        .select('*')
        .eq('username', username); // match by user id

    if (userError) {
        console.error('Error fetching user:', userError);
        return userError
    }

        return {mangaList}

}


