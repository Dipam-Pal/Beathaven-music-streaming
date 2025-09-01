// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import supabase from "../../../api/SupabaseClient";
// import useUserSession from "../../../custom-hooks/useUserSession";

// export default function Page() {
//   const router = useRouter();
//   const [title, setTitle] = useState("");
//   const [artist, setArtist] = useState("");
//   const [audioFile, setAudioFile] = useState<File | null>(null);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);
//   const { session } = useUserSession();

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data }) => {
//       if (!data.session) {
//         router.push("/");
//       } else {
//         setPageLoading(false);
//       }
//     });
//   }, []);

//   const handleUpload = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     if (!title.trim() || !artist.trim() || !audioFile || !imageFile) {
//       setMessage("All fields are required!");
//       setLoading(false);
//       return;
//     }

//     try {
//       // upload the song
//       const timestamp = Data.now();

//       // upload the image
//       const imagePath = `/${timestamp}_${imageFile.name}`;
//       // const {} = await supabase.storage;
//       const { error: imgError } = await supabase.storage
//         .from("cover-images")
//         .upload(imagePath, imageFile);

//       if (imgError) {
//         setMessage(imgError.message);
//         setLoading(false);
//         return;
//       }
//       const {
//         data: { publicUrl: imageURL },
//       } = supabase.storage.from("cover-images").getPublicUrl(imagePath);

//       //upload audio
//       const audioPath = `/${timestamp}_${audioFile.name}`;
//       const { error: audioError } = await supabase.storage
//         .from("songs")
//         .upload(audioPath, audioFile);

//       if (audioError) {
//         setMessage(audioError.message);
//         setLoading(false);
//         return;
//       }

//       const {
//         data: { publicUrl: audioURL },
//       } = supabase.storage.from("songs").getPublicUrl(audioPath);

//       //save songs to supabase table
//       const { error: insertError } = await supabase.from("songs").insert({
//         title,
//         artist,
//         cover_image_url: imageURL,
//         audio_url: audioPath,
//         user_id: session?.user.id,
//       });

//       if (insertError) {
//         setMessage(insertError.message);
//         setLoading(false);
//         return;
//       }

//       setTitle("");
//       setArtist("");
//       setImageFile(null);
//       setAudioFile(null);
//       setMessage("Song uploaded successfully");
//       setTimeout(() => {
//         router.push("/");
//       }, 3000);

//     } catch (err) {
//       console.log("Catched Error", err);
//     }
//   };

//   if (pageLoading) return null;

//   return (
//     <div className="h-screen flex justify-center items-center w-full bg-gradient-to-br from-black via-gray-900 to-black">
//       <div className="bg-gray-950 flex flex-col items-center px-6 lg:px-12 py-10 rounded-2xl max-w-[420px] w-[90%] shadow-2xl border border-gray-800">
//         <h1 className="text-4xl font-extrabold mb-6 tracking-wide">
//           <span className="text-purple-500">Beat</span>
//           <span className="text-white">Haven</span>
//         </h1>

//         <h2 className="text-white text-lg mb-6 font-semibold tracking-wide">
//           Upload To BeatHaven
//         </h2>

//         <form className="flex flex-col gap-5 w-full" onSubmit={handleUpload}>
//           {message && (
//             <p className="bg-purple-600/20 text-purple-400 font-medium text-center mb-2 py-2 rounded-md border border-purple-600">
//               {message}
//             </p>
//           )}

//           <input
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             type="text"
//             placeholder="Title"
//             className="w-full px-4 py-3 rounded-lg bg-black/70 text-white placeholder-gray-400 outline-none border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition"
//           />

//           <input
//             value={artist}
//             onChange={(e) => setArtist(e.target.value)}
//             type="text"
//             placeholder="Artist"
//             className="w-full px-4 py-3 rounded-lg bg-black/70 text-white placeholder-gray-400 outline-none border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition"
//           />

//           <label htmlFor="audio" className="text-gray-400 text-sm font-medium">
//             Audio File
//           </label>
//           <input
//             accept="audio/*"
//             id="audio"
//             type="file"
//             onChange={(e) => {
//               const files = e.target.files;
//               if (!files) return;
//               const file = files[0];
//               setAudioFile(file);
//             }}
//             className="w-full px-4 py-3 rounded-lg bg-black/70 text-white file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 outline-none border border-gray-700 focus:border-purple-500 transition"
//           />

//           <label htmlFor="cover" className="text-gray-400 text-sm font-medium">
//             Cover Image
//           </label>
//           <input
//             accept="images/*"
//             id="cover"
//             type="file"
//             onChange={(e) => {
//               const files = e.target.files;
//               if (!files) return;
//               const file = files[0];
//               setImageFile(file);
//             }}
//             className="w-full px-4 py-3 rounded-lg bg-black/70 text-white file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 outline-none border border-gray-700 focus:border-purple-500 transition"
//           />

//           <button
//             type="submit"
//             className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-white transition transform hover:scale-[1.02] shadow-lg"
//           >
//             Add Songs
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "../../../api/SupabaseClient";
import useUserSession from "../../../custom-hooks/useUserSession";

export default function Page() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { session } = useUserSession();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/");
      } else {
        setPageLoading(false);
      }
    });
  }, [router]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title.trim() || !artist.trim() || !audioFile || !imageFile) {
      setMessage("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      // upload the song
      const timestamp = Date.now();

      // upload the image
      const imagePath = `/${timestamp}_${imageFile.name}`;
      const { error: imgError } = await supabase.storage
        .from("cover-images")
        .upload(imagePath, imageFile);

      if (imgError) {
        setMessage(imgError.message);
        setLoading(false);
        return;
      }
      const {
        data: { publicUrl: imageURL },
      } = supabase.storage.from("cover-images").getPublicUrl(imagePath);

      //upload audio
      const audioPath = `/${timestamp}_${audioFile.name}`;
      const { error: audioError } = await supabase.storage
        .from("songs")
        .upload(audioPath, audioFile);

      if (audioError) {
        setMessage(audioError.message);
        setLoading(false);
        return;
      }

      const {
        data: { publicUrl: audioURL },
      } = supabase.storage.from("songs").getPublicUrl(audioPath);

      //save songs to supabase table
      const { error: insertError } = await supabase.from("songs").insert({
        title,
        artist,
        cover_image_url: imageURL,
        audio_url: audioURL,
        user_id: session?.user.id,
      });

      if (insertError) {
        setMessage(insertError.message);
        setLoading(false);
        return;
      }

      setTitle("");
      setArtist("");
      setImageFile(null);
      setAudioFile(null);
      setMessage("Song uploaded successfully");
      setTimeout(() => {
        router.push("/");
      }, 3000);

    } catch (err) {
      console.log("Catched Error", err);
    }
  };

  if (pageLoading) return null;

  return (
    <div className="h-screen flex justify-center items-center w-full bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="bg-gray-950 flex flex-col items-center px-6 lg:px-12 py-10 rounded-2xl max-w-[420px] w-[90%] shadow-2xl border border-gray-800">
        <h1 className="text-4xl font-extrabold mb-6 tracking-wide">
          <span className="text-purple-500">Beat</span>
          <span className="text-white">Haven</span>
        </h1>

        <h2 className="text-white text-lg mb-6 font-semibold tracking-wide">
          Upload To BeatHaven
        </h2>

        <form className="flex flex-col gap-5 w-full" onSubmit={handleUpload}>
          {message && (
            <p className="bg-purple-600/20 text-purple-400 font-medium text-center mb-2 py-2 rounded-md border border-purple-600">
              {message}
            </p>
          )}

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Title"
            className="w-full px-4 py-3 rounded-lg bg-black/70 text-white placeholder-gray-400 outline-none border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition"
          />

          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            type="text"
            placeholder="Artist"
            className="w-full px-4 py-3 rounded-lg bg-black/70 text-white placeholder-gray-400 outline-none border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition"
          />

          <label htmlFor="audio" className="text-gray-400 text-sm font-medium">
            Audio File
          </label>
          <input
            accept="audio/*"
            id="audio"
            type="file"
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;
              const file = files[0];
              setAudioFile(file);
            }}
            className="w-full px-4 py-3 rounded-lg bg-black/70 text-white file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 outline-none border border-gray-700 focus:border-purple-500 transition"
          />

          <label htmlFor="cover" className="text-gray-400 text-sm font-medium">
            Cover Image
          </label>
          <input
            accept="image/*"
            id="cover"
            type="file"
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;
              const file = files[0];
              setImageFile(file);
            }}
            className="w-full px-4 py-3 rounded-lg bg-black/70 text-white file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 outline-none border border-gray-700 focus:border-purple-500 transition"
          />

          {loading ? (
            <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-white transition transform hover:scale-[1.02] shadow-lg"
          >
          Uploading...
          </button>
          ) : (
            <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-white transition transform hover:scale-[1.02] shadow-lg"
          >
            Add Songs
          </button>
          )}
        </form>
      </div>
    </div>
  );
}

