import React, { useEffect } from 'react'
import { IoIosAddCircle } from "react-icons/io"
import { default as axios } from "axios"

export default function Playlist() {

    // useEffect(() => {

    // }, [])

    async function loadPlaylists() {
        const allPlaylist = await axios.get('http://localhost:7123/playlist/all')

        return allPlaylist
    }

    return (
        <div className="pl-10 pt-7 w-full">
            <div className="text-transparent text-5xl bg-clip-text bg-gradient-to-r from-blue-600 via-red-600 to-green-500 font-extrabold italic text-white"><p className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-purple-400 via-blue-700 from-pink-600">YOUR PLAYLISTS</p></div>
            <div className="mt-5 select-none cursor-pointer flex items-center w-52 rounded-full bg-white">
                <IoIosAddCircle size={"15%"} />
                <p className="text-xl ml-3">Add a Playlist</p>
            </div>

            <div className="w-full mt-4 flex justify-start">
                <div className="text-white pt-2 w-40 h-60 bg-neutral-900 rounded-lg">
                    <div className="w-[90%] mx-auto rounded-lg overflow-hidden">
                        <img src="https://upload.wikimedia.org/wikipedia/en/b/ba/Blue_JB.jpg" alt="" />
                    </div>
                    <div className="mx-2">
                        <p className="hover:underline select-none cursor-pointer transition-all">Jonas Blue Songs</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
