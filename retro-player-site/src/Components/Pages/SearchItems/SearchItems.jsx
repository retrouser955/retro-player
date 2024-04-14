import React from 'react'
import { BsFillPlayFill } from "react-icons/bs"
import usePlayer from '../../../Hooks/player'
import { default as axios } from "axios"

export default function SearchItems({ songName, imageSource, author, info, url }) {
  const [audio] = usePlayer()

  return (
    <div className="h-14 rounded-lg cursor-pointer truncate group hover:bg-zinc-900 w-full transition-all bg-black flex items-center" onClick={async () => {
      const sourceID = `${songName} - ${author}`

      audio.pause()

      const source = await axios.get('http://localhost:7123/beta/stream/'+sourceID)

      audio.src = source.data.raw

      audio.play()

      info({
        name: songName,
        author,
        picture: imageSource
      })
    }}>
      <div className="h-10 w-10">
        <img draggable={false} src={imageSource} alt="" className="h-10 w-10 object-cover ml-3" />
        <div className="h-10 w-10 flex justify-center items-center bg-black translate-y-[-100%] ml-3 transition-all group-hover:opacity-50 opacity-0">
          <BsFillPlayFill color="#FFFFFF" size={30} />
        </div>
      </div>
        <div className="text-white mx-5">
            <div className="truncate"><p>{songName}</p></div>
            <p className="text-neutral-500 text-sm">{author}</p>
        </div>
    </div>
  )
}