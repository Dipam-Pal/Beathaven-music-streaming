// 'use client';
// import { useEffect, useMemo, useRef, useState } from 'react';
// import supabase from '../../../../api/SupabaseClient';
// import { motion } from 'framer-motion';
// import Image from 'next/image';

// type Role = 'admin' | 'user';

// type Profile = {
//   id: string;
//   email: string | null;
//   display_name: string | null;
//   role: Role;
//   created_at?: string;
// };

// type Song = {
//   id: number;
//   title: string;
//   artist: string;
//   cover_image_url: string;
//   audio_url: string;
//   created_at?: string;
// };

// export default function AdminPage() {
//   const [me, setMe] = useState<Profile | null>(null);
//   const [songs, setSongs] = useState<Song[]>([]);
//   const [users, setUsers] = useState<Profile[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [busy, setBusy] = useState(false);
//   const [msg, setMsg] = useState('');

//   const titleRef = useRef<HTMLInputElement>(null);
//   const artistRef = useRef<HTMLInputElement>(null);
//   const audioRef = useRef<HTMLInputElement>(null);
//   const coverRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     (async () => {
//       const { data: auth } = await supabase.auth.getUser();
//       if (!auth.user) {
//         setLoading(false);
//         return;
//       }
//       const { data: prof } = await supabase
//         .from('profiles')
//         .select('id,email,display_name,role,created_at')
//         .eq('id', auth.user.id)
//         .maybeSingle();
//       if (prof) setMe(prof as Profile);
//       await Promise.all([loadSongs(), loadUsers()]);
//       setLoading(false);
//     })();
//   }, []);

//   const isAdmin = useMemo(() => me?.role === 'admin', [me]);

//   async function loadSongs() {
//     const { data } = await supabase.from('songs').select('*').order('created_at', { ascending: false });
//     if (data) setSongs(data as Song[]);
//   }

//   async function loadUsers() {
//     const { data } = await supabase.from('profiles').select('id,email,display_name,role,created_at').order('created_at', { ascending: false });
//     if (data) setUsers(data as Profile[]);
//   }

//   async function uploadTo(bucket: 'songs' | 'cover-images', file: File) {
//     const ext = file.name.split('.').pop();
//     const path = `${crypto.randomUUID()}.${ext}`;
//     const { error } = await supabase.storage.from(bucket).upload(path, file, {
//       cacheControl: '3600',
//       upsert: false,
//     });
//     if (error) throw error;
//     const { data } = supabase.storage.from(bucket).getPublicUrl(path);
//     return data.publicUrl;
//   }

