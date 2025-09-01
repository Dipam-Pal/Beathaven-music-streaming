// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import loginUser from "../../../api/auth/loginUser";
// import { useRouter } from "next/navigation";
// import supabase from "../../../api/SupabaseClient";

// export default function Page() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//     const [loading, setLoading] = useState(true);
    
  
//     useEffect(() => {
//       supabase.auth.getSession().then(({ data }) => {
//         if (data.session) {
//           router.push("/");
//         } else {
//           setLoading(false);
//         }
//       });
//     }, [router]);

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email.trim() || !password.trim()) {
//       setMessage("All fields are required!");
//       return;
//     }

//     const result = await loginUser(email, password);

//     if (result?.error) {
//       setMessage(result.error);
//     } else {
//       setMessage("Login Successful");
//       setTimeout(() => {
//         router.push("/");
//       }, 3000);
//     }
//   };
   
//   if(loading) return null;
//   return (
//     <div className="h-screen flex justify-center items-center w-full bg-black">
//       <div className="bg-gray-900 flex flex-col items-center px-6 lg:px-12 py-8 rounded-md max-w-[400px] w-[90%] shadow-lg">
//         <h1 className="text-4xl font-extrabold mb-6">
//           <span className="text-purple-500">Beat</span>
//           <span className="text-white">Haven</span>
//         </h1>

//         <form className="flex flex-col gap-4 w-full" onSubmit={handleSignup}>
//           {message && (
//             <p className="bg-primary font-semibold text-center mb-4 py-1">
//               {message}
//             </p>
//           )}
//           <input
//             onChange={(e) => setEmail(e.target.value)}
//             value={email}
//             type="text"
//             placeholder="Your Email"
//             className="w-full px-4 py-2 rounded-md bg-black text-white outline-none border border-gray-700 focus:border-purple-500"
//           />
//           <input
//             onChange={(e) => setPassword(e.target.value)}
//             value={password}
//             type="password"
//             placeholder="Password"
//             className="w-full px-4 py-2 rounded-md bg-black text-white outline-none border border-gray-700 focus:border-purple-500"
//           />
//           <button
//             type="submit"
//             className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-bold text-white transition"
//           >
//             Login
//           </button>
//         </form>

//         <div className="text-secondary-text text-center my-6">
//           <span>Don&apos;t have an account?</span>
//           <Link
//             href="signup"
//             className="ml-2 text-white underline hover:text-primary"
//           >
//             Sign up now
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import loginUser from "../../../api/auth/loginUser";
import supabase from "../../../api/SupabaseClient";
import toast, { Toaster } from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Check for existing session on component load
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/");
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  // Handle form submission for login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setMessage("All fields are required!");
      setLoading(false);
      return;
    }

    const result = await loginUser(email, password);

    if (result?.error) {
      setMessage(result.error);
    } else {
      toast.success("Login Successful. Welcome to BeatHaven!");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
    setLoading(false);
  };

  if (loading) return null;

  return (
    <div className="h-screen flex justify-center items-center w-full bg-gradient-to-br from-black via-purple-950 to-indigo-900 p-4">
      <Toaster position="top-center" /> 
      
      <div 
        // FIX: Card-er bhitore color change kora holo
        className="bg-gradient-to-br from-zinc-800 to-zinc-950 flex flex-col items-center px-6 lg:px-12 py-10 rounded-xl max-w-[420px] w-full shadow-2xl border border-zinc-700/60"
      >
        <h1 className="text-4xl font-extrabold mb-8 text-center">
          <span className="text-purple-500">Beat</span>
          <span className="text-white">Haven</span>
        </h1>

        <form className="flex flex-col gap-6 w-full" onSubmit={handleLogin}>
          {message && (
            <p className="bg-purple-600 font-semibold text-white text-center rounded-md py-2 px-4 animate-fadeIn">
              {message}
            </p>
          )}
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="text"
            placeholder="Your Email"
            className="w-full px-5 py-3 rounded-lg bg-zinc-700 text-white outline-none border border-zinc-600 focus:border-purple-500 transition-all duration-300 placeholder:text-gray-400"
            disabled={loading}
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            className="w-full px-5 py-3 rounded-lg bg-zinc-700 text-white outline-none border border-zinc-600 focus:border-purple-500 transition-all duration-300 placeholder:text-gray-400"
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-white transition-all duration-300 shadow-lg"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-gray-400 text-center mt-8">
          <span>Don&apos;t have an account?</span>
          <Link
            href="signup"
            className="ml-2 text-purple-400 underline hover:text-purple-600 transition"
          >
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}