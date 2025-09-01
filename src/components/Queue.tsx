"use client";

import Image from "next/image";
import React, { useContext } from "react";
import { PlayerContext } from "../../layouts/FrontendLayout";
import { Song } from "../../types/song";

export default function Queue() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("player context must be within a provider");
  }

  const {
    isQueueModalOpen,
    currentMusic,
    currentIndex,
    queue,
    setCurrentIndex,
    setQueue,
  } = context;

  const startPlayingSong = (songs: Song[], index: number) => {
    setCurrentIndex(index);
    setQueue(songs);
  };

  if (!isQueueModalOpen) return null;
  return (
    <div
      className="
        fixed z-40
        max-w-[300px] w-full h-[70vh]
        bg-gradient-to-b from-black via-gray-900 to-black
        border border-gray-700 p-4 overflow-y-auto rounded-lg shadow-lg
        scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent

        bottom-24 right-6   /*  place above player, not navbar */
        sm:bottom-24 sm:right-6
        max-sm:bottom-28 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:w-[90%] max-sm:h-[60vh]
      "
    >
      <h2 className="text-xl font-bold text-white">Queue</h2>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-white mb-3">Now Playing</h2>
        <div className="flex items-center gap-2 cursor-pointer mb-2 p-2 rounded-lg hover:bg-gray-800/60 transition">
          {currentMusic && (
            <Image
              src={currentMusic?.cover_image_url || "/fallback.png"}
              width={300}
              height={300}
              alt="queue-image"
              className="w-10 h-10 object-cover rounded-md"
              priority
            />
          )}

          <div>
            <p className="text-primary font-semibold">{currentMusic?.title}</p>
            <p className="text-sm text-gray-400">{currentMusic?.artist}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-white mb-3">Queue List</h2>
        {queue.map((song: Song, index) => {
          return (
            <div
              key={song.id}
              onClick={() => startPlayingSong(queue, index)}
              className="flex items-center gap-2 cursor-pointer mb-2 p-2 rounded-lg hover:bg-gray-800/60 transition"
            >
              <Image
                src={song.cover_image_url}
                width={300}
                height={300}
                alt="queue-image"
                className="w-10 h-10 object-cover rounded-md"
              />
              <div>
                <p
                  className={`font-semibold ${
                    currentIndex === index
                      ? "text-primary"
                      : "text-primary-text"
                  }`}
                >
                  {song.title}
                </p>
                <p className="text-sm text-gray-400">{song.artist}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
