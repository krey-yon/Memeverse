import { NextResponse } from 'next/server';
import prisma from "@/lib/db";
import { currentUser } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);

  console.log(searchParams.get('page'), searchParams.get('limit'));
  
  try {

    const user = await currentUser();
    if (!user) return;
    const findUser = await prisma.user.findUnique({where : {clerkId : user.id}})
    if (!findUser) return;

    const skip = (page - 1) * limit;
    
    const posts = await prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
        likes : true,
        _count: {
          select: { likes: true },
        },
      },
    });
    
    // Transform data to match expected format
    const formattedPosts = posts.map(post => ({
      id: post.id,
      authorId: post.authorId,
      author: {
        id: post.author.id,
        name: post.author.name || "Unknown",
      },
      imageUrl: post.imageUrl,
      caption: post.caption || undefined,
      createdAt: post.createdAt.toISOString(),
      likesCount: post._count.likes,
      liked: post.likes.some(like => like.userId === findUser.id),
      likes: [], // Add empty array to match meme-explorer type
    }));
    
    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching memes:", error);
    return NextResponse.json({ error: "Failed to fetch memes" }, { status: 500 });
  }
}