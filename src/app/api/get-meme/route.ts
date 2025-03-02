import { NextResponse } from 'next/server';
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  
  try {
    const skip = (page - 1) * limit;
    
    const posts = await prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
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
      likes: [], // Add empty array to match meme-explorer type
    }));
    
    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching memes:", error);
    return NextResponse.json({ error: "Failed to fetch memes" }, { status: 500 });
  }
}