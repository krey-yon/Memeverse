import Image from "next/image";

const AboutUs = () => {
  return (
    <div className="bg-[#FFCA7A] flex flex-col relative w-full">
      <div className="flex flex-col content-center mt-4 md:mt-10">
        <div className="px-4 py-6 md:my-[43px] md:mx-[80px] lg:mx-[162px]">
          <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between">
            {/* Pepe Image Container */}
            <div className="flex relative mb-8 lg:mb-0">
              <div className="bg-[#FF9900] h-[200px] w-[200px] sm:h-[280px] sm:w-[280px] md:h-[350px] md:w-[350px] rounded-3xl items-center justify-center flex shadow-[#e6b85c] shadow-xl">
                <Image
                  src={"/image/pepeCry-image.png"}
                  height={180}
                  width={180}
                  alt="Pepe-Cry image"
                  className="h-auto w-auto max-h-[140px] max-w-[140px] sm:max-h-[200px] sm:max-w-[200px] md:max-h-[240px] md:max-w-[240px]"
                />
              </div>
              <div className="hidden absolute top-[-50px] right-[-50px] lg:right-[-120px] lg:flex flex-col items-center justify-center">
                <Image
                  src={"/image/cloud.png"}
                  height={150}
                  width={176}
                  alt="cloud image"
                />
                <div className="absolute flex items-center justify-center text-center">
                  <span className="jaro-regular text-[16px]">
                    Finally someone <br />
                    wants to know
                    <br />
                    about us
                  </span>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="w-full lg:w-3/5 px-2 lg:ml-8 xl:ml-20 flex items-center justify-center">
              <div className="flex flex-col items-start w-full">
                <div className="relative p-2 text-center flex flex-col items-center justify-center lg:mr-14">
                  <span className="text-2xl sm:text-3xl md:text-4xl creepster-regular text-white text-shadow-gray">
                    <span className="creepster-regular text-[#FF9900] text-shadow-gray tracking-wide">
                      About Us
                    </span>{" "}
                    – Who We Are?
                  </span>
                  <br />

                  <span className="jaro-regular text-[16px] sm:text-[18px] md:text-[20px] text-white text-shadow-gray-large">
                    At Memeverse, we believe that laughter is the best way to
                    connect people! Our platform lets you create, customize, and
                    share memes effortlessly— whether you&apos;re a casual scroller
                    or a meme lord.
                  </span>
                  <br />
                  <br />
                  <span className="jaro-regular text-[16px] sm:text-[18px] md:text-[20px] text-white text-shadow-gray-large">
                    We started with a simple idea: to give everyone a fun, easy,
                    and free way to express themselves through memes. Today,
                    we&apos;re a growing community of meme enthusiasts, creators, and
                    internet humor lovers.
                  </span>
                  <br />
                  <br />
                  <span className="jaro-regular text-[16px] sm:text-[18px] md:text-[20px] text-white text-shadow-gray-large">
                    Why? Because the internet needs more laughs, and we&apos;re here
                    to deliver them!
                  </span>
                </div>
                <Image
                  src={"/image/crazy-scientistt.png"}
                  height={295}
                  width={215}
                  alt="crazy scientist"
                  className="mt-2 hidden md:block absolute right-[10px] lg:right-[70px] top-[190px] opacity-40 max-w-[150px] md:max-w-[215px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;