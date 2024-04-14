import Items from "./Navigation/Items"
import { AiFillHome } from "react-icons/ai"
import { FaSearch } from "react-icons/fa"
import { RiPlayList2Fill } from "react-icons/ri"
import { CgLoadbarSound } from "react-icons/cg"

export default function Navigation({ set: setPage, index, info }) {
    const [songInfo] = info

    return (
        <div className="h-screen w-[20vw] bg-neutral-900 border-r-2 top-0 absolute left-0 border-neutral-500">
            <div className="w-full h-auto pt-5">
                <Items index={1} text="Home" set={setPage} current={index} icon={<AiFillHome className="transition-all" size={25} color={index === 1 ? "#000000" : "#FFFFFF"} />} />
                <Items index={2} text="Search" set={setPage} current={index} icon={<FaSearch className="transition-all" size={25} color={index === 2 ? "#000000" : "#FFFFFF"} />} />
                <Items index={3} text="Playlist" set={setPage} current={index} icon={<RiPlayList2Fill className="transition-all" size={25} color={index === 3 ? "#000000" : "#FFFFFF"} />} />
                <Items index={4} text="Visualizer" set={setPage} current={index} icon={<CgLoadbarSound className="transition-all" size={25} color={index === 4 ? "#000000" : "#FFFFFF"} />} />
            </div>
            <div className="w-full h-[20vw] bottom-[10vh] absolute">
                {
                    songInfo.picture ?
                    <img src={songInfo.picture} alt="" className="w-full h-full object-cover" /> :
                    <></>
                }
            </div>
        </div>
    )
}
