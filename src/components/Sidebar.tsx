"use client";
import Link from "next/link";
import { LuPlus } from "react-icons/lu";
import { MdOutlineLibraryMusic } from "react-icons/md";
import { useState } from "react";
import useUserSession from "../../custom-hooks/useUserSession";
import UserSongs from "./UserSongs";

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
          <Link href="/upload-song">
            <LuPlus size={20} className="cursor-pointer hover:text-blue-500" />
          </Link>
        </div>

        {[...Array(10)].map((i, index) => (
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
        // ... When logged in > show Library
        <div>
          <aside
            className={`fixed left-2 top-16 bg-gradient-to-br from-black via-purple-900 to-black 
            w-72 rounded-lg h-[90vh] p-2 overflow-y-auto 
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            transition-transform duration-500 lg:translate-x-0`}
          >
            
            <div className="flex justify-between text-primary-text items-center p-2 mb-4">
              <h2 className="font-bold">Your Library</h2>
              <Link href="/upload-song">
                <LuPlus
                  size={20}
                  className="cursor-pointer hover:text-blue-500"
                />
              </Link>
            </div>

            <UserSongs userId={user_id} />
          </aside>

          {/* Toggle Button */}
          <button
            className="fixed bottom-5 left-5 bg-background w-12 h-12 lg:hidden grid place-items-center 
            text-white rounded-full z-50 cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MdOutlineLibraryMusic />
          </button>
        </div>
      ) : (
        // ...... When logged out .. show login prompt.........
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

          {/* Toggle Button */}
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

