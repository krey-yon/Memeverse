import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-orange-200 text-white relative">
      {/* Decorative images - hidden on mobile */}
      <Image 
        src="/image/pepe-d-l.png" 
        alt="logo" 
        width={330} 
        height={330} 
        className="absolute top-20 translate-y-28 left-0 hidden lg:block" 
      />
      <Image 
        src="/image/pepe-d-r.png" 
        alt="logo" 
        width={450} 
        height={450} 
        className="absolute top-15 right-0 z-10 hidden lg:block" 
      />
      
      {/* Batman meme signup section */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-2 border-8 border-orange-200 px-4 sm:px-6 md:px-10 bg-amber-500 rounded-2xl transform translate-y-6 sm:translate-y-10 md:translate-y-14 max-w-[90%] mx-auto">
        <Image
          src="/image/pepebatman.png"
          alt="logo"
          width={230}
          height={230}
          className="mx-auto md:mx-0 w-40 h-auto sm:w-48 md:w-auto max-w-[230px]"
        />
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-center font-bold jaro-regular">
            Batman Loves memes, <br className="hidden sm:block" /> Do you?
          </h1>
          <button className="bg-orange-600 rounded-md px-4 sm:px-5 py-1.5 sm:py-2 mx-auto mt-2 sm:mt-4 text-base sm:text-lg hover:bg-orange-700 transition-colors jaro-regular mb-2">
            Sign Up Now
          </button>
        </div>
      </div>
      
      {/* Footer content */}
      <div className="flex flex-col items-center justify-center mt-4 bg-amber-500 rounded-t-2xl w-full gap-2 sm:gap-4 px-4">
        <h1 className="font-extrabold text-xl sm:text-2xl creepster-regular text-white ml-2 mt-10 sm:mt-16">
          MEME<span className="text-orange-600">VERSE</span>
        </h1>
        <p className="text-center text-sm sm:text-base md:text-lg jaro-regular px-2 sm:px-0">
          Join our meme community & become part of the fun! <br className="hidden sm:block" />
          Making the internet funnier, one meme at a time! <br className="hidden sm:block" />
          Join the meme revolution and unleash your creativity.
        </p>
        <p className="mt-4 sm:mt-6 jaro-regular text-sm sm:text-base pb-4 sm:pb-0">
          © Meme Verse 2025 - Laugh. Create. Share.
        </p>
      </div>
    </div>
  );
};

export default Footer;
