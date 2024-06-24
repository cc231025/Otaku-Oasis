'use client'

import Header from "@/components/header";
import {setCookie} from "cookies-next";
import { useRouter } from 'next/navigation';
import {signup} from "@/utils/supabase/modules/userAthentication";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";

export default function SignUpPage() {

    const router = useRouter(); // get the router object

    // UseState to display different error messages to the user, like username allready exists, email allready in use ...
    const [error, setError] = useState(null);


    //Check if password confirm is correct,
    const handleSignup = async (event) => {
        event.preventDefault();

        if (event.target.password.value !== event.target.confirm_password.value) {
            setError('Passwords do not match')
            return;
        }
        // Try to sign up in superbase with the formdata, if an error is caught set the error message

        const formData = new FormData(event.target);
        try {
            const user_data = await signup(formData);
            // Note: User is automatically logged in since supabase handles it that way by default

            // On success also set the user_data cookie and redirect to main page
            setCookie('user_data', JSON.stringify(user_data), {
                maxAge: 60 * 60 * 24, // 1 week
            });
            router.push('/');
        } catch (error) {
            console.error(error);
            setError(error.message)
        }
    };

      return(
      <>

          <Header/>
          <div className="mt-20 flex justify-center ">

              <div className="  flex gap-8 rounded-2xl flex-col bg-background_lighter w-96 p-5">

                  <div className="text-xl font-bold text-center flex items-end justify-center">
                      <div className="flex px-3 bg-main_color py-2 rounded-xl hover:bg-main_color">
                          <Image
                              src={'/icons/about_large.svg'}
                              width={50} // increased from 15 to 30
                              height={50} // increased from 15 to 30
                              alt="Logo"
                              className="align-center w-auto h-auto inline-block align-bottom"
                              priority
                          />
                      </div>
                  </div>


                  <p className="text-center text-font_brighter_highlight text-lg">Sign up and join our Community! </p>
                  <form className="flex flex-col gap-4 justify-center w-full" onSubmit={handleSignup}>
                      <input placeholder="Email"
                             className="bg-main_color_darker rounded border-2 border-background drop-shadow-2xl p-1 focus:bg-main_color text-font_dark_icons_text focus:text-font_brighter_highlight"
                             id="email" name="email" type="email" required/>
                      <input placeholder="Username"
                             className="bg-main_color_darker rounded border-2 border-background drop-shadow-2xl p-1 focus:bg-main_color text-font_dark_icons_text focus:text-font_brighter_highlight"
                             id="username" name="username" type="username" required/>
                      <input placeholder="Password"
                             className="bg-main_color_darker rounded border-2 border-background drop-shadow-2xl p-1 focus:bg-main_color text-font_dark_icons_text focus:text-font_brighter_highlight"
                             id="password" name="password" type="password" required/>
                      <input placeholder="Confirm Password"
                             className="bg-main_color_darker rounded border-2 border-background drop-shadow-2xl p-1 focus:bg-main_color text-font_dark_icons_text focus:text-font_brighter_highlight"
                             id="confirm_password" name="confirm_password" type="password" required/>
                      <button className="w-full bg-main_color p-1 hover:bg-main_color_darker rounded text-lg text-font_brighter_highlight font-bold"
                              type="submit">Sign up
                      </button>
                  </form>
                  <div className="flex justify-evenly">
                      <p className="flex-2 align-middle self-center font-bold">Already have an Account?</p>
                      <Link href="/login"
                            className=" font-bold flex-1w-full bg-main_color p-1 px-2 hover:bg-main_color_darker rounded text-lg text-font_brighter_highlight"> Log in
                          </Link>
                  </div>

                  {error &&
                      <p className="w-full bg-red-700 text-white border-2 border-font_dark_icons_text rounded-2xl bg-opacity-70 text-lg font-bold p-2 text-center ">{error}!</p>}
              </div>
          </div>

      </>

      )
}