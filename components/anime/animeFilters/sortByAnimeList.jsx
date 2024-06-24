'use client'

import {useState} from "react";

// Sorting Dropdown Element, used in the Manga as well as in the AnimeList
// determines if thew user want to sort his list by date (asc, desc) or alphabetically
export default function SortByAnimeList(props) {
    const [dropDownOpen, setDropDownOpen] = useState(false)


    const toggleDropdown = () => {
        setDropDownOpen(!dropDownOpen)
    }

    // On change determine what has been selected, if its same just return
    // else set the sortby in the parent component
    const handleCheckboxChange = (option) => {
        if (props.sortBy === option) {
            return
        }

        switch(option) {
            case 'dateDesc':
                props.sortAnimeListByDate(props.animeList, option)
                break;
            case 'dateAsc':
                props.sortAnimeListByDate(props.animeList, option)
                break;
            case 'AZ':
                props.sortAnimeListAlphabetically(props.animeList, option)
                break;
            case 'ZA':
                props.sortAnimeListAlphabetically(props.animeList, option)
                break;
        }

            props.setSortBy(option);

    };

    return (
        <div className="relative inline-block z-10 text-left w-40 lg:w-52">
            <div>
                <button
                    type="button"
                    className="inline-flex justify-between w-full rounded shadow-sm px-4 py-2 bg-background_lighter "
                    onClick={toggleDropdown}
                >
                    Sort
                    <svg
                        className="-mr-1 ml-2 mt-1 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="#A8A8A8"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            {dropDownOpen && (
                <div
                    className="origin-top-right absolute left-0 w-[10rem] lg:w-[13rem] bg-background_lighter rounded-md shadow-lg max-h-80 overflow-y-scroll">
                    <div className="py-1 flex flex-wrap">
                        <div onClick={() => handleCheckboxChange('dateDesc')}
                             className="flex items-center hover:bg-main_color_darker rounded-lg w-full px-4 py-2">
                            <input
                                id="dateDesc"
                                type="checkbox"
                                className="form-checkbox h-4 w-4 transition duration-150 ease-in-out"
                                checked={props.sortBy === 'dateDesc'}
                                readOnly={true}
                            />
                            <label onClick={() => handleCheckboxChange('dateDesc')}
                                   className="ml-2 text-sm">
                                Added (Descending)
                            </label>
                        </div>

                    </div>
                    <div className="py-1 flex flex-wrap">
                        <div onClick={() => handleCheckboxChange('dateAsc')}
                             className="flex items-center hover:bg-main_color_darker rounded-lg w-full px-4 py-2">
                            <input
                                id="dateDesc"
                                type="checkbox"
                                className="form-checkbox h-4 w-4 transition duration-150 ease-in-out"
                                checked={props.sortBy === 'dateAsc'}
                                readOnly={true}
                            />
                            <label onClick={() => handleCheckboxChange('dateAsc')}
                                   className="ml-2 text-sm">
                                Added (Ascending)
                            </label>
                        </div>

                    </div>
                    <div className="py-1 flex flex-wrap">
                        <div onClick={() => handleCheckboxChange('AZ')}
                             className="flex items-center hover:bg-main_color_darker rounded-lg w-full px-4 py-2">
                            <input
                                id="dateDesc"
                                type="checkbox"
                                className="form-checkbox h-4 w-4 transition duration-150 ease-in-out"
                                checked={props.sortBy === 'AZ'}
                                readOnly={true}
                            />
                            <label onClick={() => handleCheckboxChange('AZ')}
                                   className="ml-2 text-sm">
                                A -- Z
                            </label>
                        </div>

                    </div>
                    <div className="py-1 flex flex-wrap">
                        <div onClick={() => handleCheckboxChange('ZA')}
                             className="flex items-center hover:bg-main_color_darker rounded-lg w-full px-4 py-2">
                            <input
                                id="dateDesc"
                                type="checkbox"
                                className="form-checkbox h-4 w-4 transition duration-150 ease-in-out"
                                checked={props.sortBy === 'ZA'}
                                readOnly={true}
                            />
                            <label onClick={() => handleCheckboxChange('ZA')}
                                   className="ml-2 text-sm">
                                Z -- A
                            </label>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}