'use client'



import {options} from "@/app/manga/options";

// Almost identical to the Filter for Anime, for exact comments refer to that component

export default function GenreFilterManga(props) {


    const toggleDropdown = () => {
        (props.dropdownSelect !== 'genre') ? props.setDropdownSelect('genre') : props.setDropdownSelect('')
    }

    const handleCheckboxChange = (option) => {
        props.setAllOptions((prev) => ({
            ...prev,
            genre: prev.genre.includes(option)
                ? prev.genre.filter((o) => o !== option)
                : [...prev.genre, option]
        }));
    };

    return (
        <div className="relative inline-block text-left w-40 lg:w-52 ">
            <div>
                <button
                    type="button"
                    className="inline-flex justify-between w-full rounded shadow-sm px-4 py-2 bg-background_lighter "
                    onClick={toggleDropdown}
                >
                    Select Genres
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

            {props.dropdownSelect === "genre" && (
                <div
                    className="origin-top-right absolute z-20 left-0 w-[10rem] lg:w-[20rem] bg-background_lighter rounded-md shadow-lg max-h-80 overflow-y-scroll">
                    <div className="py-1 flex flex-wrap">
                        {options.genre.map((option) => (
                        <div key={option.id} onClick={() => handleCheckboxChange(option)}
                                 className="flex items-center hover:bg-main_color_darker rounded-lg w-36 px-4 py-2">
                                <input
                                    type="checkbox"
                                    id={`option-${option.id}`}
                                    className="form-checkbox h-4 w-4 transition duration-150 ease-in-out"
                                    checked={props.allOptions.genre.includes(option)}
                                    readOnly={true}
                                    // onChange={() => handleCheckboxChange(option)}
                                />
                                <label onClick={() => handleCheckboxChange(option)} htmlFor={`option-${option.id}`} className="ml-2 text-sm">
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );


    //
    // // const onSubmitHandler = (event) => {
    // //     event.preventDefault()
    // //     const value = event.target[0].value
    // //     props.searchFilter(value)
    // // };
    //
    // return (<>
    //     <select onSubmit={props.setGenre()} name="cars" id="cars">
    //         <option value="volvo">Volvo</option>
    //         <option value="saab">Saab</option>
    //         <option value="mercedes">Mercedes</option>
    //         <option value="audi">Audi</option>
    //     </select>
    //
    //     </>
    //
    // )
}