// import prisma from "@/lib/db"; // Assuming this is your Prisma client import

export interface MemePost {
  id: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  imageUrl: string;
  caption?: string;
  createdAt: string;
  likesCount: number;
  commentsCount : number
  likes: Array<{ id: string; userId: string }>; // Add this to match expected type
}

export async function getMemes(): Promise<MemePost[]> {
  try {
    const response = await fetch(`/api/get-meme`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch memes');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching memes:", error);
    return []; // Return empty array on error
  }
}

export async function likeMeme(memeId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
  try {
    const response = await fetch(`/api/likes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memeId, userId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to like meme');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error liking meme:", error);
    return { liked: false, likesCount: 0 }; // Return default values on error
  }
}