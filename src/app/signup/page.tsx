// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import supabase from "../../../api/SupabaseClient";

// export default function Page() {
//   const router = useRouter();

//   const [name, setName] = useState("");        // collected now; see note above
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   // If already signed in, bounce to home
//   useEffect(() => {
//     supabase.auth.getSession().then(({ data }) => {
//       if (data.session) {
//         router.push("/");
//       } else {
//         setLoading(false);
//       }
//     });
//   }, [router]);

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage("");

//     if (!name.trim() || !email.trim() || !password.trim()) {
//       setMessage("All fields are required!");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       // Create auth user (the DB trigger will create profiles row with role='user')
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//         // You can stash the name in user_metadata for now; we’ll map it later if desired
//         options: {
//           data: { display_name: name },
//           emailRedirectTo:
//             typeof window !== "undefined"
//               ? `${window.location.origin}/auth/callback`
//               : undefined,
//         },
//       });

//       if (error) {
//         setMessage(error.message);
//         setSubmitting(false);
//         return;
//       }

//       // If email confirmation is ON, Supabase will send a verification email.
//       // You can either wait for confirm or allow immediate session depending on your project settings.
//       setMessage(
//         data.session
//           ? "Signup successful!"
//           : "Signup successful! Please check your email to verify your account."
//       );

//       // Small delay for UX then redirect
//       setTimeout(() => {
//         router.push("/");
//       }, 1200);
//     } catch (err: any) {
//       setMessage(err?.message ?? "Something went wrong during signup.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return null;

//   return (
//     <div className="h-screen flex justify-center items-center w-full bg-black">
//       <div className="bg-gray-900 flex flex-col items-center px-6 lg:px-12 py-8 rounded-md max-w-[400px] w-[90%] shadow-lg">
//         <h1 className="text-4xl font-extrabold mb-6">
//           <span className="text-purple-500">Beat</span>
//           <span className="text-white">Haven</span>
//         </h1>

//         <form className="flex flex-col gap-4 w-full" onSubmit={handleSignup}>
//           {message && (
//             <p className="bg-purple-600/20 text-purple-200 border border-purple-600 rounded-md font-semibold text-center mb-2 py-2 px-3">
//               {message}
//             </p>
//           )}

//           <input
//             onChange={(e) => setName(e.target.value)}
//             value={name}
//             type="text"
//             placeholder="Your Name"
//             className="w-full px-4 py-2 rounded-md bg-black text-white outline-none border border-gray-700 focus:border-purple-500"
//           />

//           <input
//             onChange={(e) => setEmail(e.target.value)}
//             value={email}
//             type="email"
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
//             disabled={submitting}
//             className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-bold text-white transition disabled:opacity-60"
//           >
//             {submitting ? "Creating account…" : "Signup"}
//           </button>
//         </form>

//         <div className="text-secondary-text text-center my-6 text-gray-300">
//           <span>Already have an account?</span>
//           <Link
//             href="/login"
//             className="ml-2 text-white underline hover:text-purple-400"
//           >
//             Sign in now
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import supabase from "../../../api/SupabaseClient";
// import toast, { Toaster } from "react-hot-toast"; // FIX: Toast library import kora holo

// export default function Page() {
//   const router = useRouter();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   // If already signed in, bounce to home
//   useEffect(() => {
//     supabase.auth.getSession().then(({ data }) => {
//       if (data.session) {
//         router.push("/");
//       } else {
//         setLoading(false);
//       }
//     });
//   }, [router]);

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage("");

//     if (!name.trim() || !email.trim() || !password.trim()) {
//       setMessage("All fields are required!");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: { display_name: name },
//           emailRedirectTo:
//             typeof window !== "undefined"
//               ? `${window.location.origin}/auth/callback`
//               : undefined,
//         },
//       });

//       if (error) {
//         setMessage(error.message);
//         setSubmitting(false);
//         return;
//       }

//       // FIX: Successful signup-er por toast message dekhano holo
//       if (data.session) {
//         toast.success("Registration successful!");
//         setTimeout(() => {
//           router.push("/login"); // FIX: Login page-e redirect kora holo
//         }, 1500); // FIX: Redirect delay barano holo jate toast dekha jay
//       } else {
//         toast.success("Signup successful! Please check your email to verify your account.");
//       }
      
//     } catch (err: any) {
//       setMessage(err?.message ?? "Something went wrong during signup.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return null;

//   return (
//     // FIX: Background color gradient add kora holo
//     <div className="h-screen flex justify-center items-center w-full bg-gradient-to-br from-black via-purple-950 to-indigo-900 p-4">
//       {/* FIX: Toast component add kora holo */}
//       <Toaster position="top-center" /> 

