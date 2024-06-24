//A classic search bar that passes its value onsubmit to its parent via the queryAnime props onsubmit
export default function SearchBar(props) {

    const submitHandler = (event) => {
        event.preventDefault()
        props.queryAnime()
    };

    return (
        <section className=" justify-center w-40 lg:w-52 ">

            <form onChange={(e) => {
                props.setQuery(e.target.value)
            }} onSubmit={submitHandler} className="group relative z-0 ">

                <svg width="20" height="20" fill="#A8A8A8"
                     className="absolute left-3 top-[0.65rem]  text-slate-400 "
                     aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
                </svg>
                <input id="searchInput" name="queryInput"
                       className="focus:ring-2 ring-main_color focus:ring-main_color focus:outline-none bg-background_lighter   w-full text-sm leading-6 rounded-md py-2 pl-10  "
                       type="text" aria-label="Filter Movies" placeholder="Search"></input>
            </form>
        </section>)
}