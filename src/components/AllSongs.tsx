// "use client";

// import Image from "next/image";
// import { IoMdPlay } from "react-icons/io";
// import supabase from "../../api/SupabaseClient";
// import { useQuery } from "@tanstack/react-query";
// import { Song } from "../../types/song";
// import { PlayerContext } from "../../layouts/FrontendLayout";
// import { useContext } from "react";

// export default function AllSongs() {
//   const context = useContext(PlayerContext);
//   if (!context) {
//     throw new Error("PlayerContext must be used within a PlayerProvider");
//   }

//   const { setQueue, setCurrentIndex } = context;
//   const getAllSongs = async () => {
//     const { data, error } = await supabase.from("songs").select("*");

//     if (error) {
//       console.log("fetchAllSongsError:", error.message);
//     }
//     return data;
//   };
//   const {
//     data: songs,
//     isLoading,
//     error,
//     isError,
//   } = useQuery({
//     queryFn: getAllSongs,
//     queryKey: ["allSongs"],
//   });

//   const startPlayingSong = (songs: Song[], index: number) => {
//     setCurrentIndex(index);
//     setQueue(songs);
//   };

//   if (isLoading)
//     return (
//       <div className="min-h-[90vh] bg-gradient-to-br from-black via-purple-950 to-indigo-900 my-15 p-4 lg:ml-80 rounded-lg mx-4">
//         <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent mb-4">
//           New Songs
//         </h2>
//         <div className="animate-pulse  grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
//            {[...Array(10)].map((i, index) => (
//           <div key={index}>
//             <div className="w-full h-50 rounded-md mb-2 bg-hover"></div>
//             <div className="h-3 w-[80%] bg-hover rounded-md"></div>
//           </div>
//            ))}
//         </div>
//       </div>
//     );
//   if (isError)
//     return (
//       <div className="min-h-[90vh] bg-gradient-to-br from-black via-purple-950 to-indigo-900 my-15 p-4 lg:ml-80 rounded-lg mx-4">
//         <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent mb-4">
//           New Songs
//         </h2>
//         <h2 className="text-center text-white text-2xl">
//           {(error as Error).message}
//         </h2>
//       </div>
//     );
//   return (
//     <div className="min-h-[90vh] bg-gradient-to-br from-black via-purple-950 to-indigo-900 my-15 p-4 lg:ml-80 rounded-lg mx-4">
//       <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent mb-4">
//         New Songs
//       </h2>

//       <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
//         {songs?.map((song: Song, index) => {
//           return (
//             <div
//               className="relative bg-black/40 p-2 rounded-lg hover:scale-105 transition group"
//               key={song.id}
//               onClick={() => startPlayingSong(songs, index)}
//             >
//               <button className="bg-primary w-12 h-12 rounded-full grid place-items-center absolute bottom-8 opacity-0 right-5 group-hover:opacity-100 group-hover:bottom-16 transition-all duration-300 ease-in-out cursor-pointer">
//                 <IoMdPlay />
//               </button>
//               <Image
//                 src={song.cover_image_url}
//                 alt="cover-image"
//                 width={500}
//                 height={500}
//                 className="w-full h-48 object-cover rounded-md"
//               />
//               <div className="mt-2">
//                 <p className="text-white font-semibold">{song.title}</p>
//                 <p className="text-sm text-gray-300">By {song.artist}</p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import { IoMdPlay } from "react-icons/io";
import { GoSearch } from "react-icons/go";
import supabase from "../../api/SupabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Song } from "../../types/song";
import { PlayerContext } from "../../layouts/FrontendLayout";
import { useContext, useState, useMemo } from "react";