//   async function handleAddSong(e: React.FormEvent) {
//     e.preventDefault();
//     if (!isAdmin) return;
//     setBusy(true); setMsg('');
//     try {
//       const title = titleRef.current?.value?.trim() || '';
//       const artist = artistRef.current?.value?.trim() || '';
//       const audioFile = audioRef.current?.files?.[0];
//       const coverFile = coverRef.current?.files?.[0];
//       if (!title || !artist || !audioFile || !coverFile) throw new Error('Title, Artist, Audio, and Cover are required.');
//       const audio_url = await uploadTo('songs', audioFile);
//       const cover_image_url = await uploadTo('cover-images', coverFile);
//       const { error } = await supabase.from('songs').insert({ title, artist, audio_url, cover_image_url });
//       if (error) throw error;
//       if (titleRef.current) titleRef.current.value = '';
//       if (artistRef.current) artistRef.current.value = '';
//       if (audioRef.current) audioRef.current.value = '';
//       if (coverRef.current) coverRef.current.value = '';
//       setMsg('Song added');
//       await loadSongs();
//     } catch (err: any) {
//       setMsg(err.message || 'Failed to add song');
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function handleDeleteSong(id: number) {
//     if (!isAdmin) return;
//     setBusy(true); setMsg('');
//     try {
//       const { error } = await supabase.from('songs').delete().eq('id', id);
//       if (error) throw error;
//       setMsg('Song deleted');
//       await loadSongs();
//     } catch (err: any) {
//       setMsg(err.message || 'Failed to delete song');
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function setUserRole(userId: string, role: Role) {
//     if (!isAdmin) return;
//     setBusy(true); setMsg('');
//     try {
//       const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
//       if (error) throw error;
//       setMsg('Role updated');
//       await loadUsers();
//     } catch (err: any) {
//       setMsg(err.message || 'Failed to update role');
//     } finally {
//       setBusy(false);
//     }
//   }

//   if (loading) return <p className="p-6 text-white">Loading…</p>;
//   if (!me) return <p className="p-6 text-white">Please sign in to access the admin dashboard.</p>;
//   if (!isAdmin) return <p className="p-6 text-white">You’re signed in as <b>{me.email}</b> but not an admin.</p>;

//   return (
//     <main className="min-h-screen bg-gradient-to-b from-[#140020] via-[#230043] to-[#1a0035] text-white">
//       <section className="mx-auto max-w-6xl p-6 space-y-10">
//         <header className="flex items-center justify-between">
//           <div>
//             <h1 className="text-xl sm:text-3xl font-extrabold tracking-wide text-purple-500">
//               Beat<span className="text-white">Haven</span>
//             </h1>
//             <p className="text-sm text-gray-400">Premium dashboard — manage songs & roles</p>
//           </div>
//         </header>

//         {msg && (
//           <motion.div
//             initial={{ opacity: 0, y: -8 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="rounded-xl border border-purple-600 bg-purple-900/30 px-4 py-2 text-sm text-purple-200 shadow-lg"
//           >
//             {msg}
//           </motion.div>
//         )}

//         <motion.form
//           onSubmit={handleAddSong}
//           className="grid grid-cols-1 gap-4 rounded-2xl bg-[#1e0035]/60 border border-purple-700 p-6 shadow-xl backdrop-blur-md md:grid-cols-2"
//           initial={{ opacity: 0, y: 8 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <h2 className="col-span-1 md:col-span-2 text-xl font-semibold text-purple-300">Add a new song</h2>
//           <input ref={titleRef} placeholder="Title" className="rounded-lg border border-purple-600 bg-transparent px-3 py-2 text-white placeholder-gray-400 focus:border-pink-500 outline-none" />
//           <input ref={artistRef} placeholder="Artist" className="rounded-lg border border-purple-600 bg-transparent px-3 py-2 text-white placeholder-gray-400 focus:border-pink-500 outline-none" />
//           <div className="flex flex-col gap-1">
//             <label className="text-sm text-gray-400">Audio (mp3/m4a)</label>
//             <input ref={audioRef} type="file" accept="audio/*" className="rounded-lg border border-purple-600 bg-transparent px-3 py-2 text-white" />
//           </div>
//           <div className="flex flex-col gap-1">
//             <label className="text-sm text-gray-400">Cover image</label>
//             <input ref={coverRef} type="file" accept="image/*" className="rounded-lg border border-purple-600 bg-transparent px-3 py-2 text-white" />
//           </div>
//           <div className="col-span-1 md:col-span-2">
//             <button
//               disabled={busy}
//               className="w-full rounded-lg bg-gradient-to-r from-pink-600 to-purple-700 px-4 py-2 font-bold text-white hover:from-pink-500 hover:to-purple-600 disabled:opacity-50"
//             >
//               {busy ? 'Working…' : 'Add Song'}
//             </button>
//           </div>
//         </motion.form>

//         {/* Songs Section */}
//         <section>
//           <h2 className="mb-4 text-xl font-semibold text-purple-300">Songs</h2>
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
//             {songs.map((s) => (
//               <motion.div
//                 key={s.id}
//                 whileHover={{ scale: 1.02 }}
//                 className="rounded-2xl bg-[#2a0045]/70 border border-purple-700 shadow-md overflow-hidden"
//               >
//                 <div className="relative h-40 w-full">
//                   <Image
//                     src={s.cover_image_url}
//                     alt={s.title}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <div className="p-4 flex flex-col gap-1">
//                   <h3 className="font-bold text-lg">{s.title}</h3>
//                   <p className="text-sm text-gray-400">{s.artist}</p>
//                   <div className="mt-2 flex justify-between items-center">
//                     <a href={s.audio_url} target="_blank" rel="noreferrer" className="text-pink-400 hover:underline text-sm">Play</a>
//                     <button
//                       onClick={() => handleDeleteSong(s.id)}
//                       className="text-red-400 hover:text-red-300 text-sm"
//                       disabled={busy}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//             {songs.length === 0 && <p className="text-gray-500">No songs yet.</p>}
//           </div>
//         </section>

//         {/* Users Section */}
//         <section>
//           <h2 className="mb-4 text-xl font-semibold text-purple-300">Users & Roles</h2>
//           <div className="overflow-hidden rounded-2xl border border-purple-700 bg-[#2a0045]/70 shadow-md">
//             <table className="min-w-full text-sm">
//               <thead className="bg-purple-900/40">
//                 <tr>
//                   <th className="px-3 py-2 text-left">Email</th>
//                   <th className="px-3 py-2 text-left">Display Name</th>
//                   <th className="px-3 py-2 text-left">Role</th>
//                   <th className="px-3 py-2"></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((u) => (
//                   <tr key={u.id} className="border-t border-purple-800/50">
//                     <td className="px-3 py-2">{u.email}</td>
//                     <td className="px-3 py-2">{u.display_name ?? '-'}</td>
//                     <td className="px-3 py-2">{u.role}</td>
//                     <td className="px-3 py-2 text-right">
//                       <div className="inline-flex gap-2">
//                         <button
//                           onClick={() => setUserRole(u.id, 'user')}
//                           className="rounded-lg border border-purple-600 px-2 py-1 text-xs hover:bg-purple-800"
//                           disabled={busy || u.role === 'user'}
//                         >
//                           Make user
//                         </button>
//                         <button
//                           onClick={() => setUserRole(u.id, 'admin')}
//                           className="rounded-lg border border-pink-600 px-2 py-1 text-xs hover:bg-pink-800"
//                           disabled={busy || u.role === 'admin'}
//                         >
//                           Make admin
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//                 {users.length === 0 && (
//                   <tr><td className="px-3 py-4 text-gray-500" colSpan={4}>No users yet.</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </section>
//     </main>
//   );
// }

'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import supabase from '../../../../api/SupabaseClient';
import { motion } from 'framer-motion';
import Image from 'next/image';

type Role = 'admin' | 'user';

type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: Role;
  created_at?: string;
};

type Song = {
  id: number;
  title: string;
  artist: string;
  cover_image_url: string;
  audio_url: string;
  created_at?: string;
};

export default function AdminPage() {
  const [me, setMe] = useState<Profile | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const titleRef = useRef<HTMLInputElement>(null);
  const artistRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        setLoading(false);
        return;
      }
      const { data: prof } = await supabase
        .from('profiles')
        .select('id,email,display_name,role,created_at')
        .eq('id', auth.user.id)
        .maybeSingle();
      if (prof) setMe(prof as Profile);
      await Promise.all([loadSongs(), loadUsers()]);
      setLoading(false);
    })();
  }, []);

  const isAdmin = useMemo(() => me?.role === 'admin', [me]);

  async function loadSongs() {
    const { data } = await supabase.from('songs').select('*').order('created_at', { ascending: false });
    if (data) setSongs(data as Song[]);
  }

  async function loadUsers() {
    const { data } = await supabase.from('profiles').select('id,email,display_name,role,created_at').order('created_at', { ascending: false });
    if (data) setUsers(data as Profile[]);
  }

  async function uploadTo(bucket: 'songs' | 'cover-images', file: File) {
    const ext = file.name.split('.').pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleAddSong(e: React.FormEvent) {
    e.preventDefault();
    if (!isAdmin) return;
    setBusy(true); setMsg('');
    try {
      const title = titleRef.current?.value?.trim() || '';
      const artist = artistRef.current?.value?.trim() || '';
      const audioFile = audioRef.current?.files?.[0];
      const coverFile = coverRef.current?.files?.[0];
      if (!title || !artist || !audioFile || !coverFile) throw new Error('Title, Artist, Audio, and Cover are required.');
      const audio_url = await uploadTo('songs', audioFile);
      const cover_image_url = await uploadTo('cover-images', coverFile);
      const { error } = await supabase.from('songs').insert({ title, artist, audio_url, cover_image_url });
      if (error) throw error;
      if (titleRef.current) titleRef.current.value = '';
      if (artistRef.current) artistRef.current.value = '';
      if (audioRef.current) audioRef.current.value = '';
      if (coverRef.current) coverRef.current.value = '';
      setMsg('Song added');
      await loadSongs();
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : 'Failed to add song');
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteSong(id: number) {
    if (!isAdmin) return;
    setBusy(true); setMsg('');
    try {
      const { error } = await supabase.from('songs').delete().eq('id', id);
      if (error) throw error;
      setMsg('Song deleted');
      await loadSongs();
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : 'Failed to delete song');
    } finally {
      setBusy(false);
    }
  }

  async function setUserRole(userId: string, role: Role) {
    if (!isAdmin) return;
    setBusy(true); setMsg('');
    try {
      const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
      if (error) throw error;
      setMsg('Role updated');
      await loadUsers();
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="p-6 text-white">Loading…</p>;
  if (!me) return <p className="p-6 text-white">Please sign in to access the admin dashboard.</p>;
  if (!isAdmin) return <p className="p-6 text-white">You’re signed in as <b>{me.email}</b> but not an admin.</p>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#140020] via-[#230043] to-[#1a0035] text-white">
      <section className="mx-auto max-w-6xl p-6 space-y-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-wide text-purple-500">
              Beat<span className="text-white">Haven</span>
            </h1>
            <p className="text-sm text-gray-400">Premium dashboard — manage songs & roles</p>
          </div>
        </header>

        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-purple-600 bg-purple-900/30 px-4 py-2 text-sm text-purple-200 shadow-lg"
          >
            {msg}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleAddSong}
          className="grid grid-cols-1 gap-4 rounded-2xl bg-[#1e0035]/60 border border-purple-700 p-6 shadow-xl backdrop-blur-md md:grid-cols-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="col-span-1 md:col-span-2 text-xl font-semibold text-purple-300">Add a new song</h2>
          <input ref={titleRef} placeholder="Title" className="rounded-lg border border-purple-600 bg-transparent px-3 py-2 text-white placeholder-gray-400 focus:border-pink-500 outline-none" />
          <input ref={artistRef} placeholder="Artist" className="rounded-lg border border-purple-600 bg-transparent px-3 py-2 text-white placeholder-gray-400 focus:border-pink-500 outline-none" />
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">Audio (mp3/m4a)</label>
            <input ref={audioRef} type="file" accept="audio/*" className="rounded-lg border border-purple-600 bg-transparent px-3 py-2 text-white" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">Cover image</label>
            <input ref={coverRef} type="file" accept="image/*" className="rounded-lg border border-purple-600 bg-transparent px-3 py-2 text-white" />
          </div>
          <div className="col-span-1 md:col-span-2">
            <button
              disabled={busy}
              className="w-full rounded-lg bg-gradient-to-r from-pink-600 to-purple-700 px-4 py-2 font-bold text-white hover:from-pink-500 hover:to-purple-600 disabled:opacity-50"
            >
              {busy ? 'Working…' : 'Add Song'}
            </button>
          </div>
        </motion.form>

        {/* Songs Section */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-purple-300">Songs</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {songs.map((s) => (
              <motion.div
                key={s.id}
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl bg-[#2a0045]/70 border border-purple-700 shadow-md overflow-hidden"
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={s.cover_image_url}
                    alt={s.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col gap-1">
                  <h3 className="font-bold text-lg">{s.title}</h3>
                  <p className="text-sm text-gray-400">{s.artist}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <a href={s.audio_url} target="_blank" rel="noreferrer" className="text-pink-400 hover:underline text-sm">Play</a>
                    <button
                      onClick={() => handleDeleteSong(s.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                      disabled={busy}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {songs.length === 0 && <p className="text-gray-500">No songs yet.</p>}
          </div>
        </section>

        {/* Users Section */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-purple-300">Users & Roles</h2>
          <div className="overflow-hidden rounded-2xl border border-purple-700 bg-[#2a0045]/70 shadow-md">
            <table className="min-w-full text-sm">
              <thead className="bg-purple-900/40">
                <tr>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Display Name</th>
                  <th className="px-3 py-2 text-left">Role</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-purple-800/50">
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2">{u.display_name ?? '-'}</td>
                    <td className="px-3 py-2">{u.role}</td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => setUserRole(u.id, 'user')}
                          className="rounded-lg border border-purple-600 px-2 py-1 text-xs hover:bg-purple-800"
                          disabled={busy || u.role === 'user'}
                        >
                          Make user
                        </button>
                        <button
                          onClick={() => setUserRole(u.id, 'admin')}
                          className="rounded-lg border border-pink-600 px-2 py-1 text-xs hover:bg-pink-800"
                          disabled={busy || u.role === 'admin'}
                        >
                          Make admin
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td className="px-3 py-4 text-gray-500" colSpan={4}>No users yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}