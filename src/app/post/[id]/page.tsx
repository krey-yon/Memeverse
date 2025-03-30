/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { MemePost } from "@/components/meme-explorer";
import { getMemeById } from "@/actions/meme";
import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getComments, addComments } from "@/actions/meme";
import { toast, ToastContainer } from "react-toastify";

interface Comment {
  id: string;
  author: {
    userId: string;
  };
  content: string;
  timestamp: string;
}

const MemePage = ({ params }: any) => {
  const { id }: any = use(params);
  const [meme, setMeme] = useState<MemePost>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [loading, setLoading] = useState(true);


  const fetchMeme = async (id: any) => {
    const memewithid = await getMemeById(id);
    if (!memewithid) {
      console.log("No meme found");
      return;
    }
    setMeme(memewithid);
  };

  useEffect(() => {
    fetchMeme(id);
    console.log("Meme fetched:", meme);
  }, []);

  const fetchComments = async () => {
    const comments = await getComments(id);
    if (comments) {
      const formattedComments = comments.map((comment) => ({
        id: comment.id,
        author: {
          userId: comment.userId,
        },
        content: comment.content,
        timestamp: new Date(comment.createdAt).toLocaleTimeString(),
      }));
      setComments(formattedComments);
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    const newCommentPosted = await addComments(newComment, id);
    if (newCommentPosted) {
      const formattedComment: Comment = {
        id: newCommentPosted.id,
        author: {
          userId: newCommentPosted.userId,
        },
        content: newCommentPosted.content,
        timestamp: new Date(newCommentPosted.createdAt).toLocaleTimeString(),
      };
      setComments([...comments, formattedComment]);
    }
    setNewComment("");
  };

  //handling share
  const handleShare = (platform: string) => {
    // Demo URLs - in a real app, these would be constructed with the actual post ID
    const postUrl = "https://memeverse.kreyon.in/post/" + id;

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
    const postUrl = "https://memeverse.kreyon.in/post/" + id;
    navigator.clipboard.writeText(postUrl);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-center mb-8">
          Loading meme
        </h1>{" "}
        <Image src="/image/flow.gif" alt="" width={400} height={400} />{" "}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="overflow-hidden border rounded-xl h-screen shadow-sm">
        <div className="grid md:grid-cols-2 h-full">
          {/* Left side - Image */}
          <div className="relative bg-gray-100 flex flex-col">
            {/* User info */}
            <div className="p-4 flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage
                  src={meme?.author.image || ""}
                  alt={meme?.author.name}
                />
                <AvatarFallback>
                  {meme?.author.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{meme?.author.name}</div>
                <div className="text-xs text-muted-foreground">
                  {meme?.createdAt
                    ? formatDistanceToNow(new Date(meme.createdAt), {
                        addSuffix: true,
                      })
                    : "Unknown date"}
                </div>
              </div>
            </div>

            {/* Meme image */}
            <div className="relative flex-grow">
              <div className="absolute inset-0">
                <Image
                  src={meme?.imageUrl || "/placeholder.svg"}
                  alt="Meme image"
                  fill
                  className="object-fit"
                />
              </div>
            </div>

            {/* Mobile-only interaction buttons */}
            <div className="flex items-center p-4 md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <Heart className="h-5 w-5" />
                <span>{meme?.likesCount}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{comments.length}</span>
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
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
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
          </div>

          {/* Right side - Comments */}
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">
                {meme?.caption || "No caption available"}
              </h2>
            </div>

            <div className="flex-grow overflow-y-auto p-4">
              {/* Comments section */}
              <div className="space-y-4">
                {/* <div className="flex gap-3"> */}
                {/* <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback>U1</AvatarFallback>
                  </Avatar> */}
                <div>
                  {comments.map((comment) => (
                    <Card key={comment.id} className="p-4 mb-3">
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={meme?.author?.image || ""}
                            alt={meme?.author.name}
                          />
                          <AvatarFallback>
                            {meme?.author.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-sm">
                              {meme?.author.name}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{comment.content}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {/* </div> */}
                </div>

                {/* Add more comments here */}
              </div>
            </div>

            {/* Desktop interaction buttons */}
            <div className="p-4 border-t mt-auto hidden md:block">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Heart className="h-5 w-5" />
                  <span>{meme?.likesCount}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{comments.length}</span>
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

              {/* Comment input */}
              <div className="flex gap-3 mt-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {meme?.author.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2 flex gap-3">
                  <Textarea
                    placeholder="Add a comment..."
                    className="resize-none"
                    value={newComment}
                    onChange={(e: any) => setNewComment(e.target.value)}
                  />
                  <Button className="translate-y-3" onClick={handleAddComment}>
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default MemePage;
