// "use client";

// import Link from "next/link";
// import { GoSearch } from "react-icons/go";
// import { MdHomeFilled } from "react-icons/md";
// import useUserSession from "../../custom-hooks/useUserSession";
// import LogoutUser from "../../api/auth/logoutUser";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import supabase from "../../api/SupabaseClient";

// type Role = "admin" | "user";

// function Navbar() {
//   const router = useRouter();
//   const { session, loading } = useUserSession();
//   const [role, setRole] = useState<Role | null>(null);
//   const [name, setName] = useState<string>("");

//   // Fetch role + name from profiles
//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!session?.user) return;
//       const { data, error } = await supabase
//         .from("profiles")
//         .select("role, display_name, email")
//         .eq("id", session.user.id)
//         .maybeSingle();

//       if (!error && data) {
//         setRole(data.role);
//         setName(data.display_name || data.email?.split("@")[0] || "");
//       }
//     };
//     fetchProfile();
//   }, [session]);

//   const handleLogout = async () => {
//     const result = await LogoutUser();
//     if (!result?.error) {
//       router.push("/");
//     }
//   };

//   return (
//     <nav
//       className="h-16 flex items-center justify-between px-6 fixed top-0 left-0 w-full 
//       bg-gradient-to-r from-black via-zinc-900 to-black 
//       backdrop-blur-md shadow-lg z-50 border-b border-zinc-800"
//     >
//       {/* Left Section (Logo + Home + Search) */}
//       <div className="flex items-center gap-4">
//         <h1 className="text-2xl font-extrabold tracking-wide text-purple-500">
//           Beat<span className="text-white">Haven</span>
//         </h1>

//         <Link
//           href="/"
//           className="bg-zinc-800 hover:bg-purple-600/20 w-10 h-10 grid place-items-center 
//           text-white text-2xl rounded-full transition duration-300"
//         >
//           <MdHomeFilled />
//         </Link>

//         <div
//           className="hidden lg:flex items-center h-10 w-[350px] px-3 gap-2 
//           bg-zinc-800/70 border border-zinc-700 text-primary-text rounded-full 
//           focus-within:ring-2 focus-within:ring-purple-500 transition"
//         >
//           <GoSearch className="text-primary-text shrink-0" size={20} />
//           <input
//             className="flex-1 h-full bg-transparent outline-none placeholder:text-gray-400 text-white"
//             type="text"
//             placeholder="What do you want to play?"
//           />
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center gap-6">
//         <div className="lg:flex hidden gap-4 text-gray-400 font-semibold border-r border-zinc-700 pr-6">
//           {/* Only admins see Dashboard */}
//           {role === "admin" && (
//             <Link href="/admin/dashboard" className="hover:text-white transition">
//               Dashboard
//             </Link>
//           )}
//           {/* <a href="#" className="hover:text-white transition">Premium</a>
//           <a href="#" className="hover:text-white transition">Support</a>
//           <a href="#" className="hover:text-white transition">Download</a> */}
//         </div>

//         {/* Profile + Auth */}
//         {!loading && session && (
//           <div className="flex items-center gap-4">
//             {/* Profile circle */}
//             <div className="flex items-center gap-2">
//               <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shadow-md">
//                 {name ? name.charAt(0).toUpperCase() : "U"}
//               </div>
//               <span className="text-white font-medium">
//                 {role === "admin" ? "Hii Admin" : `Hii ${name.toLocaleUpperCase()}`}
//               </span>
//             </div>

//             <button
//               onClick={handleLogout}
//               className="cursor-pointer h-11 bg-white text-gray-950 rounded-full 
//               font-bold px-8 shadow-md hover:bg-gray-200 transition"
//             >
//               Logout
//             </button>
//           </div>
//         )}

//         {!loading && !session && (
//           <Link
//             href="/login"
//             className="h-11 px-8 flex items-center justify-center bg-white text-gray-950 
//             rounded-full font-bold shadow-md hover:bg-gray-200 transition"
//           >
//             Login
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;


"use client";

import Link from "next/link";
import { GoSearch } from "react-icons/go";
import { MdHomeFilled } from "react-icons/md";
import useUserSession from "../../custom-hooks/useUserSession";
import LogoutUser from "../../api/auth/logoutUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "../../api/SupabaseClient";

type Role = "admin" | "user";

function Navbar() {
  const router = useRouter();
  const { session, loading } = useUserSession();
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState<string>("");

  // Fetch role + name from profiles
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("role, display_name, email")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!error && data) {
        setRole(data.role);
        setName(data.display_name || data.email?.split("@")[0] || "");
      }
    };
    fetchProfile();
  }, [session]);

  const handleLogout = async () => {
    const result = await LogoutUser();
    if (!result?.error) {
      router.push("/");
    }
  };

  return (
    <nav
      className="h-16 flex items-center justify-between px-4 sm:px-6 fixed top-0 left-0 w-full
      bg-gradient-to-r from-black via-zinc-900 to-black
      backdrop-blur-md shadow-lg z-50 border-b border-zinc-800"
    >
      {/* Left Section (Logo + Home + Search) */}
      <div className="flex items-center gap-2 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-purple-500">
          Beat<span className="text-white">Haven</span>
        </h1>

        <Link
          href="/"
          className="bg-zinc-800 hover:bg-purple-600/20 w-8 h-8 sm:w-10 sm:h-10 grid place-items-center
          text-white text-xl sm:text-2xl rounded-full transition duration-300"
        >
          <MdHomeFilled />
        </Link>

        {/* This search bar is now visible on medium and large screens */}
        <div
          className="hidden md:flex items-center h-10 w-[250px] lg:w-[350px] px-3 gap-2
          bg-zinc-800/70 border border-zinc-700 text-primary-text rounded-full
          focus-within:ring-2 focus-within:ring-purple-500 transition"
        >
          <GoSearch className="text-primary-text shrink-0" size={20} />
          <input
            className="flex-1 h-full bg-transparent outline-none placeholder:text-gray-400 text-white"
            type="text"
            placeholder="What do you want to play?"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Additional links now visible on large screens only */}
        <div className="hidden lg:flex gap-4 text-gray-400 font-semibold border-r border-zinc-700 pr-6">
          {/* Only admins see Dashboard */}
          {role === "admin" && (
            <Link href="/admin/dashboard" className="hover:text-white transition">
              Dashboard
            </Link>
          )}
          {/* <a href="#" className="hover:text-white transition">Premium</a>
          <a href="#" className="hover:text-white transition">Support</a>
          <a href="#" className="hover:text-white transition">Download</a> */}
        </div>

        {/* Profile + Auth */}
        {!loading && session && (
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Profile circle */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shadow-md text-sm sm:text-base">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="text-white font-medium text-xs hidden sm:block">
                {role === "admin" ? "Hii Admin" : `Hii ${name.toLocaleUpperCase()}`}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="cursor-pointer h-9 sm:h-11 bg-white text-gray-950 rounded-full
              font-bold px-4 sm:px-8 shadow-md hover:bg-gray-200 transition text-sm"
            >
              Logout
            </button>
          </div>
        )}

        {!loading && !session && (
          <Link
            href="/login"
            className="h-9 sm:h-11 px-4 sm:px-8 flex items-center justify-center bg-white text-gray-950
            rounded-full font-bold shadow-md hover:bg-gray-200 transition text-sm"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;