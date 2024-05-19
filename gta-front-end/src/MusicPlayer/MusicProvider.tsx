import React, { createContext, useState, useEffect } from "react";
import gtaTrailerSong from "../../sounds/loveIsALongRoad.mp3";
interface MusicContextProps {
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  showPlayer: boolean;
  music: HTMLAudioElement | null;
  togglePlay: () => void;
  handleTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatTime: (timeInSeconds: number) => void;
}
export const MusicContext = createContext<MusicContextProps>({
  isPlaying: false,
  currentTime: 0,
  volume: 0.1,
  showPlayer: false,
  music: null,
  togglePlay: () => {},
  handleTimeChange: () => {},
  handleVolumeChange: () => {},
  formatTime: () => {},
});

const MusicProvider = ({ children }: any) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const musicElement = new Audio(gtaTrailerSong);
  const [music, setMusic] = useState(musicElement);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.1);
  const [showPlayer, setShowPlayer] = useState(false);

  music.volume = volume;

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(music.currentTime);
    };

    if (isPlaying) {
      music.play();
    } else {
      music.pause();
    }

    music.addEventListener("timeupdate", updateCurrentTime);

    return () => {
      music.removeEventListener("timeupdate", updateCurrentTime);
    };
  }, [isPlaying, music]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    music.currentTime = newTime;

    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    music.volume = newVolume;
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const value = {
    isPlaying,
    currentTime,
    volume,
    showPlayer,
    music,
    togglePlay,
    handleTimeChange,
    handleVolumeChange,
    formatTime,
  };

  return (
    <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
  );
};

export { MusicProvider };
