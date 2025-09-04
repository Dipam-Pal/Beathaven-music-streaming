"use client";

import Image from "next/image";
import Link from "next/link";
import { IoMdPlay } from "react-icons/io";
import { GoSearch } from "react-icons/go";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import supabase from "../../api/SupabaseClient";
import type { Song } from "../../types/song";

export default function AllSongs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"title_asc" | "title_desc" | "artist_asc" | "artist_desc">("title_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 10;

  const getAllSongs = async () => {
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .order("created_at", { ascending: false }); // newest first
    if (error) throw new Error(error.message);
    return data as Song[];
  };

  const { data: songs, isLoading, isError, error } = useQuery({
    queryKey: ["allSongs"],
    queryFn: getAllSongs,
  });

  const filteredAndSortedSongs = useMemo(() => {
    if (!songs) return [];
    const filtered = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filtered.sort((a, b) => {
      if (sortOption === "title_asc") return a.title.localeCompare(b.title);
      if (sortOption === "title_desc") return b.title.localeCompare(a.title);
      if (sortOption === "artist_asc") return a.artist.localeCompare(b.artist);
      if (sortOption === "artist_desc") return b.artist.localeCompare(a.artist);
      return 0;
    });
  }, [songs, searchQuery, sortOption]);

  const totalPages = Math.ceil(filteredAndSortedSongs.length / songsPerPage);
  const startIndex = (currentPage - 1) * songsPerPage;
  const currentSongs = filteredAndSortedSongs.slice(startIndex, startIndex + songsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-[90vh] bg-gradient-to-br from-black via-green-950 to-indigo-900 my-15 p-4 lg:ml-80 rounded-lg mx-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent mb-4">
          New Songs
        </h2>
        <div className="animate-pulse grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i}>
              <div className="w-full h-50 rounded-md mb-2 bg-hover" />
              <div className="h-3 w-[80%] bg-hover rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[90vh] bg-gradient-to-br from-black via-purple-950 to-indigo-900 my-15 p-4 lg:ml-80 rounded-lg mx-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent mb-4">
          New Songs
        </h2>
        <h2 className="text-center text-white text-2xl">{(error as Error).message}</h2>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-black via-purple-950 to-indigo-900 my-15 p-4 lg:ml-80 rounded-lg mx-4">
      <h2 className="text-4xl font-extrabold mb-8 text-white tracking-wide">New Songs</h2>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 p-4 bg-zinc-900/60 rounded-xl border border-zinc-700">
        <div className="flex-1 w-full flex items-center h-12 px-4 gap-2 bg-zinc-800/70 border border-zinc-700 text-primary-text rounded-full focus-within:ring-2 focus-within:ring-purple-500 transition duration-300">
          <GoSearch className="text-gray-400 shrink-0" size={20} />
          <input
            className="flex-1 h-full bg-transparent outline-none placeholder:text-gray-500 text-white text-base"
            type="text"
            placeholder="Search by artist or title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="w-full sm:w-auto">
          <select
            className="h-12 w-full bg-zinc-800/70 border border-zinc-700 text-white rounded-full px-4 text-base outline-none cursor-pointer transition duration-300 hover:border-purple-500"
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value as typeof sortOption);
              setCurrentPage(1);
            }}
          >
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
            <option value="artist_asc">Artist (A-Z)</option>
            <option value="artist_desc">Artist (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Songs Grid */}
      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {currentSongs.map((song) => (
          <Link
            href={`/songs/${song.id}`}
            key={song.id}
            className="relative bg-black/40 p-3 rounded-lg hover:scale-105 transition-transform duration-300 group shadow-lg"
          >
            <span className="bg-green-600/90 w-14 h-14 rounded-full grid place-items-center absolute bottom-8 opacity-0 right-5 group-hover:opacity-100 group-hover:bottom-16 transition-all duration-300 ease-in-out text-white text-3xl shadow-xl">
              <IoMdPlay />
            </span>
            <Image
              src={song.cover_image_url}
              alt={`${song.title} cover`}
              width={500}
              height={500}
              className="w-full h-48 object-cover rounded-md shadow-md"
            />
            <div className="mt-3">
              <p className="text-white font-semibold text-lg line-clamp-1">{song.title}</p>
              <p className="text-sm text-gray-400 line-clamp-1">By {song.artist}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-white disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
