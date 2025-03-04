import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { userId, memeId } = await request.json();

    // Validate input
    if (!userId || !memeId) {
      return NextResponse.json(
        { error: "User ID and Meme ID are required" },
        { status: 400 }
      );
    }

    // Check if the like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_memeId: {
          userId,
          memeId,
        },
      },
    });

    // If like already exists, unlike the post
    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_memeId: {
            userId,
            memeId,
          },
        },
      });

      return NextResponse.json(
        {
          message: "Unliked successfully",
          liked: false,
        },
        { status: 200 }
      );
    }

    // Create a new like
    const newLike = await prisma.like.create({
      data: {
        user: { connect: { id: userId } },
        meme: { connect: { id: memeId } },
      },
      include: {
        user: true,
        meme: true,
      },
    });

    const likesCount = await prisma.like.count({
      where: {
        memeId,
      },
    });

    return NextResponse.json(
      {
        message: "Liked successfully",
        liked: true,
        like: newLike,
        likesCount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Like creation error:", error);

    // Handle unique constraint violation (if any)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Like already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

