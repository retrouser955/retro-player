import "./index.css"
import Navigation from "./Components/Navigation"
import Player from "./Components/Player"
import { useEffect, useState } from "react"
import Navigator from "./Components/Navigator"
import { useRef } from "react"
import usePlayer from "./Hooks/player"
import { default as axios } from "axios"

function App() {
  const [page, setPage] = useState(1)
  const player = useRef()
  const [_, setAudio] = usePlayer()
  const [progress, setProgress] = useState()
  const [paused, setPaused] = useState(true)
  const [songInfo, setSongInfo] = useState({})
  const song = useRef({})

  useEffect(() => {
    if(Object.keys(songInfo).length === 0) return

    console.log(songInfo)

    const { name, author, picture } = songInfo

    song.current = songInfo

    axios.post(`http://localhost:7123/discord/rpc`, {
      track: {
        name,
        image: picture
      },
      artist: {
        name: author
      }
    })
  }, [songInfo])

  useEffect(() => {
    setAudio(player.current)

    player.current.volume = 0.5

    function audioPause() {
      setPaused(true)
    }

    player.current.addEventListener("pause", audioPause)

    function audioPlay() {
      setPaused(false)
    }

    player.current.addEventListener("play", audioPlay)

    async function audioEnd() {
      console.log(song.current)

      if(Object.keys(song.current).length === 0) return

      const id = song.current.url.split("track/")[1]

      const url = `http://localhost:7123/recommanded/${id}`

      console.log("URL PASSED " + url)

      const { data } = await axios.get(url)

      console.log(data)

      const id2 = `${data.tracks[0].author} - ${data.tracks[0].name}`

      const sourceURL = await axios.get(`http://localhost:7123/beta/stream/${id2}`)

      player.current.src = `${sourceURL.data.raw}`

      player.current.play()

      setSongInfo({
        name: data.tracks[0].name,
        author: data.tracks[0].author,
        picture: data.tracks[0].picture,
        url: data.tracks[0].url
      })

      player.current.volume = window.volume ?? 0.5
    }

    player.current.addEventListener("ended", audioEnd)

    return () => {
      if(player.current) {
        player.current.removeEventListener("ended", audioEnd)
        player.current.removeEventListener("play", audioPlay)
        player.current.removeEventListener("pause", audioPause)
      }
    }
  }, [])

  return (
    <div className="App">
      <audio controls={false} ref={player} onTimeUpdate={(event) => {
        const { duration, currentTime } = event.target

        const percent = (currentTime / duration) * 100

        setProgress(percent)
      }}></audio>
      <Navigation set={setPage} index={page} info={[songInfo, setSongInfo]} />
      <Navigator index={page} info={[songInfo, setSongInfo]} />
      <Player progress={progress} status={[paused, setPaused]} info={[songInfo, setSongInfo]} />
    </div>
  )
}

export default App