export default function AllSongs() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("PlayerContext must be used within a PlayerProvider");
  }

  const { setQueue, setCurrentIndex } = context;
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("title_asc");

  const getAllSongs = async () => {
    const { data, error } = await supabase.from("songs").select("*");

    if (error) {
      console.log("fetchAllSongsError:", error.message);
    }
    return data;
  };

  const {
    data: songs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: getAllSongs,
    queryKey: ["allSongs"],
  });

  const filteredAndSortedSongs = useMemo(() => {
    if (!songs) return [];

    // Filtering logic
    const filtered = songs.filter(
      (song: Song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sorting logic
    return filtered.sort((a, b) => {
      if (sortOption === "title_asc") {
        return a.title.localeCompare(b.title);
      } else if (sortOption === "title_desc") {
        return b.title.localeCompare(a.title);
      } else if (sortOption === "artist_asc") {
        return a.artist.localeCompare(b.artist);
      } else if (sortOption === "artist_desc") {
        return b.artist.localeCompare(a.artist);
      }
      return 0;
    });
  }, [songs, searchQuery, sortOption]);

  const startPlayingSong = (songs: Song[], index: number) => {
    setCurrentIndex(index);
    setQueue(songs);
  };

  if (isLoading)
    return (
      <div className="min-h-[90vh] bg-gradient-to-br from-black via-purple-950 to-indigo-900 my-15 p-4 lg:ml-80 rounded-lg mx-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent mb-4">
          New Songs
        </h2>
        <div className="animate-pulse grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(10)].map((i, index) => (
            <div key={index}>
              <div className="w-full h-50 rounded-md mb-2 bg-hover"></div>
              <div className="h-3 w-[80%] bg-hover rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  if (isError)
    return (
      <div className="min-h-[90vh] bg-gradient-to-br from-black via-purple-950 to-indigo-900 my-15 p-4 lg:ml-80 rounded-lg mx-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent mb-4">
          New Songs
        </h2>
        <h2 className="text-center text-white text-2xl">
          {(error as Error).message}
        </h2>
      </div>
    );

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-black via-purple-950 to-indigo-900 my-15 p-4 lg:ml-80 rounded-lg mx-4">
      {/* Title Section */}
      <h2 className="text-4xl font-extrabold mb-8 text-white tracking-wide">
        New Songs
      </h2>

      {/* Search and Sort Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 p-4 bg-zinc-900/60 rounded-xl border border-zinc-700">
        <div className="flex-1 w-full flex items-center h-12 px-4 gap-2 bg-zinc-800/70 border border-zinc-700 text-primary-text rounded-full focus-within:ring-2 focus-within:ring-purple-500 transition duration-300">
          <GoSearch className="text-gray-400 shrink-0" size={20} />
          <input
            className="flex-1 h-full bg-transparent outline-none placeholder:text-gray-500 text-white text-base"
            type="text"
            placeholder="Search by artist or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-auto">
          <select
            className="h-12 w-full bg-zinc-800/70 border border-zinc-700 text-white rounded-full px-4 text-base outline-none cursor-pointer transition duration-300 hover:border-purple-500"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
            <option value="artist_asc">Artist (A-Z)</option>
            <option value="artist_desc">Artist (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredAndSortedSongs?.map((song: Song, index) => {
          return (
            <div
              className="relative bg-black/40 p-3 rounded-lg hover:scale-105 transition-transform duration-300 group shadow-lg cursor-pointer"
              key={song.id}
              onClick={() => startPlayingSong(filteredAndSortedSongs, index)}
            >
              <button className="bg-purple-600/90 w-14 h-14 rounded-full grid place-items-center absolute bottom-8 opacity-0 right-5 group-hover:opacity-100 group-hover:bottom-16 transition-all duration-300 ease-in-out cursor-pointer text-white text-3xl shadow-xl">
                <IoMdPlay />
              </button>
              <Image
                src={song.cover_image_url}
                alt="cover-image"
                width={500}
                height={500}
                className="w-full h-48 object-cover rounded-md shadow-md"
              />
              <div className="mt-3">
                <p className="text-white font-semibold text-lg">{song.title}</p>
                <p className="text-sm text-gray-400">By {song.artist}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


