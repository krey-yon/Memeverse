"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, MessageSquare, Share2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
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
export default function CommentModal( {open, setOpen, optimisticState, meme} : any ) {
  const [comments, setComments] = useState<Comment[]>([])

  const [newComment, setNewComment] = useState("")


  const fetchComments = async () => {
    const comments = await getComments(meme.id)
    if (comments) {
      const formattedComments = comments.map((comment) => ({
        id: comment.id,
        author: {
          userId : comment.userId,
        },
        content: comment.content,
        timestamp: new Date(comment.createdAt).toLocaleTimeString(),
      }))
      setComments(formattedComments)
    }
  }

  useEffect(() => {
    if (open) {
      fetchComments()
    }
  }, [open])

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

  const handleShare = () => {
    // Share functionality would go here
    alert("Sharing this content!")
  }

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
              <Button variant="ghost" size="sm" className="ml-auto" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
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

