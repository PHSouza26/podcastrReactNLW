import { createContext, ReactNode, useContext, useState } from 'react';
import { Player } from '../components/Player';

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[]
    currentEpisodeIndex: number;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    isPlaying: boolean;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    toggleLoop: () => void;
    isLooping: boolean;
    toggleShuffle: () => void;
    isShuffling: boolean;
}
export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {

    const [episodeList, setEpisodeList] = useState([]);

    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);

    const [isPlaying, setIsPlaying] = useState(false);

    const [isLooping, setIsLooping] = useState(false);

    const [isShuffling, setIsShuffling] = useState(false);

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true)
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying(!isPlaying)
    }

    function toggleLoop() {
        setIsLooping(!isLooping);
    }

    function toggleShuffle() {
        setIsShuffling(!isShuffling);
    }

    function playNext() {
        const nextEpisodeIndex = currentEpisodeIndex + 1


        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        }
        else if (nextEpisodeIndex >= episodeList.length) {
            return;
            setCurrentEpisodeIndex(nextEpisodeIndex);
        }

    }

    function playPrevious() {
        if (currentEpisodeIndex > 0) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        }
    }
    return (
        <PlayerContext.Provider value={{
            episodeList,
            currentEpisodeIndex,
            play,
            playList,
            isPlaying,
            togglePlay,
            playNext,
            playPrevious,
            isLooping,
            toggleLoop,
            toggleShuffle,
            isShuffling,
        }}>
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext)
}