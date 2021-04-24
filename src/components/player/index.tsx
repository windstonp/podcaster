import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { usePlayer } from '../../contexts/player-context';
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player(){
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    episodeList, 
    currentEpisodeIndex, 
    isPlaying,
    togglePlay,
    setIsPlayingState,
    playNext,
    hasNext,
    playPrevious,
    hasPrevious,
    isLooping,
    toggleLoop,
    toggleShuffle,
    isShuffling,
    clearPlayerState,
    changeProgressValue,
    progress
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

  useEffect(()=>{
    if(!audioRef.current){
      return;
    }
    if(isPlaying){
      audioRef.current.play();
    }else{
      audioRef.current.pause();
    }
  }, [isPlaying])

  function setUpProgressListener(){
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener('timeupdate',() => {
      changeProgressValue(Math.floor(audioRef.current.currentTime));
    });
  }
  
  function handlerSeek(duration: number){
    audioRef.current.currentTime = duration;
    changeProgressValue(duration);
  }

  function handlePodcastEnded(){
    if(hasNext){
      playNext()
    }else{
      clearPlayerState()
    }
  }

  return(
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora</strong>
      </header>
      { (episode) ? (
        <div className={styles.playingEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      ) }
      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progressBar}>
        <span>{convertDurationToTimeString( progress )}</span>
          <div className={styles.slider} >
            {episode ? (
              <Slider
                trackStyle={{backgroundColor: '#04D361'}}
                railStyle={{backgroundColor: '#9F75FF'}}
                handleStyle={{backgroundColor: '#04D361', borderWidth: 4}}
                max={episode.duration}
                value={progress}
                onChange={handlerSeek}
              />
            ) : (
              <div className={styles.emptySlider}/>
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>
        { episode && (
          <audio 
            src={episode.url}
            ref={audioRef}
            autoPlay
            onPlay={() => setIsPlayingState(true)}
            onPause={() => setIsPlayingState(false)}
            loop={isLooping}
            onLoadedMetadata={setUpProgressListener}
            onEnded={handlePodcastEnded}
          />
        )}
        <div className={styles.buttons}>
          <button type="button" 
            disabled={!episode || episodeList.length === 1}  
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button"  
            disabled={!episode || !hasPrevious} 
            onClick={playPrevious}
          >
            <img src="/play-previous.svg" alt="Voltar" />
          </button>
          <button type="button" 
            className={styles.playButton}  
            disabled={!episode} 
            onClick={togglePlay}
          >
            { isPlaying ? (
              <img src="/pause.svg" alt="Tocar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>
          <button type="button"  
            disabled={!episode || !hasNext} 
            onClick={playNext}
          >
            <img src="/play-next.svg" alt="Próximo" />
          </button>
          <button type="button"  
            disabled={!episode} 
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}