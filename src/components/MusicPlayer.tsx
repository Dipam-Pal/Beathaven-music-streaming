// "use client";

// import Image from "next/image";
// import { useContext, useEffect, useRef, useState } from "react";
// import {
//   IoMdPause,
//   IoMdPlay,
//   IoMdSkipBackward,
//   IoMdSkipForward,
//   IoMdVolumeHigh,
//   IoMdVolumeOff,
// } from "react-icons/io";
// import { LuRepeat, LuRepeat1 } from "react-icons/lu";
// import { MdOutlineQueueMusic } from "react-icons/md";
// import { PlayerContext } from "../../layouts/FrontendLayout";

// export default function MusicPlayer() {
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [volume, setVolume] = useState(50);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState<number>(0);
//   const [previousVolume, setPreviousVolume] = useState(50);
//   const [repeatSong, setRepeatSong] = useState(false);

//   const context = useContext(PlayerContext);

//   if (!context) {
//     throw new Error("player context must be within a provider");
//   }

//   const {
//     isQueueModalOpen,
//     setQueueModalOpen,
//     currentMusic,
//     playNext,
//     playPrev,
//   } = context;

//   const togglePlayButton = () => {
//     if (!audioRef.current) return;
//     if (isPlaying) {
//       audioRef.current.pause();
//     } else {
//       audioRef.current.play();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const updateTime = () => {
//       setCurrentTime(audio.currentTime);
//       setDuration(audio.duration || 0);
//     };
//     audio.addEventListener("timeupdate", updateTime);
//     audio.addEventListener("loadedmetadata", updateTime);

//     return () => {
//       audio.removeEventListener("timeupdate", updateTime);
//       audio.removeEventListener("loadedmetadata", updateTime);
//     };
//   }, []);

//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.volume = volume / 100;
//     }
//   }, [volume]);

//   useEffect(() => {
//     const audio = audioRef.current;

//     if (!audio || !currentMusic) return;

//     const playAudio = async () => {
//       try {
//         await audio.play();
//         setIsPlaying(true);
//       } catch (error) {
//         console.log("Audioplay Error:", error);
//         setIsPlaying(false);
//       }
//     };
//     playAudio();
//   }, [currentMusic]);

