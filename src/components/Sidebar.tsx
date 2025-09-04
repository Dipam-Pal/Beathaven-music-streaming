// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { MdOutlineLibraryMusic } from "react-icons/md";
// import { IoMdPlay } from "react-icons/io";
// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import useUserSession from "../../custom-hooks/useUserSession";
// import supabase from "../../api/SupabaseClient";

// // Small card row for a song (cover + title/artist + hover play)
// function SongRow({ id, title, artist, cover }: { id: number; title: string; artist: string; cover: string }) {
//   return (
//     <Link
//       href={`/songs/${id}`}
//       className="group flex items-center gap-3 p-2 rounded-md hover:bg-white/5 transition"
//     >
//       <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0">
//         <Image src={cover} alt={`${title} cover`} width={96} height={96} className="w-full h-full object-cover" />
//         <span className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
//           <span className="w-7 h-7 rounded-full bg-green-500 grid place-items-center shadow">
//             <IoMdPlay className="text-black text-sm translate-x-[1px]" />
//           </span>
//         </span>
//       </div>
//       <div className="min-w-0">
//         <p className="text-white text-sm font-medium truncate">{title}</p>
//         <p className="text-xs text-zinc-400 truncate">{artist}</p>
//       </div>
//     </Link>
//   );
// }

// // Wishlist section (pulls rows for the signed-in user)
// function WishlistSongs({ userId }: { userId?: string }) {
//   const { data, isLoading, isError, error } = useQuery({
//     queryKey: ["wishlistSidebar", userId],
//     enabled: !!userId, // only fetch if we have a user
//     queryFn: async () => {
//       // RLS disabled: still filter by user_id so we only show current user's wishlist
//       // Join wishlist -> songs via FK; adjust relation name "songs" if your schema names it differently
//       const { data, error } = await supabase
//         .from("wishlist")
//         .select("id, song_id, songs(*)")
//         .eq("user_id", userId!)
//         .order("created_at", { ascending: false });

//       if (error) throw error;
//       // Normalize to a simpler array
//       const items =
//         (data ?? [])
//           .map((row: any) => row.songs)
//           .filter((s: any) => !!s) as Array<{
//             id: number;
//             title: string;
//             artist: string;
//             cover_image_url: string;
//           }>;
//       return items;
//     },
//   });

//   if (!userId) {
//     return (
//       <div className="py-8 text-center text-white/80">
//         Login to view your Wishlist
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="space-y-3">
//         {Array.from({ length: 8 }).map((_, i) => (
//           <div key={i} className="flex gap-3 items-center">
//             <div className="w-12 h-12 rounded-md bg-hover animate-pulse" />
//             <div className="h-4 w-40 rounded bg-hover animate-pulse" />
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <p className="text-red-300 text-sm px-2">
//         Failed to load wishlist: {(error as Error).message}
//       </p>
//     );
//   }

//   if (!data || data.length === 0) {
//     return <p className="text-zinc-400 text-sm px-2">No songs in your wishlist yet.</p>;
//   }

//   return (
//     <div className="space-y-1">
//       {data.map((s) => (
//         <SongRow
//           key={s.id}
//           id={s.id}
//           title={s.title}
//           artist={s.artist}
//           cover={s.cover_image_url}
//         />
//       ))}
//     </div>
//   );
// }

// export default function Sidebar() {
//   const { loading, session } = useUserSession();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const user_id = session?.user.id;

//   if (loading) {
//     return (
//       <aside
//         className={`fixed left-2 top-16 bg-gradient-to-br from-black via-purple-900 to-black 
//         w-72 rounded-lg h-[90vh] p-2 overflow-y-auto 
//         ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
//         transition-transform duration-500 lg:translate-x-0`}
//       >
//         <div className="flex justify-between text-primary-text items-center p-2 mb-4">
//           <h2 className="font-bold">Your Library</h2>
//           {/* ⛔️ '+' removed as requested */}
//         </div>

//         {[...Array(10)].map((_, index) => (
//           <div key={index} className="flex gap-2 animate-pulse mb-4">
//             <div className="w-10 h-10 rounded-md bg-hover"></div>
//             <div className="h-5 w-[80%] rounded-md bg-hover"></div>
//           </div>
//         ))}
//       </aside>
//     );
//   }

//   return (
//     <>
//       {session ? (
//         // Logged in
//         <div>
//           <aside
//             className={`fixed left-2 top-16 bg-gradient-to-br from-black via-purple-900 to-black 
//             w-72 rounded-lg h-[90vh] p-2 overflow-y-auto 
//             ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
//             transition-transform duration-500 lg:translate-x-0`}
//           >
//             <div className="flex justify-between text-primary-text items-center p-2 mb-4">
//               <h2 className="font-bold">Your Library</h2>
//               {/* ⛔️ '+' removed */}
//             </div>

//             {/* Wishlist section */}
//             <div className="px-1">
//               <p className="text-zinc-300 text-xs uppercase tracking-wide px-2 mb-2">
//                 Wishlist
//               </p>
//               <WishlistSongs userId={user_id} />
//             </div>
//           </aside>

//           {/* Toggle Button (mobile) */}
//           <button
//             className="fixed bottom-5 left-5 bg-background w-12 h-12 lg:hidden grid place-items-center 
//             text-white rounded-full z-50 cursor-pointer"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//           >
//             <MdOutlineLibraryMusic />
//           </button>
//         </div>
//       ) : (
//         // Logged out
//         <div>
//           <aside
//             className={`fixed left-2 top-16 bg-gradient-to-br from-black via-purple-900 to-black 
//             w-72 rounded-lg h-[90vh] p-2 overflow-y-auto 
//             ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
//             transition-transform duration-500 lg:translate-x-0`}
//           >
//             <div className="py-8 text-center">
//               <Link
//                 href="/login"
//                 className="bg-white px-6 py-2 rounded-full font-semibold hover:bg-gray-200"
//               >
//                 Login
//               </Link>
//               <p className="mt-4 text-white">Login to view your Library</p>
//             </div>
//           </aside>

