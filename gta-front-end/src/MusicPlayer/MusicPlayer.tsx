import style from "./player.module.scss";
import { useEffect, useState } from "react";
import gtaTrailerSong from "../../sounds/loveIsALongRoad.mp3";
import {
  FaGooglePlay,
  FaPause,
  FaMusic,
  FaVolumeUp,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";
import posterSongTrailer from "../../assets/loveIsALongRoadGTA.jpg";

export const MusicPlayer = () => {
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
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPlayer(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className={style.music_player_wrapper}>
      <button
        className={style.toggle_player_button}
        onClick={() => setShowPlayer(!showPlayer)}
      >
        {!showPlayer && (
          <span onClick={() => setShowPlayer(!showPlayer)}>
            Show Player {<FaArrowDown />}
          </span>
        )}
      </button>
      {showPlayer && (
        <div className={`${style.music_player_popup} ${style.animate_popup}`}>
          <div
            className={style.hide_player}
            onClick={() => setShowPlayer(!showPlayer)}
          >
            <span>Hide player</span>
            <FaArrowUp />
          </div>
          <div className={style.poster_song}>
            <img src={posterSongTrailer} alt="Poster Love Is A Long Road" />
          </div>
          <div className={style.player_controls}>
            <button onClick={togglePlay}>
              {isPlaying ? <FaPause /> : <FaGooglePlay />}
            </button>
            <section>
              <FaMusic />
              <input
                type="range"
                min="0"
                max={music.duration.toString()}
                step="0.01"
                value={currentTime}
                onChange={handleTimeChange}
              />
            </section>

            <div className={style.info_text}>{formatTime(currentTime)}</div>
            <section>
              <FaVolumeUp />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
              />
            </section>

            <div className={style.info_text}>
              Volume: {Math.round(volume * 100)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