//   //this would listen for when a song ends
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const handleEnded = () => {
//       if (repeatSong) {
//         audio.currentTime = 0;
//         audio.play();
//       } else {
//         playNext();
//       }
//     };

//     audio.addEventListener("ended", handleEnded);

//     return () => {
//       audio.removeEventListener("ended", handleEnded);
//     };
//   }, [repeatSong, playNext]);

//   if (!currentMusic) return null;
//   const formatTime = (time: number) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60)
//       .toString()
//       .padStart(2, "0");
//     return `${minutes}:${seconds}`;
//   };

//   const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newTime = parseFloat(e.target.value);
//     if (audioRef.current) {
//       audioRef.current.currentTime = newTime;
//       setCurrentTime(newTime);
//     }
//   };

//   const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const vol = parseInt(e.target.value);
//     setVolume(vol);
//     if (audioRef.current) {
//       audioRef.current.volume = vol / 100;
//     }
//   };

//   const toggleMute = () => {
//     if (volume === 0) {
//       setVolume(previousVolume);
//       if (audioRef.current) {
//         audioRef.current.volume = previousVolume / 100;
//       }
//     } else {
//       setPreviousVolume(volume);
//       setVolume(0);
//       if (audioRef.current) {
//         audioRef.current.volume = 0;
//       }
//     }
//   };

//   return (
//     <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-black via-zinc-900 to-black text-white px-4 sm:px-6 py-3 shadow-md z-50 border-t border-zinc-800">
//       <audio src={currentMusic.audio_url || ""} ref={audioRef}></audio>

//       {/* --- Wrapper: flex row on desktop, flex col on mobile --- */}
//       <div className="max-w-8xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
//         {/* LEFT: Song Info */}
//         <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
//           <Image
//             src={currentMusic.cover_image_url || ""}
//             alt="cover-image"
//             width={500}
//             height={500}
//             className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md shadow-md"
//             priority
//           />
//           <div>
//             <p className="text-white font-medium text-sm sm:text-base">
//               {currentMusic.title}
//             </p>
//             <p className="text-gray-400 font-normal text-xs sm:text-sm">
//               {currentMusic.artist}
//             </p>
//           </div>
//         </div>

//         {/* MIDDLE: Controls */}
//         <div className="w-full sm:max-w-[400px] flex flex-col items-center gap-2 sm:gap-3">
//           {/* Buttons */}
//           <div className="flex gap-4 sm:gap-6 items-center">
//             <button
//               className="text-xl sm:text-2xl text-gray-400 hover:text-white transition"
//               onClick={playPrev}
//             >
//               <IoMdSkipBackward />
//             </button>
//             <button
//               className="bg-white text-xl sm:text-2xl text-black w-10 h-10 sm:w-12 sm:h-12 rounded-full grid place-items-center shadow-lg hover:scale-105 transition"
//               onClick={togglePlayButton}
//             >
//               {isPlaying ? <IoMdPause /> : <IoMdPlay />}
//             </button>
//             <button
//               className="text-xl sm:text-2xl text-gray-400 hover:text-white transition"
//               onClick={playNext}
//             >
//               <IoMdSkipForward />
//             </button>
//           </div>

//           {/* Progress Bar */}
//           <div className="w-full flex justify-center items-center gap-1 sm:gap-2 text-xs sm:text-sm">
//             <span className="text-gray-400">{formatTime(currentTime)}</span>
//             <input
//               onChange={handleSeek}
//               type="range"
//               min="0"
//               max={duration}
//               value={currentTime}
//               className="w-full h-1 bg-zinc-700 rounded-md accent-white cursor-pointer"
//             />
//             <span className="text-gray-400">{formatTime(duration)}</span>
//           </div>
//         </div>

//         {/* RIGHT: Controls */}
//         <div className="flex items-center gap-3 sm:gap-4">
//           {repeatSong ?  <button className="hover:text-white text-gray-400 transition" onClick={()=> setRepeatSong(false)}>
//             <LuRepeat1 />
//           </button> :  <button className="hover:text-white text-gray-400 transition" onClick={()=> setRepeatSong(true)}>
//             <LuRepeat />
//           </button>}
         
//           <button
//             className="text-gray-400 text-lg sm:text-xl cursor-pointer hover:text-white transition"
//             onClick={() => setQueueModalOpen(!isQueueModalOpen)}
//           >
//             <MdOutlineQueueMusic />
//           </button>

//           <button
//             className="text-gray-400 text-lg sm:text-xl cursor-pointer hover:text-white transition"
//             onClick={toggleMute}
//           >
//             {volume === 0 ? <IoMdVolumeOff /> : <IoMdVolumeHigh />}
//           </button>
//           <input
//             onChange={handleVolumeChange}
//             value={volume}
//             type="range"
//             min="0"
//             max="100"
//             className="w-[70px] sm:w-[100px] h-1 bg-zinc-700 accent-white rounded-md cursor-pointer"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import {
  IoMdPause,
  IoMdPlay,
  IoMdSkipBackward,
  IoMdSkipForward,
  IoMdVolumeHigh,
  IoMdVolumeOff,
} from "react-icons/io";
import { LuRepeat, LuRepeat1 } from "react-icons/lu";
import { MdOutlineQueueMusic } from "react-icons/md";
import { PlayerContext } from "../../layouts/FrontendLayout";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(0);
  const [previousVolume, setPreviousVolume] = useState(50);
  const [repeatSong, setRepeatSong] = useState(false);

  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("player context must be within a provider");
  }

  const {
    isQueueModalOpen,
    setQueueModalOpen,
    currentMusic,
    playNext,
    playPrev,
  } = context;

  const togglePlayButton = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentMusic) return;

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.log("Audioplay Error:", error);
        setIsPlaying(false);
      }
    };
    playAudio();
  }, [currentMusic]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatSong) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [repeatSong, playNext]);

  if (!currentMusic) return null;
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseInt(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol / 100;
    }
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(previousVolume);
      if (audioRef.current) {
        audioRef.current.volume = previousVolume / 100;
      }
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/60 backdrop-blur-md text-white px-4 sm:px-6 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.6)] z-50 border-t border-purple-500/20">
      <audio src={currentMusic.audio_url || ""} ref={audioRef}></audio>

      <div className="max-w-8xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        {/* LEFT: Song Info */}
        <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
          <Image
            src={currentMusic.cover_image_url || ""}
            alt="cover-image"
            width={500}
            height={500}
            className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md shadow-lg"
            priority
          />
          <div>
            <p className="font-medium text-sm sm:text-base bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              {currentMusic.title}
            </p>
            <p className="text-gray-400 font-normal text-xs sm:text-sm">
              {currentMusic.artist}
            </p>
          </div>
        </div>

        {/* MIDDLE: Controls */}
        <div className="w-full sm:max-w-[400px] flex flex-col items-center gap-2 sm:gap-3">
          <div className="flex gap-4 sm:gap-6 items-center">
            <button
              className="text-xl sm:text-2xl text-gray-400 hover:text-purple-400 transition"
              onClick={playPrev}
            >
              <IoMdSkipBackward />
            </button>
            <button
              className={`${
                isPlaying
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"
                  : "bg-white text-black"
              } text-xl sm:text-2xl w-10 h-10 sm:w-12 sm:h-12 rounded-full grid place-items-center shadow-lg hover:scale-110 transition`}
              onClick={togglePlayButton}
            >
              {isPlaying ? <IoMdPause /> : <IoMdPlay />}
            </button>
            <button
              className="text-xl sm:text-2xl text-gray-400 hover:text-purple-400 transition"
              onClick={playNext}
            >
              <IoMdSkipForward />
            </button>
          </div>

          <div className="w-full flex justify-center items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <span className="text-gray-400">{formatTime(currentTime)}</span>
            <input
              onChange={handleSeek}
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              className="w-full h-1 rounded-md accent-purple-500 cursor-pointer bg-zinc-700"
            />
            <span className="text-gray-400">{formatTime(duration)}</span>
          </div>
        </div>

        {/* RIGHT: Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {repeatSong ? (
            <button
              className="text-purple-400 hover:text-purple-500 transition"
              onClick={() => setRepeatSong(false)}
            >
              <LuRepeat1 />
            </button>
          ) : (
            <button
              className="text-gray-400 hover:text-purple-400 transition"
              onClick={() => setRepeatSong(true)}
            >
              <LuRepeat />
            </button>
          )}

          <button
            className="text-gray-400 text-lg sm:text-xl cursor-pointer hover:text-purple-400 transition"
            onClick={() => setQueueModalOpen(!isQueueModalOpen)}
          >
            <MdOutlineQueueMusic />
          </button>

          <button
            className="text-gray-400 text-lg sm:text-xl cursor-pointer hover:text-purple-400 transition"
            onClick={toggleMute}
          >
            {volume === 0 ? <IoMdVolumeOff /> : <IoMdVolumeHigh />}
          </button>
          <input
            onChange={handleVolumeChange}
            value={volume}
            type="range"
            min="0"
            max="100"
            className="w-[70px] sm:w-[100px] h-1 rounded-md accent-purple-500 cursor-pointer bg-zinc-700"
          />
        </div>
      </div>
    </div>
  );
}