//           {/* Toggle Button (mobile) */}
//           <button
//             className="fixed bottom-5 left-5 bg-background w-12 h-12 lg:hidden grid place-items-center 
//             text-white rounded-full z-50 cursor-pointer"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//           >
//             <MdOutlineLibraryMusic />
//           </button>
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import Link from "next/link";
import Image from "next/image";
import { MdOutlineLibraryMusic } from "react-icons/md";
import { IoMdPlay } from "react-icons/io";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useUserSession from "../../custom-hooks/useUserSession";
import supabase from "../../api/SupabaseClient";

// Small card row for a song (cover + title/artist + hover play)
function SongRow({ id, title, artist, cover }: { id: number; title: string; artist: string; cover: string }) {
  return (
    <Link
      href={`/songs/${id}`}
      className="group flex items-center gap-3 p-2 rounded-md hover:bg-white/5 transition"
    >
      <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0">
        <Image src={cover} alt={`${title} cover`} width={96} height={96} className="w-full h-full object-cover" />
        <span className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
          <span className="w-7 h-7 rounded-full bg-green-500 grid place-items-center shadow">
            <IoMdPlay className="text-black text-sm translate-x-[1px]" />
          </span>
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-white text-sm font-medium truncate">{title}</p>
        <p className="text-xs text-zinc-400 truncate">{artist}</p>
      </div>
    </Link>
  );
}

// DB Row type for wishlist join
type WishlistRow = {
  id: number;
  song_id: number;
  songs: {
    id: number;
    title: string;
    artist: string;
    cover_image_url: string;
  } | null;
};

// Wishlist section (pulls rows for the signed-in user)
function WishlistSongs({ userId }: { userId?: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["wishlistSidebar", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlist")
        .select("id, song_id, songs(*)")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const items =
        (data as WishlistRow[] | null ?? [])
          .map((row) => row.songs)
          .filter((s): s is NonNullable<WishlistRow["songs"]> => !!s);

      return items;
    },
  });

  if (!userId) {
    return (
      <div className="py-8 text-center text-white/80">
        Login to view your Wishlist
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-3 items-center">
            <div className="w-12 h-12 rounded-md bg-hover animate-pulse" />
            <div className="h-4 w-40 rounded bg-hover animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-300 text-sm px-2">
        Failed to load wishlist: {(error as Error).message}
      </p>
    );
  }

  if (!data || data.length === 0) {
    return <p className="text-zinc-400 text-sm px-2">No songs in your wishlist yet.</p>;
  }

  return (
    <div className="space-y-1">
      {data.map((s) => (
        <SongRow
          key={s.id}
          id={s.id}
          title={s.title}
          artist={s.artist}
          cover={s.cover_image_url}
        />
      ))}
    </div>
  );
}

export default function Sidebar() {
  const { loading, session } = useUserSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user_id = session?.user.id;

  if (loading) {
    return (
      <aside
        className={`fixed left-2 top-16 bg-gradient-to-br from-black via-purple-900 to-black 
        w-72 rounded-lg h-[90vh] p-2 overflow-y-auto 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-500 lg:translate-x-0`}
      >
        <div className="flex justify-between text-primary-text items-center p-2 mb-4">
          <h2 className="font-bold">Your Library</h2>
        </div>

        {[...Array(10)].map((_, index) => (
          <div key={index} className="flex gap-2 animate-pulse mb-4">
            <div className="w-10 h-10 rounded-md bg-hover"></div>
            <div className="h-5 w-[80%] rounded-md bg-hover"></div>
          </div>
        ))}
      </aside>
    );
  }

  return (
    <>
      {session ? (
        <div>
          <aside
            className={`fixed left-2 top-16 bg-gradient-to-br from-black via-purple-900 to-black 
            w-72 rounded-lg h-[90vh] p-2 overflow-y-auto 
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            transition-transform duration-500 lg:translate-x-0`}
          >
            <div className="flex justify-between text-primary-text items-center p-2 mb-4">
              <h2 className="font-bold">Your Library</h2>
            </div>

            {/* Wishlist section */}
            <div className="px-1">
              <p className="text-zinc-300 text-xs uppercase tracking-wide px-2 mb-2">
                Wishlist
              </p>
              <WishlistSongs userId={user_id} />
            </div>
          </aside>

          {/* Toggle Button (mobile) */}
          <button
            className="fixed bottom-5 left-5 bg-background w-12 h-12 lg:hidden grid place-items-center 
            text-white rounded-full z-50 cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MdOutlineLibraryMusic />
          </button>
        </div>
      ) : (
        <div>
          <aside
            className={`fixed left-2 top-16 bg-gradient-to-br from-black via-purple-900 to-black 
            w-72 rounded-lg h-[90vh] p-2 overflow-y-auto 
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            transition-transform duration-500 lg:translate-x-0`}
          >
            <div className="py-8 text-center">
              <Link
                href="/login"
                className="bg-white px-6 py-2 rounded-full font-semibold hover:bg-gray-200"
              >
                Login
              </Link>
              <p className="mt-4 text-white">Login to view your Library</p>
            </div>
          </aside>

          {/* Toggle Button (mobile) */}
          <button
            className="fixed bottom-5 left-5 bg-background w-12 h-12 lg:hidden grid place-items-center 
            text-white rounded-full z-50 cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MdOutlineLibraryMusic />
          </button>
        </div>
      )}
    </>
  );
}
