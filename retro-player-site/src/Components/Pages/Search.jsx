import React, { useEffect, useState } from 'react'
import SearchItems from './SearchItems/SearchItems'
import { default as axios } from "axios"
import usePlayer from '../../Hooks/player'
import "../../index.css"

export default function Search({ info }) {
  const [text, setNext] = useState("")
  const [main, setMain] = useState(<></>)
  const [sub, setSub] = useState([])
  const [recommanded, setRecommanded] = useState()
  const [audioPlayer] = usePlayer()
  const [, setSongInfo] = info

  useEffect(() => {
    const delayId = setTimeout(() => {
      if (!text) return

      axios.get(`http://localhost:7123/search/${text.replace(/\s/g, "+")}`).then(returnData => {
        const { data } = returnData

        const tracks = data.tracks

        const main = tracks.splice(0, 1)[0]

        const ytID = main.url.split("track/")[1]

        axios.get(`http://localhost:7123/recommanded/${ytID}`).then((val) => {
          const element = val.data.tracks.splice(0, 12).map((val) => {
            const JSXElement = (
              <div className="flex justify-center items-center cursor-pointer" onClick={async () => {
                const id = `${val.author} - ${val.name}`

                const source = await axios.get('http://localhost:7123/beta/stream/'+id)

                audioPlayer.src = source.data.raw

                audioPlayer.play()

                setSongInfo({
                  name: val.name,
                  author: val.author,
                  picture: val.picture,
                  url: val.url
                })
              }}>
                <div className="mt-4 flex justify-start">
                  <div className="text-white pt-2 m-4 w-40 h-60 hover:bg-neutral-800 transition-all bg-neutral-900 rounded-lg">
                    <div className="w-[90%] mx-auto flex justify-center items-center overflow-hidden">
                      <img src={val.picture} alt="" className="object-cover w-32 h-32 rounded-lg" />
                    </div>
                    <div className="mx-3 mt-3">
                      <p className="hover:underline select-none cursor-pointer transition-all">{val.name}</p>
                      <p className="text-sm text-neutral-500">{val.author}</p>
                    </div>
                  </div>
                </div>
              </div>)

            return JSXElement
          })

          setMain(
            <div className="w-[40%] group h-72 mx-3 cursor-pointer hover:bg-neutral-800 transition-all bg-neutral-900 rounded-lg" onClick={async () => {
              const id = `${main.author} - ${main.name}`

              const source = await axios.get('http://localhost:7123/beta/stream/'+id)

              audioPlayer.src = source.data.raw

              audioPlayer.play()

              setSongInfo({
                name: main.name,
                author: main.author,
                picture: main.picture,
                url: main.url
              })
            }}>
              <div className="p-5 flex">
                <img draggable={false} src={main.picture} alt="" className="h-32 w-32 rounded-full object-cover" />
              </div>
              <div className="ml-7">
                <p className="text-white text-3xl">{main.name}</p>
                <p className="text-gray-400">{main.author}</p>
              </div>
            </div>
          )

          setSub(
            tracks.map((val) => {
              return <SearchItems imageSource={val.picture} songName={val.name} author={val.author} info={setSongInfo} url={val.url} />
            })
          )

          setRecommanded(element)
        })
      })
    }, 3000)

    return () => clearTimeout(delayId)
  }, [text])

  return (
    <div className="h-[90vh] right-0 w-[80vw] pt-5 fixed overflow-auto">
      <div className="flex w-full pl-28">
        <input type="text" name="" id="" className="rounded-full px-4 w-80 h-7 focus:outline-none" placeholder='Search for anything!' onChange={(e) => setNext(e.target.value)} />
      </div>

      <div className="w-full flex justify-center pt-5 select-none">
        {main}
        <div className="w-[50%] mx-3 h-72">
          {sub}
        </div>
      </div>

      {Array.isArray(recommanded) ? <p className="text-white text-5xl ml-10 mt-10 font-extrabold">Related Tracks</p> : <></>}

      <div className="flex justify-center flex-wrap flex-row">
        {recommanded}
      </div>
    </div>
  )
}
