'use client'



import {options} from "@/app/anime/options";


export default function FormatFilter(props) {
    // Based on the options object map through all possible Format Options and display them in the dropdown

    // Decide if the dropdown is open through the props useState
    const toggleDropdown = () => {
        (props.dropdownSelect !== 'format') ? props.setDropdownSelect('format') : props.setDropdownSelect('')
    }

    // Set the allOptions anew, if the option is already in there, remove it, otherwise reset it
    // Note only one Format can be selected at any time, since every anime has only one format
    const handleCheckboxChange = (option) => {
        props.setAllOptions((prev) => ({
            ...prev,
            format: prev.format.includes(option)
                ? prev.format.filter((o) => o !== option)
                : [option]
        }));
    };

    return (
        <div className="relative inline-block text-left w-40 lg:w-52">
            <div>
                <button
                    type="button"
                    className="inline-flex justify-between w-full rounded shadow-sm px-4 py-2 bg-background_lighter "
                    onClick={toggleDropdown}
                >
                    Select Formats
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

            {props.dropdownSelect === "format" && (
                <div
                    className="origin-top-right absolute left-0 w-[10rem] lg:w-[20rem] z-20 bg-background_lighter rounded-md shadow-lg max-h-80 overflow-y-scroll">
                    <div className="py-1 flex flex-wrap">
                        {options.format.map((option) => (
                            <div key={option.id} onClick={() => handleCheckboxChange(option)}
                                 className="flex items-center hover:bg-main_color_darker rounded-lg w-36 px-4 py-2">
                                <input
                                    type="checkbox"
                                    id={`option-${option.id}`}
                                    className="form-checkbox h-4 w-4 transition duration-150 ease-in-out"
                                    checked={props.allOptions.format.includes(option)}
                                    readOnly={true}
                                    // check the allOptions object if the current option is in there, based on that decide its checked state


                                />
                                <label                                      onClick={() => handleCheckboxChange(option)}
                                    htmlFor={`option-${option.id}`} className="ml-2 text-sm ">
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}