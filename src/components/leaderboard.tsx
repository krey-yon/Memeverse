"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { top10Memes } from "@/actions/meme";

export default function MemeLeaderboard() {
  interface Meme {
    id: string;
    authorId: string;
    author: {
      id: string;
      name: string;
    };
    imageUrl: string;
    caption?: string;
    createdAt: string;
    likesCount: number;
    commentsCount: number;
    liked: boolean;
    likes: never[];
  }

  const [topMemes, setTopMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTop10Memes() {
      const memes = await top10Memes();
      setLoading(false);
      setTopMemes(memes);
    }
    fetchTop10Memes();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-center mb-8">
          Loading top memes...
        </h1>{" "}
        <Image src="/image/flow.gif" alt="" width={400} height={400} />{" "}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Top 10 Memes of All Time
      </h1>
      <div className="grid gap-6">
        {topMemes.map((meme) => (
          <div
            key={meme.id}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <div className="flex flex-col md:flex-row">
              <div className="relative flex-shrink-0 min-h-50 md:h-auto md:w-1/3 bg-gray-100">
                <div className="absolute top-2 left-2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-gray-500 text-white font-bold text-lg">
                  {topMemes.findIndex((m) => m.id === meme.id) + 1}
                </div>
                <Image
                  src={meme.imageUrl || "/placeholder.svg"}
                  alt="meme"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold mb-2">{meme.caption}</h2>
                  <div className="flex items-center text-gray-900">
                    <Heart className="h-4 w-4 mr-1" />
                    <span>{meme.likesCount}</span>
                  </div>
                </div>
                <p className="text-gray-600">{meme.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
