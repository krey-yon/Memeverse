"use client";
import React from "react";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import Link from 'next/link';
// import { useRouter } from 'next/navigation';

const Navbar = () => {

    const { openSignIn } = useClerk();
    const { isSignedIn } = useUser();
    // const router = useRouter();

  return (
    <div className="flex justify-between items-center p-4">
      <div className="font-extrabold text-2xl creepster-regular text-white">
        MEME<span className="text-orange-600">VERSE</span>
      </div>
      <div className="flex items-center space-x-4 gap-4">
        <ul className="flex space-x-4 text-lg font-bold cursor-pointer">
          <li className="text-white"><Link href="/meme-upload">Create Memes</Link></li>
          <li className="text-white"><Link href="/explorer-page">Explore</Link></li>
          <li className="text-white"><Link href="/">About us</Link></li>
          <li className="text-white"><Link href="/">Leaderboard</Link></li>
        </ul>
        {isSignedIn ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-orange-600 rounded-md text-white px-2 py-1 cursor-pointer"
          >
            Sign in
          </button>
        )}
        {/* <button className="bg-orange-600 rounded-md text-white px-2 py-1 cursor-pointer">
          Sign up
        </button> */}
      </div>
    </div>
  );
};

export default Navbar;
