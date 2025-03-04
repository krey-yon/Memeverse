import Navbar from "@/components/Navbar";
import Image from "next/image";
import React from "react";

const HeroPage = () => {

  return (
    <section className="flex flex-col">
      <Navbar />
      <div className="flex justify-center gap-22 items-center h-full px-8 relative">
        <Image
          src="/image/hero-image-memeverse.png"
          width={600}
          height={500}
          alt="hero-image"
        />
        <div className="flex flex-col justify-center items-center relative">
          {/* image */}
          <Image
            src="/image/hero-image-bg-memeverse.png"
            width={380}
            height={380}
            alt="logo"
            className="z-0 absolute"
          />
          <div className="flex flex-col justify-center items-center z-10">
          <h1 className="text-4xl font-bold creepster-regular text-white">Create, Share & Go Viral!</h1>
          <p className="text-lg text-center py-4 text-white">
            Unleash your creativity with our easy-to-use meme <br /> generator. Make
            memes, share laughs, <br /> and become an internet sensation!
          </p>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-md">
            Create Memes
          </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPage;
