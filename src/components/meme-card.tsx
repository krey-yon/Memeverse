"use client";

import { useState, useOptimistic, useTransition } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2 } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { MemePost } from "@/components/meme-explorer";
// import { likeMeme } from "@/lib/api"
import { updateMemeLike } from "@/actions/meme";
import CommentModal from "./meme-modal";
import { toast } from "react-toastify";

interface MemeCardProps {
  meme: MemePost;
  // memeId: string
  // authorId: string
}

export default function MemeCard({ meme }: MemeCardProps) {
  // const [liked, setLiked] = useState(meme.liked || false)
  // const [likesCount, setLikesCount] = useState(meme.likesCount || 0)
  // const [isLoading, setIsLoading] = useState<boolean>(false)

  const [ open , setOpen ] = useState(false)
  const [internalState, setInternalState] = useState({
    liked: meme.liked,
    likesCount: meme.likesCount,
  });

  // Use optimistic updates on top of the internal state
  const [optimisticState, addOptimistic] = useOptimistic(
    internalState,
    (state, newState: typeof internalState) => ({ ...state, ...newState })
  );

  const [isPending, startTransition] = useTransition();

  // Sync internal state with incoming props, but only if they actually change

  const handleNewLike = () => {
    if (isPending) return;

    // Calculate new state

    startTransition(async () => {
      const newLikedState = !optimisticState.liked;
      const newLikesCount = newLikedState
        ? optimisticState.likesCount + 1
        : optimisticState.likesCount - 1;

      // Apply optimistic update
      addOptimistic({ liked: newLikedState, likesCount: newLikesCount });
      try {
        console.log("Calling server action...");
        const result = await updateMemeLike(meme.id);
        console.log("Server response:", result);

        if (result) {
          // Update internal state (which persists between renders)
          setInternalState({
            liked: result.liked,
            likesCount: result.likesCount,
          });

          // Also update optimistic state to match
          addOptimistic({
            liked: result.liked,
            likesCount: result.likesCount,
          });
        }
      } catch (error) {
        console.error("Error updating like:", error);
        // Revert to the previous state
        addOptimistic(internalState);
      }
    });
  };

  // useEffect(() => {
  //   setLiked(meme.liked || false)
  //   setLikesCount(meme.likesCount || 0)
  // }, [meme.liked, meme.likesCount])

  // useEffect(() => {
  //   const storedLiked = localStorage.getItem(`liked-${meme.id}`);
  //   const storedLikesCount = localStorage.getItem(`likesCount-${meme.id}`);

  //   if (storedLiked !== null && storedLiked !== "undefined") {
  //     setLiked(JSON.parse(storedLiked))
  //   }

  //   if (storedLikesCount !== null && storedLikesCount !== "undefined") {
  //     setLikesCount(JSON.parse(storedLikesCount))
  //   }
  // }, [meme.id])

  // const handleLike = async () => {
  //   if (isLoading) return

  //   // Optimistic update
  //   const newLiked = !liked
  //   const newLikesCount = newLiked ? likesCount + 1 : likesCount - 1

  //   setLiked(newLiked)
  //   setLikesCount(newLikesCount)
  //   setIsLoading(true)

  //   // Save to localStorage
  //   localStorage.setItem(`liked-${meme.id}`, JSON.stringify(newLiked))
  //   localStorage.setItem(`likesCount-${meme.id}`, JSON.stringify(newLikesCount))

  //   try {
  //     // Call API to update like status
  //     const result = await likeMeme(meme.id, meme.authorId)

  //     // Update with actual server response
  //     setLiked(result.liked)
  //     setLikesCount(result.likesCount)

  //     // Save the new server response to localStorage
  //     localStorage.setItem(`liked-${meme.id}`, JSON.stringify(result.liked))
  //     localStorage.setItem(`likesCount-${meme.id}`, JSON.stringify(result.likesCount || 0))
  //   } catch (error) {
  //     // Revert to previous state if API call fails
  //     setLiked(!newLiked) // Revert to previous liked state
  //     setLikesCount(newLiked ? newLikesCount - 1 : newLikesCount + 1) // Revert like count

  //     console.error("Error updating like status:", error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }


    //handling share
    const handleShare = (platform: string) => {
      // Demo URLs - in a real app, these would be constructed with the actual post ID
      const postUrl = "https://memeverse.kreyon.in/post/" + meme.id;
  
      switch (platform) {
        case "whatsapp":
          window.open(
            `https://api.whatsapp.com/send?text=${encodeURIComponent(postUrl)}`,
            "_blank"
          );
          break;
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              postUrl
            )}`,
            "_blank"
          );
          break;
        case "instagram":
          // Instagram doesn't have a direct share URL, but we can show a toast
          toast.info("Instagram sharing is not directly supported.");
          navigator.clipboard.writeText(postUrl);
          break;
        default:
          break;
      }
    };
  
    const handleCopyLink = () => {
      const postUrl = "https://memeverse.kreyon.in/post/" + meme.id;
      navigator.clipboard.writeText(postUrl);
      toast.success("Link copied to clipboard!");
    };

  return (
    <>
      <CommentModal open={open} setOpen={setOpen} optimisticState={optimisticState} meme={meme} />
      <Card className="overflow-hidden h-full flex flex-col">
        <CardContent className="p-0 flex-grow">
          <div className="p-3 flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={meme.author.image || ""}
                alt={meme.author.name}
              />
              <AvatarFallback>
                {meme.author.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{meme.author.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(meme.createdAt), {
                  addSuffix: true,
                })}
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
            {/* <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2" onClick={handleLike}>
            <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            <span>{Number.isNaN(likesCount) ? "0" : likesCount}</span>
            </Button>  */}

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 px-2"
              onClick={handleNewLike}
            >
              <Heart
                className={`h-5 w-5 ${
                  optimisticState.liked ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span>
                {Number.isNaN(optimisticState.likesCount)
                  ? "0"
                  : optimisticState.likesCount}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 px-2"
              onClick={() => setOpen(true)}
            >
              <MessageCircle className="h-5 w-5" />
              <span>{meme.commentsCount}</span>
            </Button>

            <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Share to</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                        <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                        <path d="M9.5 13.5c.5 1 1.5 1 2.5 1s2 0 2.5-1" />
                      </svg>
                      WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("facebook")}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                      Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("instagram")}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <rect
                          width="20"
                          height="20"
                          x="2"
                          y="2"
                          rx="5"
                          ry="5"
                        />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                      Instagram
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleCopyLink()}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      Copy link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
