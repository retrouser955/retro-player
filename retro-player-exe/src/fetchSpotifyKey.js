let spotifyInfo = {}

module.exports = async function fetchSpotifyKey() {
    if(spotifyInfo && Date.now() <= spotifyInfo.accessTokenExpirationTimestampMs) return spotifyInfo

    const tokenObject = await fetch("https://open.spotify.com/get_access_token?reason=transport&productType=web_player", {
        headers: {
            "Content-Type": "application/json"
        }
    })

    const content = await tokenObject.json()

    const { accessToken, clientId, accessTokenExpirationTimestampMs, isAnonymous } = content

    spotifyInfo = content

    return {
        accessToken,
        clientId,
        accessTokenExpirationTimestampMs,
        isAnonymous
    }
}