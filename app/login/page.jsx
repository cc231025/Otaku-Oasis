'use client'
import Header from "@/components/header";
import {setCookie} from "cookies-next";
import { useRouter } from 'next/navigation';
import {login} from "@/utils/supabase/modules/userAthentication";
import Link from "next/link";
import Image from "next/image";
import {useState} from "react";


export default function LoginPage() {
    const router = useRouter(); // get the router object

    // My beautiful Login page
    // Define error state for if something goes wrong to notify the user

    const [error, setError] = useState(null);


    // We extract the formdata from the event and pass it on to supabase login function
    const handleLogin = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        try {
            const user_data = await login(formData);

            // If no error is thrown, we also set a cookie with the user_data that gets returned.
            // This is used often in various components, since it's quicker and simpler than querying supabase for everything
            // If we need certain Auth supabase is still used for critical things
            setCookie('user_data', JSON.stringify(user_data), {
                maxAge: 60 * 60,
            });
            router.push('/');
        } catch (error) {
            setError('Invalid Login Credentials!')
        }
    };


  return (
      <>
        <Header/>
          <div className="mt-20 flex justify-center ">

              <div className="  flex gap-8 rounded-2xl flex-col bg-background_lighter w-96 p-5">

                  <div className="text-xl font-bold text-center flex items-end justify-center">
                      <div className="flex px-3 bg-main_color py-2 rounded-xl hover:bg-main_color">
                          <Image
                              src={'/icons/about_large.svg'}
                              width={50}
                              height={50}
                              alt="Logo"
                              className="align-center w-auto h-auto inline-block align-bottom"
                              priority
                          />
                      </div>
                  </div>


                  <p className="text-center text-font_brighter_highlight text-lg">Login to find your favourite Anime and Manga!</p>
                  <form className="flex flex-col gap-4 justify-center w-full" onSubmit={handleLogin}>
                      <input placeholder="Email" className="bg-main_color_darker rounded border-2 border-background drop-shadow-2xl p-1 focus:bg-main_color text-font_dark_icons_text focus:text-font_brighter_highlight" id="email" name="email" type="email" required/>
                      <input placeholder="Password" className="bg-main_color_darker rounded border-2 border-background drop-shadow-2xl p-1 focus:bg-main_color text-font_dark_icons_text focus:text-font_brighter_highlight" id="password" name="password" type="password" required/>
                      <button className="w-full bg-main_color p-1 hover:bg-main_color_darker rounded text-lg text-font_brighter_highlight font-bold" type="submit">Log in</button>
                  </form>
                  <div className="flex justify-evenly font-bold">
                  <p className="flex-2 align-middle self-center">You don't have an Account yet?</p>
                      <Link  href="/signUp" className=" flex-1w-full bg-main_color p-1 px-2 hover:bg-main_color_darker rounded text-lg text-font_brighter_highlight"> Sign Up</Link>
                  </div>

                  {error &&
                      <p className="w-full bg-red-700 text-white border-2 border-font_dark_icons_text rounded-2xl bg-opacity-70 text-lg font-bold p-2 text-center ">{error}!</p>}
              </div>
          </div>
      </>
  )
}