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