// import React, { useContext } from "react";
// import Image from "next/image";
// import { useQuery } from "@tanstack/react-query";
// import supabase from "../../api/SupabaseClient";
// import DeleteButton from "./DeleteButton";
// import { PlayerContext } from "../../layouts/FrontendLayout";



// type UserSongsProps = {
//   userId: string | undefined;
// };

// type Song = {
//   id: string;
//   title: string;
//   artist: string;
//   cover_image_url: string;
//   audio_url: string; 
// };

// export default function UserSongs({ userId }: UserSongsProps) {
//   const context = useContext(PlayerContext);
//   if (!context) {
//     throw new Error("PlayerContext must be used within a PlayerProvider");
//   }

//   const { setQueue, setCurrentIndex } = context;
//   const getUserSongs = async () => {
//     const { error, data } = await supabase
//       .from("songs")
//       .select("*")
//       .eq("user_id", userId);

//     if (error) {
//       console.error("Error fetching user songs:", error);
//       return [];
//     }

//     return data;
//   };

//   const {
//     data: songs,
//     isLoading,
//     error,
//     isError,
//   } = useQuery({
//     queryFn: getUserSongs,
//     queryKey: ["userSongs", userId], 
//   });

//    const startPlayingSong = (songs: Song[], index: number) => { 
//     setCurrentIndex(index);
//     setQueue(songs);
//   };

//   if (isLoading)
//     return 
//    <div>
//    {[...Array(10)].map((i, index) => (
//           <div key={index} className="flex gap-2 animate-pulse mb-4">
//             <div className="w-10 h-10 rounded-md bg-hover"></div>
//             <div className="h-5 w-[80%] rounded-md bg-hover"></div>
//           </div>
//         ))}
//    </div>
    
    
//   if (isError)
//     return (
//       <h2 className="text-center text-white text-2xl">
//         {(error as Error).message}
//       </h2>
//     );

//   return (
//     <div>
//       {songs?.map((song: Song, index) => {
//         return (
//           <div
//             className="flex gap-2 items-center cursor-pointer mb-4 p-2 rounded-lg hover:bg-hover group relative"
//             key={song.id}
//             onClick={() => startPlayingSong(songs, index)}
//           >
//             <DeleteButton
//               songId={song.id}
//               imagePath={song.cover_image_url}
//               audioPath={song.audio_url}
//             />
//             <Image
//               src={song.cover_image_url}
//               alt="cover-image"
//               width={300}
//               height={300}
//               className="w-10 h-10 object-cover rounded-md"
//             />
//             <div>
//               <p className="text-primary-text font-semibold">{song.title}</p>
//               <p className="text-secondary-text text-sm">{song.artist}</p>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }


import React, { useContext } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import supabase from "../../api/SupabaseClient";
import DeleteButton from "./DeleteButton";
import { PlayerContext } from "../../layouts/FrontendLayout";
import { Song } from "../../types/song"; // ✅ use global type

type UserSongsProps = {
  userId: string | undefined;
};

export default function UserSongs({ userId }: UserSongsProps) {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("PlayerContext must be used within a PlayerProvider");
  }

  const { setQueue, setCurrentIndex } = context;

  const getUserSongs = async () => {
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user songs:", error);
      return [];
    }

    return data as Song[];
  };

  const {
    data: songs,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryFn: getUserSongs,
    queryKey: ["userSongs", userId],
  });

  const startPlayingSong = (songs: Song[], index: number) => {
    setCurrentIndex(index);
    setQueue(songs);
  };

  if (isLoading)
    return (
      <div>
        {[...Array(10)].map((_, index) => (
          <div key={index} className="flex gap-2 animate-pulse mb-4">
            <div className="w-10 h-10 rounded-md bg-hover"></div>
            <div className="h-5 w-[80%] rounded-md bg-hover"></div>
          </div>
        ))}
      </div>
    );

  if (isError)
    return (
      <h2 className="text-center text-white text-2xl">
        {(error as Error).message}
      </h2>
    );

  return (
    <div>
      {songs?.map((song: Song, index: number) => {
        return (
          <div
            className="flex gap-2 items-center cursor-pointer mb-4 p-2 rounded-lg hover:bg-hover group relative"
            key={song.id}
            onClick={() => startPlayingSong(songs, index)}
          >
            <DeleteButton
              songId={song.id}
              imagePath={song.cover_image_url}
              audioPath={song.audio_url}
            />
            <Image
              src={song.cover_image_url}
              alt="cover-image"
              width={300}
              height={300}
              className="w-10 h-10 object-cover rounded-md"
            />
            <div>
              <p className="text-primary-text font-semibold">{song.title}</p>
              <p className="text-secondary-text text-sm">{song.artist}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
