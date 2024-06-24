'use server'

import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {v4 as uuidv4} from "uuid";
import path from "path";


const supabase = createClient()



export async function signup(formData) {
    const supabase = createClient()
    // Deconstruct the formdata we get
    const email = formData.get('email')
    const password = formData.get('password')
    const username = formData.get('username')

    // Check if the user already exists in our additional auth_users table
    const {data: existingUsers, error: existingUsersError} = await supabase
        .from('auth_users')
        .select('username')
        .eq('username', username);

    if (existingUsersError) throw existingUsersError;
    if (existingUsers && existingUsers.length > 0) throw new Error('Username is already taken');

    // Signup with superbase, addtionally add metadata username and image_uuid
    const {data: {user}, error} = await supabase.auth.signUp({
        email, password,
        options: {
            data: {
                username: username,
                image_uuid: 'placeholder.jpg'
            }
        }
    })
    if (error) {
        throw error
    }

    // Then create a new entry in auth_users table
    // This table is used to store additional information since the authentication from supabase can only store mail and password by default
    // This allows easier access to the user data throughout the app
    const {error: insertError} = await supabase
        .from('auth_users')
        .insert({
            username: username,
            user_id: user.id,
            image_uuid: 'placeholder.jpg'
        })

    if (insertError) {
        throw new Error(insertError.message);
    }

    // Then try to get the new entry from the table and return the data
    const {data: user_data, error: userError} = await supabase
        .from('auth_users')
        .select('*')
        .eq('user_id', user.id); // match by user id

    if (userError) {
        throw new Error(userError.message); // throw an error

    }
    return user_data[0]
}

// ##########################################################################################################################


export async function login(formData) {
    const supabase = createClient()


    const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    // Try login with supabase
    const {data: {user}, error: loginError} = await supabase.auth.signInWithPassword(loginData)

    if (loginError) {
        throw (loginError.message);
    }

    // On success get the full user data and return it
    const {data: user_data, error: userError} = await supabase
        .from('auth_users')
        .select('*')
        .eq('user_id', user.id); // match by user id

    if (userError) {
        throw (userError.message);


    }
    return user_data[0]
}


// ##########################################################################################################################

//Try to logout and redirect home
export async function logout() {
    const supabase = createClient()


    await supabase.auth.signOut();


    revalidatePath('/', 'layout')
    redirect('/')
}
// ##########################################################################################################################


// Upload the image using supabase storage
export async function uploadImage(formData, old_image_uuid, user_id) {
    const supabase = createClient()

    // prepare image data an generate uuid name, so that no image will have the same name in the db ever
    const image = formData.get('image')

    const image_uuid = uuidv4();
    const fileType = path.extname(image.name);
    const imageName = image_uuid + fileType


    // Try to upload it
    const { error: imageUploadError} = await supabase.storage.from('profile_images').upload(imageName, image, {
        upsert: true,
    })

    if (imageUploadError) {
        throw (imageUploadError.message);
    }

    // Try to delete the old image It's name is not placeholder.jpg
    if(old_image_uuid !== 'placeholder.jpg'){
    const { error: imageDeleteError} = await supabase.storage.from('profile_images').remove([old_image_uuid])
        if (imageDeleteError) {
            throw (imageDeleteError.message);
        }
    }

    // Update all rows of comments and posts with new image_uuid

    const {  error: postUpdateError } = await supabase
        .from('posts')
        .update({ image_uuid: imageName })
        .eq('user_id', user_id)

    if (postUpdateError) {
        throw (postUpdateError.message);
    }

    const {  error: commentUpdateError } = await supabase
        .from('comments')
        .update({ image_uuid: imageName })
        .eq('user_id', user_id)

    if (commentUpdateError) {
        throw (commentUpdateError.message);
    }

    // update the user in the database and later after returning also set the cookie anew

    const { error: updateUserError} = await supabase
        .from('auth_users')
        .update({image_uuid: imageName})
        .eq('user_id', user_id); // match by user id

    if (updateUserError) {
        throw (updateUserError.message);
    } else {
        return imageName
    }

}
// ##########################################################################################################################


// Very descriptive name right
export async function getUserByUsername(username) {
    const supabase = createClient()

    const {data: user, error: userError} = await supabase
        .from('auth_users')
        .select('*')
        .eq('username', username); // match by user id

    if (userError) {
        console.error('Error fetching user:', userError);
        return userError
    } else {
        return user
    }

}

// Get current user useing supabase auth
export async function getLoggedInUser() {
    const supabase = createClient()

    const {data: {user}, error: userError} = await supabase.auth.getUser()


    if (userError) {
        throw userError
    } else {
        return user
    }

}

