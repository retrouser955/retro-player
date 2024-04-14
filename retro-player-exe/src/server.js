const express = require('express')
const { YouTube } = require('youtube-sr')
const fs = require('fs')
const dl = require('yt-stream')
const decipher = require('yt-stream/src/stream/decipher.js')
const { Client } = require('discord-rpc')
const client = new Client({ transport: "ipc" })
const fetchSpotifyKey = require('./fetchSpotifyKey.js')

client.login({ clientId: "955818281078497320" })

let isClientReady = false

client.on("ready", () => {
    isClientReady = true
})

const app = express()

app.use(require('cors')())

app.use(require("body-parser").json())

const BASE_YOUTUBE_URL = `https://www.youtube.com/watch?v=`

async function extractVideoUrl(query) {
    const info = await dl.getInfo(query)

    info.formats = await decipher?.format_decipher(info.formats, info.html5player);

    const url = info.formats.filter((val) => val.mimeType.startsWith('audio') && val.audioQuality !== 'AUDIO_QUALITY_LOW').map((val) => val.url)

    if (url.length !== 0) return url[0]

    return info.formats.filter((val) => val.mimeType.startsWith('audio')).map((val) => val.url)[0]
}

app.post("discord/clear", async (_req, res) => {
    if(!isClientReady) return res.status(500).json({ message: "Client not ready" })

    await client.clearActivity()

    res.json({
        message: "Cleared RPC"
    })
})

app.get('/beta/stream/:name', async (req, res) => {
    const name = `${req.params.name} audio`

    const search = await YouTube.searchOne(name, "video")

    const stream = await extractVideoUrl(search.url)

    res.json({
        raw: stream
    })
})

app.get("/search/:query", async (req, res) => {
    const query = req.params.query.replace(/\+/g, " ")

    const spotifyInfo = await fetchSpotifyKey()

    const search = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&limit=6&type=track`, {
        headers: {
            "Content-Type": "Application/json",
            "Authorization": `Bearer ${spotifyInfo.accessToken}`
        }
    })

    const jsonData = await search.json()

    const tracks = jsonData.tracks.items

    const returnData = tracks.map((val) => ({
        picture: val.album.images[0].url,
        name: val.name,
        author: val.artists.map((val) => val.name).join(", "),
        url: val.external_urls.spotify
    }))

    res.json({
        tracks: returnData
    })
})

app.post("/discord/rpc", (req, res) => {
    const { track, artist } = req.body

    const { name, image } = track
    const { name: artistName } = artist

    client.setActivity({
        state: `By ${artistName ?? "Unknown Artist"}`,
        largeImageKey: image ?? "https://i.pinimg.com/originals/ab/45/bb/ab45bb4451536652faca51ae4f42d5dd.gif",
        largeImageText: "Retro Player Next",
        details: name ?? "Listening to music",
        startTimestamp: Date.now()
    })

    res.json({
        message: "RPC updated"
    })
})

app.get("/playlist/all", (req, res) => {
    const playlists = fs.readdirSync(`${__dirname}/playlists`).filter((file) => file.endsWith(".json"))

    res.json({
        playlists
    })
})

app.get("/playlist/image/:id", (req, res) => {
    const imageDir = `${__dirname}/images/${req.params.id}.png`

    if(!fs.existsSync(imageDir)) return res.send({ message: "not found" })

    res.sendFile(imageDir)
})

app.get("/recommanded/:id", async (req, res) => {
    const token = await fetchSpotifyKey()

    const data = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${req.params.id}&limit=20`, {
        headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "Application/json"
        }
    })

    const json = await data.json()

    const returnData = json.tracks.map((val) => ({
        name: val.name,
        picture: val.album.images[0].url,
        author: val.artists.map((va) => va.name).join(", "),
        url: val.external_urls.spotify
    }))

    res.json({
        tracks: returnData
    })
})

app.listen(7123, () => console.log("Listening on 7123"))