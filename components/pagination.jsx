


const Pagination = (props) => {
    // Take a page useState as props and set it,
    // taking effect in the parent component to set of a new query with the new page parameter

    const previousPageHandler = () => {
        if (props.page > 1) {
            props.setPage(props.page - 1)

        }
    }

    const nextPageHandler = () => {
        if (props.page < props.lastPage) {

            props.setPage(props.page + 1) }
    }

    return (
        <>

        <div className="flex justify-center bg-red items-center space-x-2 lg:space-x-4">
            <button
                onClick={previousPageHandler}
                className="flex items-center justify-center w-8 h-8  bg-main_color_darker  rounded-lg hover:bg-main_color hover:text-font_brighter_highlight "
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
            </button>
            <div className="text-gray-500 dark:text-gray-400 lg:text-base text-sm whitespace-nowrap">
                {props.page} of {props.lastPage}
            </div>
            <button
                onClick={nextPageHandler}
                className="flex items-center justify-center w-8 h-8  bg-main_color_darker  rounded-lg hover:bg-main_color hover:text-font_brighter_highlight "
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="9 18 15 12 9 6"/>
                </svg>

            </button>
        </div>
        </>
    )

}


export default Pagination