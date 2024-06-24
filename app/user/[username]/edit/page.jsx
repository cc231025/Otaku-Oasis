'use client'
import Image from "next/image";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookie, setCookie} from "cookies-next";
import {getLoggedInUser, uploadImage} from "@/utils/supabase/modules/userAthentication";
import {modifySrc} from "@/utils/supabase/modules/modifyImgSrc";

//Page to change a user's profile Image
export default function EditProfileImage({params}) {
    const router = useRouter(); // get the router object


    // Set UseStates for current user, errormessage and selectedImageName to display
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null)
    const [selectedImageName, setSelectedImageName] = useState(''); // state for selected image name


    useEffect(() => {



        checkAuthAndFetchUser();
    }, [router]);


    // Check if the correct user is logged and only trys to edit his own profile picture
    const checkAuthAndFetchUser = async () => {
        try {
        //     Confirm login with supabase
        const user = await getLoggedInUser()
            // Get the user cookie check if supabase session and user cookie have same id,
            // also check if the logged in user trys to edit his own image - If no throw him to his own profile
            const userData = getCookie('user_data');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    if(parsedUser.user_id === user.id && parsedUser.username === params.username){
                    setUser(parsedUser);}
                    else { router.push(`/user/${parsedUser.username}`)}
                }
                else{router.push('/login')}


        }
        // If supabase says no, throw user to the login page
        catch (userError){
                router.push('/login');

        }

    };


    // On submit handle the upload, get the formdata from event check if its a valid image otherwise set error message
    const handleImageUpload = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        if(!formData.get('image').type.match('image.*')){
            setError('Not an Image, please select a valid image Format!')
            return
        }
        // Try to upload to supabase storage and update the current user cookie as well
        try {
            const image_uuid = await uploadImage(formData, user.image_uuid, user.user_id);

            const updatedUser = { ...user, image_uuid };
            setCookie('user_data', JSON.stringify(updatedUser), {
                maxAge: 60 * 60 * 24, // 1 week
            });
            router.push(`/user/${user.username}`)

        } catch (error) {
            setError(error)
        }
    };

    // handle file input change on manual file selection, just change the useState to display the current filename
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImageName(file.name);
        } else {
            setSelectedImageName('');
        }
    };



    const handleDragOver = (event) => {
        event.preventDefault();
    };

    // handle file input change on drag and drop, change the useState to display the current filename
    // Creates a new DataTransfer object, adds the dropped file to it,
    // and assigns it to the file input element 'dropzone-file'.
    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            setSelectedImageName(file.name);
            const input = document.getElementById('dropzone-file');
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            input.files = dataTransfer.files;
        } else {
            setError('Not an Image, please select a valid image Format!');
        }
    };



    return (
        <>
            <Header />
            {user !== null && (
                <div className="w-full flex justify-center mt-16">
                    <div className="flex font-bold text-center bg-background_lighter p-8 flex-col gap-8">
                        <p className="text-lg text-font_brighter_highlight">Set your profile Picture and personalize your Account!</p>
                        <p className="text-lg">Current Profile Picture</p>

                        <Image
                            src={modifySrc(user.image_uuid)}
                            width={500}
                            height={500}
                            priority
                            alt="Picture of the author"
                            className="self-center rounded-xl max-h-40 w-auto object-cover"
                        />

                        <form className="flex flex-col gap-4" onSubmit={handleImageUpload}>
                            <label className="flex flex-col justify-center">
                                <div
                                    className="flex items-center justify-center w-full"
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    <label htmlFor="dropzone-file"
                                           className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                                 aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                 viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round"
                                                      strokeLinejoin="round" strokeWidth="2"
                                                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                            </svg>

                                            {selectedImageName ? (
                                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Selected
                                                        file: {selectedImageName}</p>
                                                ) :(
                                                    <>
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span
                                                    className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF
                                                (MAX. 800x400px)</p>
                                                    </>)

                                            }
                                        </div>
                                        <input id="dropzone-file" name="image" type="file" className="hidden"
                                               onChange={handleFileChange}/>
                                    </label>
                                </div>
                            </label>
                            <button
                                className="w-full bg-main_color p-1 hover:bg-main_color_darker rounded text-lg text-font_brighter_highlight font-bold"
                                type="submit">Set new Image
                            </button>
                        </form>

                        {error &&
                            <p className="w-full bg-red-700 text-white border-2 border-font_dark_icons_text rounded-2xl bg-opacity-70 text-lg font-bold p-2 text-center ">{error}!</p>}


                    </div>
                </div>
            )}
        </>
    );
}
