"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, MessageSquare, Share2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { toast } from "react-toastify"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getComments, addComments } from "@/actions/meme"

interface Comment {
  id: string
  author: {
    userId: string
  }
  content: string
  timestamp: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CommentModal({ open, setOpen, optimisticState, meme }: any) {
  const [comments, setComments] = useState<Comment[]>([])

  const [newComment, setNewComment] = useState("")


  const fetchComments = async () => {
    const comments = await getComments(meme.id)
    if (comments) {
      const formattedComments = comments.map((comment) => ({
        id: comment.id,
        author: {
          userId: comment.userId,
        },
        content: comment.content,
        timestamp: new Date(comment.createdAt).toLocaleTimeString(),
      }))
      setComments(formattedComments)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  const handleAddComment = async () => {
    if (newComment.trim() === "") return
    const newCommentPosted = await addComments(newComment, meme.id)
    if (newCommentPosted) {
      const formattedComment: Comment = {
        id: newCommentPosted.id,
        author: {
          userId: newCommentPosted.userId,
        },
        content: newCommentPosted.content,
        timestamp: new Date(newCommentPosted.createdAt).toLocaleTimeString(),
      }
      setComments([...comments, formattedComment])
    }
    setNewComment("")
  }

  //handling share
  const handleShare = (platform: string) => {
    // Demo URLs - in a real app, these would be constructed with the actual post ID
    const postUrl = "https://memeverse.kreyon.in/post/" + meme?.id;

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
    const postUrl = "https://memeverse.kreyon.in/post/" + meme?.id;
    navigator.clipboard.writeText(postUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">{comments.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart
                className={`h-4 w-4 cursor-pointer ${optimisticState.liked ? "fill-red-500 text-red-500" : ""}`}
              />
              <span className="text-sm font-medium">{optimisticState.likesCount}</span>
            </div>
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
        </DialogHeader>

        <Separator className="my-4" />

        <div className="max-h-[300px] overflow-y-auto pr-1">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-4 mb-3">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={meme.author.avatar} alt={meme.author.name} />
                  <AvatarFallback>{meme.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm">{meme.author.name}</p>
                    <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-3 mt-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{meme.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2 flex gap-3">
            <Textarea
              placeholder="Add a comment..."
              className="resize-none"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button className="translate-y-3" onClick={handleAddComment}>Post</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

