import { createContext, ReactNode, useContext, useState } from 'react';

type PlayerEpisode = {
  title: string,
  members: string,
  thumbnail: string,
  duration: number,
  url: string,
}
type PlayerContextData = {
  episodeList: PlayerEpisode[],
  currentEpisodeIndex: number,
  isPlaying: Boolean,
  play: (episode : PlayerEpisode) => void
  togglePlay: () => void,
  setIsPlayingState: (state: boolean) => void,
  playList: (episode: PlayerEpisode[], index: number) => void,
  playNext: () => void,
  playPrevious: () => void,
  hasNext: boolean,
  hasPrevious: boolean,
  isLooping: boolean,
  toggleLoop: () => void,
  toggleShuffle: () => void,
  isShuffling: boolean,
  clearPlayerState: () => void,
  progress: number,
  changeProgressValue: (value: number) => void,
}

type PlayerContextProviderProps = {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData);

export default function PlayerContextProvider({ children } : PlayerContextProviderProps){
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [progress, setProgress] = useState(0);
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;
  const hasPrevious =  currentEpisodeIndex > 0;

  function play(episode: PlayerEpisode){
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(episodes: PlayerEpisode[], index: number){
    setEpisodeList(episodes);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function changeProgressValue(value: number){
    setProgress(value);
  }

  function togglePlay(){
    setIsPlaying(!isPlaying);
  }

  function toggleLoop(){
    setIsLooping(!isLooping);
  }

  function toggleShuffle(){
    setIsShuffling(!isShuffling);
  }
  function playNext(){
    if(isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);

    }
    else if(hasNext){
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }
  function playPrevious(){
    if(hasPrevious){
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  function setIsPlayingState(state: boolean){
    setIsPlaying(state);
  }

  function clearPlayerState(){
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
    changeProgressValue(0);
  }
  return(
    <PlayerContext.Provider 
      value={{
          episodeList,
          currentEpisodeIndex,
          play, 
          isPlaying, 
          togglePlay, 
          setIsPlayingState,
          playList,
          playNext,
          playPrevious,
          hasNext,
          hasPrevious,
          toggleLoop,
          isLooping,
          toggleShuffle,
          isShuffling,
          clearPlayerState,
          progress,
          changeProgressValue
      }}>
      {children} 
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext)