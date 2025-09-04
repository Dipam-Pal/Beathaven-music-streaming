// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   useContext,
//   useEffect,
//   useRef,
//   useState,
//   forwardRef,
//   useImperativeHandle,
// } from "react";
// import supabase from "../../../../api/SupabaseClient";
// import type { Song } from "../../../../types/song";
// import { PlayerContext } from "../../../../layouts/FrontendLayout";

// // Toasts
// import { Toaster, toast } from "react-hot-toast";

// // Icons
// import { FaPlay, FaPause, FaShuffle, FaHeart } from "react-icons/fa6";
// import { FiDownload, FiVolume2 } from "react-icons/fi";
// import { BsThreeDots } from "react-icons/bs";

// /* --------------------------- utilities --------------------------- */
// function formatDuration(seconds: number | null | undefined) {
//   if (seconds === undefined || seconds === null || Number.isNaN(seconds)) return "0:00";
//   const m = Math.floor(seconds / 60);
//   const s = Math.floor(seconds % 60);
//   return `${m}:${s.toString().padStart(2, "0")}`;
// }
// function formatCount(n: number | null | undefined) {
//   if (!n && n !== 0) return "1,279,066";
//   return n.toLocaleString();
// }

// /* --------------------------- Slim Player -------------------------- */
// export type SlimPlayerHandle = {
//   play: () => void;
//   pause: () => void;
//   toggle: () => void;
//   seek: (t: number) => void;
// };

// const SlimPlayer = forwardRef<SlimPlayerHandle, {
//   src: string;
//   cover: string;
//   title: string;
//   artist: string;
//   autoPlay?: boolean;
//   onPlayChange?: (playing: boolean) => void;
// }>(
//   function SlimPlayer(
//     { src, cover, title, artist, autoPlay = false, onPlayChange },
//     ref
//   ) {
//     const audioRef = useRef<HTMLAudioElement | null>(null);
//     const [isPlaying, setIsPlaying] = useState(Boolean(autoPlay));
//     const [current, setCurrent] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const [volume, setVolume] = useState(1);

//     useImperativeHandle(ref, () => ({
//       play: () => {
//         setIsPlaying(true);
//         audioRef.current?.play().catch(() => setIsPlaying(false));
//       },
//       pause: () => {
//         setIsPlaying(false);
//         audioRef.current?.pause();
//       },
//       toggle: () => setIsPlaying((p) => !p),
//       seek: (t: number) => {
//         if (!audioRef.current) return;
//         audioRef.current.currentTime = t;
//         setCurrent(t);
//       },
//     }));

//     useEffect(() => {
//       onPlayChange?.(isPlaying);
//     }, [isPlaying, onPlayChange]);

//     useEffect(() => {
//       const a = audioRef.current;
//       if (!a) return;
//       a.volume = volume;
//     }, [volume]);

//     useEffect(() => {
//       const a = audioRef.current;
//       if (!a) return;
//       if (isPlaying) {
//         a.play().catch(() => setIsPlaying(false));
//       } else {
//         a.pause();
//       }
//     }, [isPlaying]);

//     const onLoaded = () => {
//       const a = audioRef.current;
//       if (!a) return;
//       setDuration(a.duration || 0);
//       if (autoPlay) {
//         a.play().catch(() => setIsPlaying(false));
//       }
//     };
//     const onTime = () => {
//       const a = audioRef.current;
//       if (!a) return;
//       setCurrent(a.currentTime || 0);
//     };

//     const seek = (v: number) => {
//       const a = audioRef.current;
//       if (!a) return;
//       a.currentTime = v;
//       setCurrent(v);
//     };

//     return (
//       <div className="mt-4">
//         {/* hidden native element */}
//         <audio
//           ref={audioRef}
//           src={src}
//           onLoadedMetadata={onLoaded}
//           onTimeUpdate={onTime}
//           onEnded={() => setIsPlaying(false)}
//           className="hidden"
//         />

//         {/* custom bar */}
//         <div className="w-full rounded-full bg-zinc-900/80 border border-zinc-800/70 shadow-lg px-4 py-3 flex gap-4">
//           {/* cover */}
//           <div className="w-10 h-10 rounded overflow-hidden shrink-0">
//             <Image
//               src={cover}
//               alt={`${title} cover`}
//               width={80}
//               height={80}
//               className="w-full h-full object-cover"
//             />
//           </div>

//           {/* play/pause */}
//           <button
//             onClick={() => setIsPlaying((p) => !p)}
//             className="w-9 h-9 rounded-full grid place-items-center bg-green-500 hover:bg-green-400 transition text-black shrink-0"
//             aria-label={isPlaying ? "Pause" : "Play"}
//           >
//             {isPlaying ? (
//               <FaPause className="text-sm" />
//             ) : (
//               <FaPlay className="text-sm translate-x-[1px]" />
//             )}
//           </button>

//           {/* title / artist */}
//           <div className="min-w-0 flex-1">
//             <p className="text-white text-sm font-medium truncate">{title}</p>
//             <p className="text-zinc-400 text-xs truncate">{artist}</p>
//           </div>

//           {/* time + scrubber */}
//           <div className="hidden md:flex items-center gap-2 w-[44%]">
//             <span className="text-zinc-400 text-xs tabular-nums">
//               {formatDuration(current)}
//             </span>
//             <input
//               type="range"
//               min={0}
//               max={duration || 0}
//               value={current}
//               onChange={(e) => seek(Number(e.target.value))}
//               className="w-full h-1.5 accent-green-500 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
//             />
//             <span className="text-zinc-400 text-xs tabular-nums">
//               {formatDuration(duration)}
//             </span>
//           </div>

//           {/* volume */}
//           <div className="hidden md:flex items-center gap-2 w-28">
//             <FiVolume2 className="text-zinc-300" />
//             <input
//               type="range"
//               min={0}
//               max={1}
//               step={0.01}
//               value={volume}
//               onChange={(e) => setVolume(Number(e.target.value))}
//               className="w-full h-1.5 accent-green-500 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
//             />
//           </div>

//           {/* more */}
//           <button className="text-zinc-300 hover:text-white">
//             <BsThreeDots className="text-lg" />
//           </button>
//         </div>
//       </div>
//     );
//   }
// );

// /* -------------------------- Page component ------------------------ */
// export default function SongDetailsPage() {
//   const { id } = useParams<{ id: string }>();
//   const router = useRouter();
//   const player = useContext(PlayerContext);

//   // Slim player control + play/pause sync for big green button
//   const slimRef = useRef<SlimPlayerHandle | null>(null);
//   const [playing, setPlaying] = useState(false);

//   // Auth user (for wishlist)
//   const { data: authUser } = useQuery({
//     queryKey: ["authUser"],
//     queryFn: async () => {
//       const { data } = await supabase.auth.getUser();
//       return data.user; // null if not logged in
//     },
//   });

//   // Song by id
//   const { data: song, isLoading, isError, error } = useQuery({
//     queryKey: ["songById", id],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("songs")
//         .select("*")
//         .eq("id", id)
//         .single();
//       if (error) throw new Error(error.message);
//       return data as Song;
//     },
//   });

//   // More from same artist
//   const { data: moreByArtist } = useQuery({
//     queryKey: ["moreByArtist", song?.artist, id],
//     enabled: !!song?.artist,
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("songs")
//         .select("*")
//         .neq("id", id)
//         .eq("artist", song!.artist)
//         .limit(12);
//       if (error) throw new Error(error.message);
//       return data as Song[];
//     },
//   });

//   // Is this song in wishlist?
//   const { data: wishRow, isFetching: wishLoading } = useQuery({
//     queryKey: ["wishlist", id, authUser?.id],
//     enabled: !!song && !!authUser?.id,
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("wishlist")
//         .select("id")
//         .eq("user_id", authUser!.id)
//         .eq("song_id", song!.id)
//         .maybeSingle();
//       if (error && (error as any).code !== "PGRST116") throw error;
//       return data ?? null;
//     },
//   });

//   // liked: null = unknown/loading; true/false = known state
//   const [liked, setLiked] = useState<boolean | null>(null);
//   useEffect(() => {
//     // set initial liked after fetch completes
//     if (authUser && song) {
//       setLiked(!!wishRow);
//     } else {
//       setLiked(null);
//     }
//   }, [authUser, song, wishRow]);

//   const queryClient = useQueryClient();

//   // RLS disabled per your setup; no optimistic flip; set state only on success
//   const toggleWishlist = useMutation({
//     // nextLiked tells us what user wants after click
//     mutationFn: async (nextLiked: boolean) => {
//       if (!authUser) {
//         toast.error("Please sign in to use wishlist.");
//         throw new Error("not-signed-in");
//       }
//       if (!song) throw new Error("No song");

//       if (nextLiked) {
//         // ADD: use upsert to be safe
//         const { error } = await supabase
//           .from("wishlist")
//           .upsert(
//             { user_id: authUser.id, song_id: song.id },
//             { onConflict: "user_id,song_id", ignoreDuplicates: true }
//           );
//         if (error) throw error;
//         return { liked: true as const };
//       } else {
//         // REMOVE
//         const { error } = await supabase
//           .from("wishlist")
//           .delete()
//           .eq("user_id", authUser.id)
//           .eq("song_id", song.id);
//         if (error) throw error;
//         return { liked: false as const };
//       }
//     },
//     onSuccess: (res) => {
//       setLiked(res.liked); // update UI only after server confirms
//       if (res.liked) {
//         toast.success("Added to wishlist");
//       } else {
//         toast("Removed from wishlist", { icon: "🗑️" });
//       }
//       queryClient.invalidateQueries({ queryKey: ["wishlist", id, authUser?.id] });
//     },
//     onError: (err: any) => {
//       toast.error(err?.message || "Could not update wishlist");
//     },
//   });

//   if (isLoading) {
//     return (
//       <div className="min-h-[90vh] my-15 p-6 rounded-lg bg-gradient-to-br from-black via-purple-950 to-purple-900">
//         <div className="animate-pulse h-10 w-72 bg-zinc-800/60 rounded mb-6" />
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div className="h-64 bg-zinc-800/60 rounded" />
//           <div className="md:col-span-2 space-y-4">
//             <div className="h-8 w-96 bg-zinc-800/60 rounded" />
//             <div className="h-4 w-64 bg-zinc-800/60 rounded" />
//             <div className="h-24 w-full bg-zinc-800/60 rounded" />
//           </div>
//         </div>
//         <Toaster position="bottom-center" toastOptions={{ style: { background: "#111", color: "#fff", border: "1px solid #333" } }} />
//       </div>
//     );
//   }

//   if (isError || !song) {
//     return (
//       <div className="min-h-[90vh] my-15 p-6 rounded-lg mx-4 bg-gradient-to-br from-black via-purple-950 to-indigo-900">
//         <button onClick={() => router.back()} className="text-white/90 hover:text-white">
//           ← Back
//         </button>
//         <p className="text-white mt-6">
//           Unable to load song: {(error as Error)?.message ?? "Not found"}
//         </p>
//         <Toaster position="bottom-center" toastOptions={{ style: { background: "#111", color: "#fff", border: "1px solid #333" } }} />
//       </div>
//     );
//   }

//   const plays = 1_279_066;
//   const durationSec = 263; // example (4:23)

//   return (
//     <div className="my-6 rounded-2xl overflow-hidden">
//       {/* Toaster (global for this page) */}
//       <Toaster
//         position="bottom-center"
//         toastOptions={{
//           style: { background: "#0b0b0b", color: "#fff", border: "1px solid #2a2a2a" },
//           success: { iconTheme: { primary: "#22c55e", secondary: "#0b0b0b" } },
//         }}
//       />

//       {/* HEADER */}
//       <div className="relative rounded-2xl bg-[radial-gradient(100%_100%_at_0%_0%,#7f1d1d_0%,#450a0a_35%,#1c1917_100%)] md:bg-gradient-to-b md:from-purple-800 md:to-zinc-900 text-white">
//         <div className="p-6 md:p-8 lg:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
//           <div className="w-40 h-40 md:w-56 md:h-56 rounded-md shadow-xl shrink-0 overflow-hidden">
//             <Image
//               src={song.cover_image_url}
//               alt={`${song.title} cover`}
//               width={600}
//               height={600}
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div className="flex-1">
//             <p className="uppercase text-sm tracking-wide text-white/80">Single</p>
//             <h1 className="text-3xl md:text-6xl font-extrabold leading-tight mt-1">
//               {song.title}
//             </h1>
//             <p className="mt-2 text-white/90 text-base md:text-lg">
//               {song.artist}
//               <span className="mx-2">•</span> {new Date(song.created_at).getFullYear()}
//               <span className="mx-2">•</span> 1 song, {formatDuration(durationSec)}
//             </p>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="px-6 md:px-8 lg:px-10 pb-6 md:pb-8">
//           <div className="flex items-center gap-4">
//             {/* BIG GREEN PLAY — toggles play/pause & keeps icon in sync */}
//             <button
//               onClick={() => {
//                 if (player) {
//                   player.setQueue([song]);
//                   player.setCurrentIndex(0);
//                 }
//                 slimRef.current?.toggle();
//               }}
//               className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 transition shadow-lg"
//               aria-label={playing ? "Pause" : "Play"}
//             >
//               {playing ? (
//                 <FaPause className="text-black text-xl" />
//               ) : (
//                 <FaPlay className="text-black text-xl translate-x-[1px]" />
//               )}
//             </button>

//             <button
//               className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition"
//               title="Shuffle"
//               aria-label="Shuffle"
//             >
//               <FaShuffle className="text-white text-lg" />
//             </button>

//             {/* ❤️ Wishlist toggle — first click adds & stays, second removes */}
//             <button
//               onClick={() => {
//                 if (liked === null) return; // unknown yet
//                 const next = !liked;        // first click from false -> true (add)
//                 toggleWishlist.mutate(next);
//               }}
//               className={`inline-flex items-center justify-center w-12 h-12 rounded-full transition ${
//                 liked ? "bg-green-600" : "bg-zinc-800/80 hover:bg-zinc-700"
//               }`}
//               title={liked ? "Remove from wishlist" : "Add to wishlist"}
//               aria-label="Like"
//               disabled={!authUser || liked === null}
//             >
//               <FaHeart className="text-white text-lg" />
//             </button>

//             <a
//               href={song.audio_url}
//               download
//               className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition"
//               title="Download"
//               aria-label="Download"
//             >
//               <FiDownload className="text-white text-lg" />
//             </a>

//             <button
//               className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition"
//               aria-label="More"
//             >
//               <BsThreeDots className="text-white text-xl" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Slim player (custom) */}
//       <div className="px-4 md:px-2 pb-6">
//         <SlimPlayer
//           ref={slimRef}
//           src={song.audio_url}
//           cover={song.cover_image_url}
//           title={song.title}
//           artist={song.artist}
//           autoPlay={false}
//           onPlayChange={(p) => setPlaying(p)}
//         />
//       </div>

//       {/* TABLE + META */}
//       <div className="mt-4 rounded-2xl bg-gradient-to-b from-[#151515] to-transparent backdrop-blur border border-zinc-800/60">
//         <div className="px-6 md:px-8 pt-4 pb-3 flex items-center justify-between text-zinc-300">
//           <div className="flex items-center gap-8 text-sm">
//             <span className="w-6 text-zinc-400">#</span>
//             <span className="min-w-[180px]">Title</span>
//           </div>
//           <div className="flex items-center gap-12 text-sm">
//             <span>Plays</span>
//             <span className="w-8 text-right">⏱</span>
//           </div>
//         </div>

//         <div className="px-6 md:px-8 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-6">
//             <span className="w-6 text-zinc-400">1</span>
//             <div>
//               <p className="text-white font-medium">{song.title}</p>
//               <p className="text-zinc-400 text-sm">{song.artist}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-12">
//             <span className="text-zinc-300">{formatCount(1_279_066)}</span>
//             <span className="w-8 text-right text-zinc-300">
//               {formatDuration(263)}
//             </span>
//           </div>
//         </div>

//         {/* Description block */}
//         {song.description && (
//           <div className="px-6 md:px-8 pt-1 pb-5">
//             <div className="bg-black/30 border border-zinc-800/60 rounded-xl p-4 text-zinc-200 leading-relaxed">
//               {song.description}
//             </div>
//           </div>
//         )}

//         {/* footer meta */}
//         <div className="px-6 md:px-8 py-6 text-zinc-400 text-sm border-t border-zinc-800/60">
//           {new Date(song.created_at).toLocaleString("en-US", {
//             month: "long",
//             day: "numeric",
//             year: "numeric",
//           })}
//           <br />© 2025 Your Label • ℗ 2025 Your Label
//         </div>
//       </div>

//       {/* MORE BY ARTIST */}
//       {moreByArtist && moreByArtist.length > 0 && (
//         <section className="mt-8">
//           <h3 className="text-white text-2xl font-bold mb-4">
//             More by {song.artist}
//           </h3>
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
//             {moreByArtist.map((s) => (
//               <Link
//                 key={s.id}
//                 href={`/songs/${s.id}`}
//                 className="group rounded-lg overflow-hidden bg-black/40 border border-zinc-800/60 hover:bg-black/60 transition"
//               >
//                 <div className="relative">
//                   <Image
//                     src={s.cover_image_url}
//                     alt={`${s.title} cover`}
//                     width={400}
//                     height={400}
//                     className="w-full aspect-square object-cover"
//                   />
//                   <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition">
//                     <div className="w-10 h-10 rounded-full bg-green-500 grid place-items-center shadow">
//                       <FaPlay className="text-black text-sm translate-x-[1px]" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-3">
//                   <p className="text-white font-medium line-clamp-1">{s.title}</p>
//                   <p className="text-zinc-400 text-sm line-clamp-1">{s.artist}</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }

// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   useContext,
//   useEffect,
//   useRef,
//   useState,
//   forwardRef,
//   useImperativeHandle,
// } from "react";
// import supabase from "../../../../api/SupabaseClient";
// import type { Song } from "../../../../types/song";
// import { PlayerContext } from "../../../../layouts/FrontendLayout";

// // Toasts
// import { Toaster, toast } from "react-hot-toast";

// // Icons
// import { FaPlay, FaPause, FaShuffle, FaHeart } from "react-icons/fa6";
// import { FiDownload, FiVolume2 } from "react-icons/fi";
// import { BsThreeDots } from "react-icons/bs";

// /* --------------------------- utilities --------------------------- */
// function formatDuration(seconds: number | null | undefined) {
//   if (seconds === undefined || seconds === null || Number.isNaN(seconds)) return "0:00";
//   const m = Math.floor(seconds / 60);
//   const s = Math.floor(seconds % 60);
//   return `${m}:${s.toString().padStart(2, "0")}`;
// }
// function formatCount(n: number | null | undefined) {
//   if (!n && n !== 0) return "1,279,066";
//   return n.toLocaleString();
// }

// /* --------------------------- Slim Player -------------------------- */
// export type SlimPlayerHandle = {
//   play: () => void;
//   pause: () => void;
//   toggle: () => void;
//   seek: (t: number) => void;
// };

// const SlimPlayer = forwardRef<SlimPlayerHandle, {
//   src: string;
//   cover: string;
//   title: string;
//   artist: string;
//   autoPlay?: boolean;
//   onPlayChange?: (playing: boolean) => void;
// }>(
//   function SlimPlayer(
//     { src, cover, title, artist, autoPlay = false, onPlayChange },
//     ref
//   ) {
//     const audioRef = useRef<HTMLAudioElement | null>(null);
//     const [isPlaying, setIsPlaying] = useState(Boolean(autoPlay));
//     const [current, setCurrent] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const [volume, setVolume] = useState(1);

//     useImperativeHandle(ref, () => ({
//       play: () => {
//         setIsPlaying(true);
//         audioRef.current?.play().catch(() => setIsPlaying(false));
//       },
//       pause: () => {
//         setIsPlaying(false);
//         audioRef.current?.pause();
//       },
//       toggle: () => setIsPlaying((p) => !p),
//       seek: (t: number) => {
//         if (!audioRef.current) return;
//         audioRef.current.currentTime = t;
//         setCurrent(t);
//       },
//     }));

//     useEffect(() => {
//       onPlayChange?.(isPlaying);
//     }, [isPlaying, onPlayChange]);

//     useEffect(() => {
//       const a = audioRef.current;
//       if (!a) return;
//       a.volume = volume;
//     }, [volume]);

//     useEffect(() => {
//       const a = audioRef.current;
//       if (!a) return;
//       if (isPlaying) {
//         a.play().catch(() => setIsPlaying(false));
//       } else {
//         a.pause();
//       }
//     }, [isPlaying]);

//     const onLoaded = () => {
//       const a = audioRef.current;
//       if (!a) return;
//       setDuration(a.duration || 0);
//       if (autoPlay) {
//         a.play().catch(() => setIsPlaying(false));
//       }
//     };
//     const onTime = () => {
//       const a = audioRef.current;
//       if (!a) return;
//       setCurrent(a.currentTime || 0);
//     };

//     const seek = (v: number) => {
//       const a = audioRef.current;
//       if (!a) return;
//       a.currentTime = v;
//       setCurrent(v);
//     };

//     return (
//       <div className="mt-4">
//         {/* hidden native element */}
//         <audio
//           ref={audioRef}
//           src={src}
//           onLoadedMetadata={onLoaded}
//           onTimeUpdate={onTime}
//           onEnded={() => setIsPlaying(false)}
//           className="hidden"
//         />

//         {/* custom bar */}
//         <div className="w-full rounded-full bg-zinc-900/80 border border-zinc-800/70 shadow-lg px-4 py-3 flex gap-4">
//           {/* cover */}
//           <div className="w-10 h-10 rounded overflow-hidden shrink-0">
//             <Image
//               src={cover}
//               alt={`${title} cover`}
//               width={80}
//               height={80}
//               className="w-full h-full object-cover"
//             />
//           </div>

//           {/* play/pause */}
//           <button
//             onClick={() => setIsPlaying((p) => !p)}
//             className="w-9 h-9 rounded-full grid place-items-center bg-green-500 hover:bg-green-400 transition text-black shrink-0"
//             aria-label={isPlaying ? "Pause" : "Play"}
//           >
//             {isPlaying ? (
//               <FaPause className="text-sm" />
//             ) : (
//               <FaPlay className="text-sm translate-x-[1px]" />
//             )}
//           </button>

//           {/* title / artist */}
//           <div className="min-w-0 flex-1">
//             <p className="text-white text-sm font-medium truncate">{title}</p>
//             <p className="text-zinc-400 text-xs truncate">{artist}</p>
//           </div>

//           {/* time + scrubber */}
//           <div className="hidden md:flex items-center gap-2 w-[44%]">
//             <span className="text-zinc-400 text-xs tabular-nums">
//               {formatDuration(current)}
//             </span>
//             <input
//               type="range"
//               min={0}
//               max={duration || 0}
//               value={current}
//               onChange={(e) => seek(Number(e.target.value))}
//               className="w-full h-1.5 accent-green-500 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
//             />
//             <span className="text-zinc-400 text-xs tabular-nums">
//               {formatDuration(duration)}
//             </span>
//           </div>

//           {/* volume */}
//           <div className="hidden md:flex items-center gap-2 w-28">
//             <FiVolume2 className="text-zinc-300" />
//             <input
//               type="range"
//               min={0}
//               max={1}
//               step={0.01}
//               value={volume}
//               onChange={(e) => setVolume(Number(e.target.value))}
//               className="w-full h-1.5 accent-green-500 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
//             />
//           </div>

//           {/* more */}
//           <button className="text-zinc-300 hover:text-white">
//             <BsThreeDots className="text-lg" />
//           </button>
//         </div>
//       </div>
//     );
//   }
// );

// /* -------------------------- Page component ------------------------ */
// export default function SongDetailsPage() {
//   const { id } = useParams<{ id: string }>();
//   const router = useRouter();
//   const player = useContext(PlayerContext);

//   // Slim player control + play/pause sync for big green button
//   const slimRef = useRef<SlimPlayerHandle | null>(null);
//   const [playing, setPlaying] = useState(false);

//   // Auth user (for wishlist)
//   const { data: authUser } = useQuery({
//     queryKey: ["authUser"],
//     queryFn: async () => {
//       const { data } = await supabase.auth.getUser();
//       return data.user; // null if not logged in
//     },
//   });

//   // Song by id
//   const { data: song, isLoading, isError, error } = useQuery({
//     queryKey: ["songById", id],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("songs")
//         .select("*")
//         .eq("id", id)
//         .single();
//       if (error) throw new Error(error.message);
//       return data as Song;
//     },
//   });

//   // More from same artist
//   const { data: moreByArtist } = useQuery({
//     queryKey: ["moreByArtist", song?.artist, id],
//     enabled: !!song?.artist,
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("songs")
//         .select("*")
//         .neq("id", id)
//         .eq("artist", song!.artist)
//         .limit(12);
//       if (error) throw new Error(error.message);
//       return data as Song[];
//     },
//   });

//   // Is this song in wishlist?
//   const { data: wishRow, isFetching: wishLoading } = useQuery({
//     queryKey: ["wishlist", id, authUser?.id],
//     enabled: !!song && !!authUser?.id,
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("wishlist")
//         .select("id")
//         .eq("user_id", authUser!.id)
//         .eq("song_id", song!.id)
//         .maybeSingle();
//       if (error && (error as any).code !== "PGRST116") throw error;
//       return data ?? null;
//     },
//   });

//   // liked: null = unknown/loading; true/false = known state
//   const [liked, setLiked] = useState<boolean | null>(null);
//   useEffect(() => {
//     // set initial liked after fetch completes
//     if (authUser && song) {
//       setLiked(!!wishRow);
//     } else {
//       setLiked(null);
//     }
//   }, [authUser, song, wishRow]);

//   const queryClient = useQueryClient();

//   // RLS disabled per your setup; no optimistic flip; set state only on success
//   const toggleWishlist = useMutation({
//     // nextLiked tells us what user wants after click
//     mutationFn: async (nextLiked: boolean) => {
//       if (!authUser) {
//         toast.error("Please sign in to use wishlist.");
//         throw new Error("not-signed-in");
//       }
//       if (!song) throw new Error("No song");

//       if (nextLiked) {
//         // ADD: use upsert to be safe
//         const { error } = await supabase
//           .from("wishlist")
//           .upsert(
//             { user_id: authUser.id, song_id: song.id },
//             { onConflict: "user_id,song_id", ignoreDuplicates: true }
//           );
//         if (error) throw error;
//         return { liked: true as const };
//       } else {
//         // REMOVE
//         const { error } = await supabase
//           .from("wishlist")
//           .delete()
//           .eq("user_id", authUser.id)
//           .eq("song_id", song.id);
//         if (error) throw error;
//         return { liked: false as const };
//       }
//     },
//     onSuccess: (res) => {
//       setLiked(res.liked); // update UI only after server confirms
//       if (res.liked) {
//         toast.success("Added to wishlist");
//       } else {
//         toast("Removed from wishlist", { icon: "🗑️" });
//       }
//       queryClient.invalidateQueries({ queryKey: ["wishlist", id, authUser?.id] });
//     },
//     onError: (err: any) => {
//       toast.error(err?.message || "Could not update wishlist");
//     },
//   });

//   if (isLoading) {
//     return (
//       <div className="min-h-[90vh] my-15 p-6 rounded-lg bg-gradient-to-br from-black via-purple-950 to-purple-900">
//         <div className="animate-pulse h-10 w-72 bg-zinc-800/60 rounded mb-6" />
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div className="h-64 bg-zinc-800/60 rounded" />
//           <div className="md:col-span-2 space-y-4">
//             <div className="h-8 w-96 bg-zinc-800/60 rounded" />
//             <div className="h-4 w-64 bg-zinc-800/60 rounded" />
//             <div className="h-24 w-full bg-zinc-800/60 rounded" />
//           </div>
//         </div>
//         <Toaster position="bottom-center" toastOptions={{ style: { background: "#111", color: "#fff", border: "1px solid #333" } }} />
//       </div>
//     );
//   }

//   if (isError || !song) {
//     return (
//       <div className="min-h-[90vh] my-15 p-6 rounded-lg mx-4 bg-gradient-to-br from-black via-purple-950 to-indigo-900">
//         <button onClick={() => router.back()} className="text-white/90 hover:text-white">
//           ← Back
//         </button>
//         <p className="text-white mt-6">
//           Unable to load song: {(error as Error)?.message ?? "Not found"}
//         </p>
//         <Toaster position="bottom-center" toastOptions={{ style: { background: "#111", color: "#fff", border: "1px solid #333" } }} />
//       </div>
//     );
//   }

//   const plays = 1_279_066;
//   const durationSec = 263; // example (4:23)

//   return (
//     <div className="my-6 rounded-2xl overflow-hidden">
//       {/* Toaster (global for this page) */}
//       <Toaster
//         position="bottom-center"
//         toastOptions={{
//           style: { background: "#0b0b0b", color: "#fff", border: "1px solid #2a2a2a" },
//           success: { iconTheme: { primary: "#22c55e", secondary: "#0b0b0b" } },
//         }}
//       />

//       {/* HEADER */}
//       <div className="relative rounded-2xl bg-[radial-gradient(100%_100%_at_0%_0%,#7f1d1d_0%,#450a0a_35%,#1c1917_100%)] md:bg-gradient-to-b md:from-purple-800 md:to-zinc-900 text-white">
//         <div className="p-6 md:p-8 lg:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
//           <div className="w-40 h-40 md:w-56 md:h-56 rounded-md shadow-xl shrink-0 overflow-hidden">
//             <Image
//               src={song.cover_image_url}
//               alt={`${song.title} cover`}
//               width={600}
//               height={600}
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div className="flex-1">
//             <p className="uppercase text-sm tracking-wide text-white/80">Single</p>
//             <h1 className="text-3xl md:text-6xl font-extrabold leading-tight mt-1">
//               {song.title}
//             </h1>
//             <p className="mt-2 text-white/90 text-base md:text-lg">
//               {song.artist}
//               <span className="mx-2">•</span> {new Date(song.created_at).getFullYear()}
//               <span className="mx-2">•</span> 1 song, {formatDuration(durationSec)}
//             </p>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="px-6 md:px-8 lg:px-10 pb-6 md:pb-8">
//           <div className="flex items-center gap-4">
//             {/* BIG GREEN PLAY — toggles play/pause & keeps icon in sync */}
//             <button
//               onClick={() => {
//                 if (player) {
//                   player.setQueue([song]);
//                   player.setCurrentIndex(0);
//                 }
//                 slimRef.current?.toggle();
//               }}
//               className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 transition shadow-lg"
//               aria-label={playing ? "Pause" : "Play"}
//             >
//               {playing ? (
//                 <FaPause className="text-black text-xl" />
//               ) : (
//                 <FaPlay className="text-black text-xl translate-x-[1px]" />
//               )}
//             </button>

