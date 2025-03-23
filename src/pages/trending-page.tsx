import Image from "next/image"
import Link from "next/link"

export default function TrendingMemes() {
  return (
    <div className="relative w-full bg-orange-500 px-4 py-8 sm:py-12 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-40 md:w-64 h-40 md:h-64 -translate-x-1/4 hidden md:block">
        <Image
          src="/image/bgintrendingpage.png"
          alt=""
          width={256}
          height={256}
          className="w-full h-full"
          aria-hidden="true"
        />
      </div>
      <div className="absolute top-0 right-0 w-40 md:w-64 h-40 md:h-64 translate-x-1/4 hidden md:block">
        <Image
          src="/image/bgintrendingpage.png"
          alt=""
          width={256}
          height={256}
          className="w-full h-full"
          aria-hidden="true"
        />
      </div>
      <div className="absolute bottom-0 left-1/4 w-40 md:w-64 h-40 md:h-64 -translate-x-1/2 translate-y-1/4 hidden lg:block">
        <Image
          src="/image/bgintrendingpage.png"
          alt=""
          width={256}
          height={256}
          className="w-full h-full"
          aria-hidden="true"
        />
      </div>
      <div className="absolute bottom-0 right-1/4 w-40 md:w-64 h-40 md:h-64 translate-x-1/2 translate-y-1/4 hidden lg:block">
        <Image
          src="/image/bgintrendingpage.png"
          alt=""
          width={256}
          height={256}
          className="w-full h-full"
          aria-hidden="true"
        />
      </div>

      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-8 sm:mb-12 jaro-regular">Trending memes</h2>

        {/* Timeline steps */}
        <div className="relative mb-8">
          {/* Timeline line - hidden on mobile, shown on md+ */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-1 bg-orange-400 z-0"></div>
          
          {/* Number indicators - arranged horizontally on md+, vertically on mobile */}
          <div className="hidden md:flex md:flex-row justify-between items-start gap-4">
            <div className="flex flex-col items-center z-10">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white font-bold mb-2 md:translate-y-1.5">
                #1
              </div>
            </div>
            <div className="flex flex-col items-center z-10">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white font-bold mb-2 md:translate-y-1.5">
                #2
              </div>
            </div>
            <div className="flex flex-col items-center z-10">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white font-bold mb-2 md:translate-y-1.5">
                #3
              </div>
            </div>
          </div>
        </div>

        {/* Meme cards - stack on mobile, grid on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="bg-orange-200 rounded-lg p-3 sm:p-4 aspect-square">
            <Image 
              src={"/image/meme1.jpg"}
              alt="Meme 1"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="bg-orange-200 rounded-lg p-3 sm:p-4 aspect-square">
            <Image 
              src={"/image/meme2.jpg"}
              alt="Meme 2"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="bg-orange-200 rounded-lg p-3 sm:p-4 aspect-square sm:col-span-2 md:col-span-1">
            <Image 
              src={"/image/meme3.jpg"}
              alt="Meme 3"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded"
            />
          </div>
        </div>

        {/* Explore more button */}
        <div className="flex justify-center">
          <Link
            href="#"
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition-colors text-sm sm:text-base"
          >
            Explore More
          </Link>
        </div>
      </div>
    </div>
  )
}