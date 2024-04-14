let audioPlayer

const usePlayer = () => {
    const set = (audio) => {
        audioPlayer = audio
    }

    return [audioPlayer, set]
}

export default usePlayer