//       {/* FIX: Card-er background-e gradient add kora holo ebong padding, rounding barano holo */}
//       <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 flex flex-col items-center px-6 lg:px-12 py-10 rounded-xl max-w-[420px] w-full shadow-2xl border border-zinc-700/60">
//         <h1 className="text-4xl font-extrabold mb-8 text-center">
//           <span className="text-purple-500">Beat</span>
//           <span className="text-white">Haven</span>
//         </h1>

//         <form className="flex flex-col gap-6 w-full" onSubmit={handleSignup}>
//           {message && (
//             <p className="bg-purple-600/20 text-purple-200 border border-purple-600 rounded-md font-semibold text-center py-2 px-3 animate-fadeIn">
//               {message}
//             </p>
//           )}

//           <input
//             onChange={(e) => setName(e.target.value)}
//             value={name}
//             type="text"
//             placeholder="Your Name"
//             className="w-full px-5 py-3 rounded-lg bg-zinc-700 text-white outline-none border border-zinc-600 focus:border-purple-500 transition-all duration-300 placeholder:text-gray-400"
//             disabled={submitting}
//           />

//           <input
//             onChange={(e) => setEmail(e.target.value)}
//             value={email}
//             type="email"
//             placeholder="Your Email"
//             className="w-full px-5 py-3 rounded-lg bg-zinc-700 text-white outline-none border border-zinc-600 focus:border-purple-500 transition-all duration-300 placeholder:text-gray-400"
//             disabled={submitting}
//           />

//           <input
//             onChange={(e) => setPassword(e.target.value)}
//             value={password}
//             type="password"
//             placeholder="Password"
//             className="w-full px-5 py-3 rounded-lg bg-zinc-700 text-white outline-none border border-zinc-600 focus:border-purple-500 transition-all duration-300 placeholder:text-gray-400"
//             disabled={submitting}
//           />

//           <button
//             type="submit"
//             disabled={submitting}
//             className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-white transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
//           >
//             {submitting ? "Creating account…" : "Signup"}
//           </button>
//         </form>

//         <div className="text-gray-400 text-center mt-8">
//           <span>Already have an account?</span>
//           <Link
//             href="/login"
//             className="ml-2 text-purple-400 underline hover:text-purple-600 transition"
//           >
//             Sign in now
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "../../../api/SupabaseClient";
import toast, { Toaster } from "react-hot-toast";

export default function Page() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // If already signed in, bounce to home
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.push("/");
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage("All fields are required!");
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name },
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback`
              : undefined,
        },
      });

      if (error) {
        setMessage(error.message);
        setSubmitting(false);
        return;
      }

      if (data.session) {
        toast.success("Registration successful!");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast.success("Signup successful! Please check your email to verify your account.");
      }
      
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Something went wrong during signup.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="h-screen flex justify-center items-center w-full bg-gradient-to-br from-black via-purple-950 to-indigo-900 p-4">
      <Toaster position="top-center" /> 

      <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 flex flex-col items-center px-6 lg:px-12 py-10 rounded-xl max-w-[420px] w-full shadow-2xl border border-zinc-700/60">
        <h1 className="text-4xl font-extrabold mb-8 text-center">
          <span className="text-purple-500">Beat</span>
          <span className="text-white">Haven</span>
        </h1>

        <form className="flex flex-col gap-6 w-full" onSubmit={handleSignup}>
          {message && (
            <p className="bg-purple-600/20 text-purple-200 border border-purple-600 rounded-md font-semibold text-center py-2 px-3 animate-fadeIn">
              {message}
            </p>
          )}

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your Name"
            className="w-full px-5 py-3 rounded-lg bg-zinc-700 text-white outline-none border border-zinc-600 focus:border-purple-500 transition-all duration-300 placeholder:text-gray-400"
            disabled={submitting}
          />

          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Your Email"
            className="w-full px-5 py-3 rounded-lg bg-zinc-700 text-white outline-none border border-zinc-600 focus:border-purple-500 transition-all duration-300 placeholder:text-gray-400"
            disabled={submitting}
          />

          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            className="w-full px-5 py-3 rounded-lg bg-zinc-700 text-white outline-none border border-zinc-600 focus:border-purple-500 transition-all duration-300 placeholder:text-gray-400"
            disabled={submitting}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-white transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating account…" : "Signup"}
          </button>
        </form>

        <div className="text-gray-400 text-center mt-8">
          <span>Already have an account?</span>
          <Link
            href="/login"
            className="ml-2 text-purple-400 underline hover:text-purple-600 transition"
          >
            Sign in now
          </Link>
        </div>
      </div>
    </div>
  );
}