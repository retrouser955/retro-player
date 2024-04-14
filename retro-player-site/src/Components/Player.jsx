import { useEffect, useState } from "react"
import { BsFillPlayCircleFill, BsFillSkipEndFill, BsFillSkipStartFill, BsFillPauseCircleFill } from "react-icons/bs"
import usePlayer from "../Hooks/player"

export default function Player({ progress, status, info }) {
    const [, setProgressBar] = useState()
    const [player] = usePlayer()
    const [isPaused, setPaused] = status
    const [songInfo] = info

    useEffect(() => {
        setProgressBar(progress)
    }, [progress])

    function toggle() {
        if (!player.src) return
        setPaused(!isPaused)
        player.paused ? player.play() : player.pause()
    }

    return (
        <div className={`bottom-0 left-0 overflow-hidden bg-black absolute w-screen h-[10vh]`}>
            <div className="absolute left-0 bottom-0 pl-5 h-[90%] w-96 flex items-center">
                <div className="h-[70%] w-full truncate">
                    {
                        songInfo.name ?
                            <>
                                <p className="text-white font-mono font-extrabold">{songInfo.name}</p>
                                <p className="text-zinc-400 text-xs">{songInfo.author}</p>
                            </>
                            :
                            <></>
                    }
                </div>
            </div>
            <div className="w-screen h-[4px] cursor-pointer bg-neutral-500 group" onClick={(e) => {
                if(!player.src) return

                const x = e.nativeEvent.offsetX
                const fullX = e.currentTarget.clientWidth
                const duration = player.duration

                player.currentTime = (x / fullX) * duration
            }}>
                <div className={`h-full bg-white transition-all hover:bg-green-500 rounded-r-xl cursor-pointer group-hover:bg-green-500`} style={{
                    width: progress ? `${progress}%` : "0%"
                }}></div>
            </div>
            <div className="h-[10vh]">
                <div className="w-[50%] h-full mx-auto flex justify-center items-center">
                    <BsFillSkipStartFill size={30} color="#F9F9F9" className="cursor-pointer" />
                    {
                        isPaused ?
                            <BsFillPlayCircleFill size={35} color="#F9F9F9" className="mx-20 cursor-pointer" onClick={toggle} /> :
                            <BsFillPauseCircleFill size={35} color="#F9F9F9" className="mx-20 cursor-pointer" onClick={toggle} />
                    }
                    <BsFillSkipEndFill size={30} color="#F9F9F9" className="cursor-pointer" />
                </div>
            </div>
            <div className="absolute right-0 bottom-0 pr-5 h-[90%] w-56 flex items-center">
                <input type="range" defaultValue={50} max={100} min={0} onChange={(e) => {
                    // set the volume
                    player.volume = e.target.value / 100

                    window.volume = e.target.value / 100
                }}/>
            </div>
        </div>
    )
}
