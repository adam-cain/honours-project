"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import LoadingDots from "@/components/icons/loading-dots"; // 

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    signOut();
    signOut().finally(() => {
      setLoading(false); // Reset loading state after sign out
    });
  };

  return (
    <button
      disabled={loading}
      onClick={handleLogout}
      className={`${
        loading
          ? "cursor-not-allowed bg-stone-50 dark:bg-stone-800"
          : "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black"
      } group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
    >
      {loading ? (
        <LoadingDots color="#A8A29E" />
      ) : (
        <>
          {/* Add your logout icon and text here */}
          <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
            Logout
          </p>
        </>
      )}
    </button>
  );
}