//             <button
//               className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition"
//               title="Shuffle"
//               aria-label="Shuffle"
//             >
//               <FaShuffle className="text-white text-lg" />
//             </button>

//             {/* ❤️ Wishlist toggle — first click adds & stays, second removes */}
//             <button
//               onClick={() => {
//                 if (liked === null) return; // unknown yet
//                 const next = !liked;        // first click from false -> true (add)
//                 toggleWishlist.mutate(next);
//               }}
//               className={`inline-flex items-center justify-center w-12 h-12 rounded-full transition ${
//                 liked ? "bg-green-600" : "bg-zinc-800/80 hover:bg-zinc-700"
//               }`}
//               title={liked ? "Remove from wishlist" : "Add to wishlist"}
//               aria-label="Like"
//               disabled={!authUser || liked === null}
//             >
//               <FaHeart className="text-white text-lg" />
//             </button>

//             <a
//               href={song.audio_url}
//               download
//               className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition"
//               title="Download"
//               aria-label="Download"
//             >
//               <FiDownload className="text-white text-lg" />
//             </a>

//             <button
//               className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition"
//               aria-label="More"
//             >
//               <BsThreeDots className="text-white text-xl" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Slim player (custom) */}
//       <div className="px-4 md:px-2 pb-6">
//         <SlimPlayer
//           ref={slimRef}
//           src={song.audio_url}
//           cover={song.cover_image_url}
//           title={song.title}
//           artist={song.artist}
//           autoPlay={false}
//           onPlayChange={(p) => setPlaying(p)}
//         />
//       </div>

//       {/* TABLE + META */}
//       <div className="mt-4 rounded-2xl bg-gradient-to-b from-[#151515] to-transparent backdrop-blur border border-zinc-800/60">
//         <div className="px-6 md:px-8 pt-4 pb-3 flex items-center justify-between text-zinc-300">
//           <div className="flex items-center gap-8 text-sm">
//             <span className="w-6 text-zinc-400">#</span>
//             <span className="min-w-[180px]">Title</span>
//           </div>
//           <div className="flex items-center gap-12 text-sm">
//             <span>Plays</span>
//             <span className="w-8 text-right">⏱</span>
//           </div>
//         </div>

//         <div className="px-6 md:px-8 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-6">
//             <span className="w-6 text-zinc-400">1</span>
//             <div>
//               <p className="text-white font-medium">{song.title}</p>
//               <p className="text-zinc-400 text-sm">{song.artist}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-12">
//             <span className="text-zinc-300">{formatCount(1_279_066)}</span>
//             <span className="w-8 text-right text-zinc-300">
//               {formatDuration(263)}
//             </span>
//           </div>
//         </div>

//         {/* Description block */}
//         {song.description && (
//           <div className="px-6 md:px-8 pt-1 pb-5">
//             <div className="bg-black/30 border border-zinc-800/60 rounded-xl p-4 text-zinc-200 leading-relaxed">
//               {song.description}
//             </div>
//           </div>
//         )}

//         {/* footer meta */}
//         <div className="px-6 md:px-8 py-6 text-zinc-400 text-sm border-t border-zinc-800/60">
//           {new Date(song.created_at).toLocaleString("en-US", {
//             month: "long",
//             day: "numeric",
//             year: "numeric",
//           })}
//           <br />© 2025 Your Label • ℗ 2025 Your Label
//         </div>
//       </div>

//       {/* MORE BY ARTIST */}
//       {moreByArtist && moreByArtist.length > 0 && (
//         <section className="mt-8">
//           <h3 className="text-white text-2xl font-bold mb-4">
//             More by {song.artist}
//           </h3>
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
//             {moreByArtist.map((s) => (
//               <Link
//                 key={s.id}
//                 href={`/songs/${s.id}`}
//                 className="group rounded-lg overflow-hidden bg-black/40 border border-zinc-800/60 hover:bg-black/60 transition"
//               >
//                 <div className="relative">
//                   <Image
//                     src={s.cover_image_url}
//                     alt={`${s.title} cover`}
//                     width={400}
//                     height={400}
//                     className="w-full aspect-square object-cover"
//                   />
//                   <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition">
//                     <div className="w-10 h-10 rounded-full bg-green-500 grid place-items-center shadow">
//                       <FaPlay className="text-black text-sm translate-x-[1px]" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-3">
//                   <p className="text-white font-medium line-clamp-1">{s.title}</p>
//                   <p className="text-zinc-400 text-sm line-clamp-1">{s.artist}</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import supabase from "../../../../api/SupabaseClient";
import type { Song } from "../../../../types/song";
import { PlayerContext } from "../../../../layouts/FrontendLayout";

// Toasts
import { Toaster, toast } from "react-hot-toast";

// Icons
import { FaPlay, FaPause, FaShuffle, FaHeart } from "react-icons/fa6";
import { FiDownload, FiVolume2 } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";

// Supabase types
import type { PostgrestError } from "@supabase/supabase-js";

/* --------------------------- utilities --------------------------- */
function formatDuration(seconds: number | null | undefined) {
  if (seconds === undefined || seconds === null || Number.isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
function formatCount(n: number | null | undefined) {
  if (!n && n !== 0) return "1,279,066";
  return n.toLocaleString();
}

/* --------------------------- Slim Player -------------------------- */
export type SlimPlayerHandle = {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (t: number) => void;
};

const SlimPlayer = forwardRef<SlimPlayerHandle, {
  src: string;
  cover: string;
  title: string;
  artist: string;
  autoPlay?: boolean;
  onPlayChange?: (playing: boolean) => void;
}>(
  function SlimPlayer(
    { src, cover, title, artist, autoPlay = false, onPlayChange },
    ref
  ) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(Boolean(autoPlay));
    const [current, setCurrent] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    useImperativeHandle(ref, () => ({
      play: () => {
        setIsPlaying(true);
        audioRef.current?.play().catch(() => setIsPlaying(false));
      },
      pause: () => {
        setIsPlaying(false);
        audioRef.current?.pause();
      },
      toggle: () => setIsPlaying((p) => !p),
      seek: (t: number) => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = t;
        setCurrent(t);
      },
    }));

    useEffect(() => {
      onPlayChange?.(isPlaying);
    }, [isPlaying, onPlayChange]);

    useEffect(() => {
      const a = audioRef.current;
      if (!a) return;
      a.volume = volume;
    }, [volume]);

    useEffect(() => {
      const a = audioRef.current;
      if (!a) return;
      if (isPlaying) {
        a.play().catch(() => setIsPlaying(false));
      } else {
        a.pause();
      }
    }, [isPlaying]);

    const onLoaded = () => {
      const a = audioRef.current;
      if (!a) return;
      setDuration(a.duration || 0);
      if (autoPlay) {
        a.play().catch(() => setIsPlaying(false));
      }
    };
    const onTime = () => {
      const a = audioRef.current;
      if (!a) return;
      setCurrent(a.currentTime || 0);
    };

    const seek = (v: number) => {
      const a = audioRef.current;
      if (!a) return;
      a.currentTime = v;
      setCurrent(v);
    };

    return (
      <div className="mt-4">
        {/* hidden native element */}
        <audio
          ref={audioRef}
          src={src}
          onLoadedMetadata={onLoaded}
          onTimeUpdate={onTime}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />

        {/* custom bar */}
        <div className="w-full rounded-full bg-zinc-900/80 border border-zinc-800/70 shadow-lg px-4 py-3 flex gap-4">
          {/* cover */}
          <div className="w-10 h-10 rounded overflow-hidden shrink-0">
            <Image
              src={cover}
              alt={`${title} cover`}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>

          {/* play/pause */}
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="w-9 h-9 rounded-full grid place-items-center bg-green-500 hover:bg-green-400 transition text-black shrink-0"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <FaPause className="text-sm" />
            ) : (
              <FaPlay className="text-sm translate-x-[1px]" />
            )}
          </button>

          {/* title / artist */}
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate">{title}</p>
            <p className="text-zinc-400 text-xs truncate">{artist}</p>
          </div>

          {/* time + scrubber */}
          <div className="hidden md:flex items-center gap-2 w-[44%]">
            <span className="text-zinc-400 text-xs tabular-nums">
              {formatDuration(current)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={current}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-1.5 accent-green-500 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-zinc-400 text-xs tabular-nums">
              {formatDuration(duration)}
            </span>
          </div>

          {/* volume */}
          <div className="hidden md:flex items-center gap-2 w-28">
            <FiVolume2 className="text-zinc-300" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-1.5 accent-green-500 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* more */}
          <button className="text-zinc-300 hover:text-white">
            <BsThreeDots className="text-lg" />
          </button>
        </div>
      </div>
    );
  }
);

/* -------------------------- Page component ------------------------ */
export default function SongDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const player = useContext(PlayerContext);

  // Slim player control + play/pause sync for big green button
  const slimRef = useRef<SlimPlayerHandle | null>(null);
  const [playing, setPlaying] = useState(false);

  // Auth user (for wishlist)
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user; // null if not logged in
    },
  });

  // Song by id
  const { data: song, isLoading, isError, error } = useQuery({
    queryKey: ["songById", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw new Error(error.message);
      return data as Song;
    },
  });

  // More from same artist
  const { data: moreByArtist } = useQuery({
    queryKey: ["moreByArtist", song?.artist, id],
    enabled: !!song?.artist,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .neq("id", id)
        .eq("artist", song!.artist)
        .limit(12);
      if (error) throw new Error(error.message);
      return data as Song[];
    },
  });

  // Is this song in wishlist?
  const { data: wishRow } = useQuery({
    queryKey: ["wishlist", id, authUser?.id],
    enabled: !!song && !!authUser?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlist")
        .select("id")
        .eq("user_id", authUser!.id)
        .eq("song_id", song!.id)
        .maybeSingle();
      if (error && (error as PostgrestError).code !== "PGRST116") throw error;
      return data ?? null;
    },
  });

  // liked: null = unknown/loading; true/false = known state
  const [liked, setLiked] = useState<boolean | null>(null);
  useEffect(() => {
    // set initial liked after fetch completes
    if (authUser && song) {
      setLiked(!!wishRow);
    } else {
      setLiked(null);
    }
  }, [authUser, song, wishRow]);

  const queryClient = useQueryClient();

  // RLS disabled per your setup; no optimistic flip; set state only on success
  const toggleWishlist = useMutation({
    // nextLiked tells us what user wants after click
    mutationFn: async (nextLiked: boolean) => {
      if (!authUser) {
        toast.error("Please sign in to use wishlist.");
        throw new Error("not-signed-in");
      }
      if (!song) throw new Error("No song");

      if (nextLiked) {
        // ADD: use upsert to be safe
        const { error } = await supabase
          .from("wishlist")
          .upsert(
            { user_id: authUser.id, song_id: song.id },
            { onConflict: "user_id,song_id", ignoreDuplicates: true }
          );
        if (error) throw error;
        return { liked: true as const };
      } else {
        // REMOVE
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", authUser.id)
          .eq("song_id", song.id);
        if (error) throw error;
        return { liked: false as const };
      }
    },
    onSuccess: (res) => {
      setLiked(res.liked); // update UI only after server confirms
      if (res.liked) {
        toast.success("Added to wishlist");
      } else {
        toast("Removed from wishlist", { icon: "🗑️" });
      }
      queryClient.invalidateQueries({ queryKey: ["wishlist", id, authUser?.id] });
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Could not update wishlist");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[90vh] my-15 p-6 rounded-lg bg-gradient-to-br from-black via-purple-950 to-purple-900">
        <div className="animate-pulse h-10 w-72 bg-zinc-800/60 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="h-64 bg-zinc-800/60 rounded" />
          <div className="md:col-span-2 space-y-4">
            <div className="h-8 w-96 bg-zinc-800/60 rounded" />
            <div className="h-4 w-64 bg-zinc-800/60 rounded" />
            <div className="h-24 w-full bg-zinc-800/60 rounded" />
          </div>
        </div>
        <Toaster position="bottom-center" toastOptions={{ style: { background: "#111", color: "#fff", border: "1px solid #333" } }} />
      </div>
    );
  }

  if (isError || !song) {
    return (
      <div className="min-h-[90vh] my-15 p-6 rounded-lg mx-4 bg-gradient-to-br from-black via-purple-950 to-indigo-900">
        <button onClick={() => router.back()} className="text-white/90 hover:text-white">
          ← Back
        </button>
        <p className="text-white mt-6">
          Unable to load song: {(error as Error)?.message ?? "Not found"}
        </p>
        <Toaster position="bottom-center" toastOptions={{ style: { background: "#111", color: "#fff", border: "1px solid #333" } }} />
      </div>
    );
  }

  const durationSec = 263; // example (4:23)

  return (
    <div className="my-6 rounded-2xl overflow-hidden">
      {/* Toaster (global for this page) */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { background: "#0b0b0b", color: "#fff", border: "1px solid #2a2a2a" },
          success: { iconTheme: { primary: "#22c55e", secondary: "#0b0b0b" } },
        }}
      />

      {/* HEADER */}
      <div className="relative rounded-2xl bg-[radial-gradient(100%_100%_at_0%_0%,#7f1d1d_0%,#450a0a_35%,#1c1917_100%)] md:bg-gradient-to-b md:from-purple-800 md:to-zinc-900 text-white">
        <div className="p-6 md:p-8 lg:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className="w-40 h-40 md:w-56 md:h-56 rounded-md shadow-xl shrink-0 overflow-hidden">
            <Image
              src={song.cover_image_url}
              alt={`${song.title} cover`}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="uppercase text-sm tracking-wide text-white/80">Single</p>
            <h1 className="text-3xl md:text-6xl font-extrabold leading-tight mt-1">
              {song.title}
            </h1>
            <p className="mt-2 text-white/90 text-base md:text-lg">
              {song.artist}
              <span className="mx-2">•</span> {new Date(song.created_at).getFullYear()}
              <span className="mx-2">•</span> 1 song, {formatDuration(durationSec)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 md:px-8 lg:px-10 pb-6 md:pb-8">
          <div className="flex items-center gap-4">
            {/* BIG GREEN PLAY — toggles play/pause & keeps icon in sync */}
            <button
              onClick={() => {
                if (player) {
                  player.setQueue([song]);
                  player.setCurrentIndex(0);
                }
                slimRef.current?.toggle();
              }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 transition shadow-lg"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <FaPause className="text-black text-xl" />
              ) : (
                <FaPlay className="text-black text-xl translate-x-[1px]" />
              )}
            </button>

            <button
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition"
              title="Shuffle"
              aria-label="Shuffle"
            >
              <FaShuffle className="text-white text-lg" />
            </button>

            {/* ❤️ Wishlist toggle — first click adds & stays, second removes */}
            <button
              onClick={() => {
                if (liked === null) return; // unknown yet
                const next = !liked;        // first click from false -> true (add)
                toggleWishlist.mutate(next);
              }}
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full transition ${
                liked ? "bg-green-600" : "bg-zinc-800/80 hover:bg-zinc-700"
              }`}
              title={liked ? "Remove from wishlist" : "Add to wishlist"}
              aria-label="Like"
              disabled={!authUser || liked === null}
            >
              <FaHeart className="text-white text-lg" />
            </button>

            <a
              href={song.audio_url}
              download
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition"
              title="Download"
              aria-label="Download"
            >
              <FiDownload className="text-white text-lg" />
            </a>

            <button
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition"
              aria-label="More"
            >
              <BsThreeDots className="text-white text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Slim player (custom) */}
      <div className="px-4 md:px-2 pb-6">
        <SlimPlayer
          ref={slimRef}
          src={song.audio_url}
          cover={song.cover_image_url}
          title={song.title}
          artist={song.artist}
          autoPlay={false}
          onPlayChange={(p) => setPlaying(p)}
        />
      </div>

      {/* TABLE + META */}
      <div className="mt-4 rounded-2xl bg-gradient-to-b from-[#151515] to-transparent backdrop-blur border border-zinc-800/60">
        <div className="px-6 md:px-8 pt-4 pb-3 flex items-center justify-between text-zinc-300">
          <div className="flex items-center gap-8 text-sm">
            <span className="w-6 text-zinc-400">#</span>
            <span className="min-w-[180px]">Title</span>
          </div>
          <div className="flex items-center gap-12 text-sm">
            <span>Plays</span>
            <span className="w-8 text-right">⏱</span>
          </div>
        </div>

        <div className="px-6 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="w-6 text-zinc-400">1</span>
            <div>
              <p className="text-white font-medium">{song.title}</p>
              <p className="text-zinc-400 text-sm">{song.artist}</p>
            </div>
          </div>
          <div className="flex items-center gap-12">
            <span className="text-zinc-300">{formatCount(1_279_066)}</span>
            <span className="w-8 text-right text-zinc-300">
              {formatDuration(263)}
            </span>
          </div>
        </div>

        {/* Description block */}
        {song.description && (
          <div className="px-6 md:px-8 pt-1 pb-5">
            <div className="bg-black/30 border border-zinc-800/60 rounded-xl p-4 text-zinc-200 leading-relaxed">
              {song.description}
            </div>
          </div>
        )}

        {/* footer meta */}
        <div className="px-6 md:px-8 py-6 text-zinc-400 text-sm border-t border-zinc-800/60">
          {new Date(song.created_at).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          <br />© 2025 Your Label • ℗ 2025 Your Label
        </div>
      </div>

      {/* MORE BY ARTIST */}
      {moreByArtist && moreByArtist.length > 0 && (
        <section className="mt-8">
          <h3 className="text-white text-2xl font-bold mb-4">
            More by {song.artist}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {moreByArtist.map((s) => (
              <Link
                key={s.id}
                href={`/songs/${s.id}`}
                className="group rounded-lg overflow-hidden bg-black/40 border border-zinc-800/60 hover:bg-black/60 transition"
              >
                <div className="relative">
                  <Image
                    src={s.cover_image_url}
                    alt={`${s.title} cover`}
                    width={400}
                    height={400}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition">
                    <div className="w-10 h-10 rounded-full bg-green-500 grid place-items-center shadow">
                      <FaPlay className="text-black text-sm translate-x-[1px]" />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-white font-medium line-clamp-1">{s.title}</p>
                  <p className="text-zinc-400 text-sm line-clamp-1">{s.artist}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}