import Image from 'next/image';
import { useContext, useRef, useEffect, useState } from 'react';
import { PlayerContext, PlayerContextProvider } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
    const { episodeList, currentEpisodeIndex, isPlaying,
        togglePlay, playList,
        playNext, playPrevious,
        toggleLoop, isLooping,
        toggleShuffle, isShuffling } = useContext(PlayerContext);

    const episode = episodeList[currentEpisodeIndex];
    const playing = useContext(PlayerContext);

    const audioRef = useRef<HTMLAudioElement>(null);

    const [progress, setProgress] = useState(0);

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', event => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnder() {
        if ((currentEpisodeIndex + 1) < episodeList.length || isShuffling) {
            playNext()
        }
    }

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])

    return (
        <div className={styles.playerContainer}>

            <header>
                <img src="/playing.svg" alt="playingNow" />
                <strong>Playing Now</strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Select a podcast</strong>
                </div>
            )
            }

            <footer className={!episode ? styles.empty : ''}>
                {episode ? (
                    <div className={styles.progress}>
                        <span>{convertDurationToTimeString(progress)}</span>
                        <div className={styles.slider}>
                            {episode ? (
                                <Slider max={episode.duration} value={progress}
                                    onChange={handleSeek}
                                    trackStyle={{ backgroundColor: '#04d3611' }}
                                    railStyle={{ backgroundColor: '#9f75ff' }} />
                            ) : (
                                <div className={styles.emptySlider} />
                            )}
                        </div>
                        <span>{episode.durationAsString}</span>
                    </div>)
                    : (
                        <div className={styles.progress}>
                            <span>00:00</span>
                            <div className={styles.slider}>
                                {episode ? (
                                    <Slider trackStyle={{ backgroundColor: '#04d3611' }}
                                        railStyle={{ backgroundColor: '#9f75ff' }} />
                                ) : (
                                    <div className={styles.emptySlider} />
                                )}
                            </div>
                            <span>00:00</span>
                        </div>
                    )}

                {episode && (
                    <audio src={episode.url}
                        autoPlay ref={audioRef}
                        loop={isLooping}
                        onLoadedMetadata={setupProgressListener}
                        onEnded={handleEpisodeEnder} />
                )}



                <div className={styles.buttons}>
                    <button type="button" onClick={toggleShuffle} className={isShuffling ? styles.isActive : ''}>
                        <img src="/shuffle.svg" alt="embaralhar" />
                    </button>
                    <button type="button">
                        <img src="/play-previous.svg" alt="tocar_anterior" onClick={playPrevious} />
                    </button>
                    <button type="button" onClick={togglePlay}>
                        {isPlaying
                            ? <img src="/pause.svg" alt="tocar" className={styles.playButton} />
                            : <img src="/play.svg" alt="tocar_proximo" className={styles.playButton} />}
                    </button>
                    <button type="button">
                        <img src="/play-next.svg" alt="tocar_proximo" onClick={playNext} />
                    </button>
                    <button type="button" onClick={toggleLoop} className={isLooping ? styles.isActive : ''}>
                        <img src="/repeat.svg" alt="repetir" />
                    </button>
                </div>
            </footer>
        </div >
    );
}