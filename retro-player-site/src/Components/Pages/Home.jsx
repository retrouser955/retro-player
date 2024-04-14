import { useEffect, useState } from "react"

export default function Home() {
    const [last, setLast] = useState()

    useEffect(() => {
        const lastSong = localStorage.getItem("last") 

        setLast(lastSong)
    }, [])

    return (
        <div>{last == null ? <div className="text-center text-white text-3xl">First Time?</div> : <></>}</div>
    )
}
