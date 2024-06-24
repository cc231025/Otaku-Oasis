'use server'

import {createClient} from "@/utils/supabase/server";



// All the supabase operations regarding posts and comments are handled here

// Get all posts
export async function getPosts() {
    const supabase = createClient()


    const {data: posts, error} = await supabase
        .from('posts')
        .select('*')


    if (error) throw error

    return posts
}

// Get Posts by username for the profile page
export async function getPostsByUsername(username) {
    const supabase = createClient()


    const {data: posts, error} = await supabase
        .from('posts')
        .select('*')
        .eq('username', username)

    if (error) throw error

    return posts
}

// Single Post for the Forum/[PostID] page
// Also gets all comments with the post_id
export async function getSinglePost(post_id) {
    const supabase = createClient()


    const {data: post, error} = await supabase
        .from('posts')
        .select('*')
        .eq('id', post_id)

    if (error) throw error


    const {data: comments, commentsError} = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', post_id)
        .order('created_at')

    if (commentsError) throw commentsError


    if (post.length === 0) throw new Error('Probably not a valid post id')

    return {post: post[0], comments}
}




// Upload a new post, insert all the necessary data ...
export async function uploadPost(loggedInUser, title, content) {
    const supabase = createClient()

    const {data, error} = await supabase
        .from('posts')
        .insert([
            {
                user_id: loggedInUser.user_id,
                username: loggedInUser.username,
                image_uuid: loggedInUser.image_uuid,
                post_title: title,
                post_content: content,
                edited: false,
            },
        ])
        .select()

    if (error) throw error

    return data[0]
}

// Upload a single comment
export async function uploadComment(loggedInUser, post,  content) {
    const supabase = createClient()

    const {data, error} = await supabase
        .from('comments')
        .insert([
            {
                post_id: post.id,
                user_id: loggedInUser.user_id,
                username: loggedInUser.username,
                image_uuid: loggedInUser.image_uuid,
                comment_content: content,
                edited: false,
            },
        ])
        .select()

    if (error) throw error

    return data[0]
}


// Update a comment
export async function uploadCommentEdit(comment_id, comment_content) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('comments')
        .update({ 'comment_content': comment_content, 'edited': true})
        .eq('id', comment_id)
        .select()

    if (error) throw error

    return data[0]
}

// Delete a comment forever
export async function removeComment(comment_id) {
    const supabase = createClient()

    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', comment_id)

    if (error) throw error


}