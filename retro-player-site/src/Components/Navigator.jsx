import { useEffect, useState } from "react"
import Home from "./Pages/Home"
import Visualizer from "./Pages/Visualizer"
import Playlist from "./Pages/Playlist"
import Search from "./Pages/Search"

export default function Navigator({ index, info }) {
    const [page, setPage] = useState()

    useEffect(() => {
        switch(index) {
            case 1:
                setPage(<Home />)
                break;
            case 2:
                setPage(<Search info={info} />)
                break;
            case 3:
                setPage(<Playlist />)
                break;
            case 4:
                setPage(<Visualizer />)
                break;
        }
    }, [index])

    return (
        <div className="right-0 top-0 absolute w-[80vw] h-[90vh] bg-black">
            {page}
        </div>
    )
}
