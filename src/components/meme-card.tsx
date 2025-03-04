"use client"

import { useState } from "react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Share2 } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { MemePost } from "@/components/meme-explorer"
import { likeMeme } from "@/lib/api"

interface MemeCardProps {
  meme: MemePost
  memeId: string
  authorId: string
}

export default function MemeCard({ meme, memeId, authorId }: MemeCardProps) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(meme.likes.length)

  const handleLike = async () => {
    // console.log(memeId, authorId)

    const likes = await likeMeme(memeId, authorId)
    console.log(likes)
    console.log(likes.likesCount)
    // In a real app, you would call an API to like/unlike the meme
    // if (liked) {
    //   setLikesCount((prev) => prev - 1)
    // } else {
    //   setLikesCount((prev) => prev + 1)
    // }
    if (liked) {
      setLikesCount(likes.likesCount)
    }
    setLiked(likes.liked)
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardContent className="p-0 flex-grow">
        <div className="p-3 flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={meme.author.image || ""} alt={meme.author.name} />
            <AvatarFallback>{meme.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{meme.author.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(meme.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

          {meme.caption && (
            <div className="p-3">
              <p className="text-sm">{meme.caption}</p>
            </div>
          )}
        <div className="relative aspect-square bg-muted">
          <Image
            src={meme.imageUrl || "/placeholder.svg"}
            alt={meme.caption || "Meme image"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-fit"
          />
        </div>

      </CardContent>

      <CardFooter className="">
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2" onClick={handleLike}>
            <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            <span>{likesCount}</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2">
            <MessageCircle className="h-5 w-5" />
            <span>{meme._count?.comments || 0}</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

