"use server"
import { SortOption } from '@/components/meme-explorer'
import prisma from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server'

export const getMemeById = async (memeId: string) => {
  console.log("getting meme by id")
  console.log(memeId)
  if (!memeId) return null;
  try {
    const user = await currentUser();
    if (!user) return null;
    const findUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
    console.log("finding user")
    if (!findUser) {
      console.log("user not found");
      return null;
    }
    console.log("searching meme by id")
    const post = await prisma.post.findUnique({
      where: { id: memeId },
      include: {
        author: true,
        likes: true,
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });
    if (!post) return null;
    return {
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
      commentsCount: post._count.comments,
      liked: post.likes.some(like => like.userId === findUser.id),
      likes: [],
    };
  } catch (error) {
    console.log("error finding meme by id" + error);
    return null;
  }}


export const getMemesActions = async (filter: SortOption, skip = 0, limit = 10) => {
  try {
    const user = await currentUser();
    if (!user) {
      return [];
    }
    const findUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
    if (!findUser) {
      console.log("user not found");
      return [];
    }
    let posts;
switch (filter) {
  case "random":
    posts = await prisma.post.findMany({
      skip,
      take: limit,
      include: {
        author: true,
        likes: true,
        _count: {
          select: { likes: true, comments: true },
        },
      },
      orderBy: {
        id: "asc",
      }
    });
    posts = posts.sort(() => Math.random() - 0.5);
    break;
  case "oldest":
    posts = await prisma.post.findMany({
      skip,
      take: limit,
      include: {
        author: true,
        likes: true,
        _count: {
          select: { likes: true, comments: true },
        },
      },
      orderBy: {
        createdAt: "asc",
      }
    });
    break;
  case "comments":
    posts = await prisma.post.findMany({
      skip,
      take: limit,
      include: {
        author: true,
        likes: true,
        _count: {
          select: { likes: true, comments: true },
        },
      },
      orderBy: {
        comments: { _count: "desc" }
      }
    });
    break;
  case "date":
    posts = await prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
        likes: true,
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });
    break;
  case "likes":
    posts = await prisma.post.findMany({
      skip,
      take: limit,
      include: {
        author: true,
        likes: true,
        _count: {
          select: { likes: true, comments: true },
        },
      },
      orderBy: {
        likes: { _count: "desc" }
      }
    });
    break;
  default:
    return [];
}
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
      commentsCount: post._count.comments,
      liked: post.likes.some(like => like.userId === findUser.id),
      likes: [], // Add empty array to match meme-explorer type
    }));
    return formattedPosts;
  } catch (error) {
    console.log(error);
    return []
  }
}

export const getFilterMeme = async (filter : string) => {
  try {
    console.log("getting memes");
    const user = await currentUser();
    if (!user) {
      return [];
    }
    const findUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
    if (!findUser) {
      console.log("user not found");
      return [];
    }
    const posts = await  prisma.post.findMany({
      include: {
        author: true,
        likes: true,
        _count: {
          select: { likes: true, comments: true },
        },
      },
      where : {
        caption : {
          contains : filter,
          mode : "insensitive"
        }
      }
    })
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
      commentsCount: post._count.comments,
      liked: post.likes.some(like => like.userId === findUser.id),
      likes: [], // Add empty array to match meme-explorer type
    }));
    return formattedPosts;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const uploadMeme = async (imageUrl: string, caption: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return;
    }
    const findUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
    if (!findUser) {
      console.log("user not found");
      return;
    }
    await prisma.post.create({
      data: {
        imageUrl,
        caption,
        authorId: findUser.id
      }
    })
  } catch (error) {
    console.log(error);
  }
}

// export const getMemes = async ({page = 1, limit = 10}) => {
//     const offset = (page - 1) * limit;

//     const memes = await prisma.post.findMany({
//       take: limit,
//       skip: offset,
//       include: {
//         author: true,
//         likes: true,
//         _count: { select: { comments: true } },
//       },
//     });

//     return memes;
// }


export const updateMemeLike = async (memeId: string) => {
  try {
    const user = await currentUser();
    if (!user) return;

    const findUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
    if (!findUser) {
      console.log("User not found");
      return;
    }


    const existingLike = await prisma.like.findUnique({
      where: { userId_memeId: { userId: findUser.id, memeId } },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
    } else {
      await prisma.like.create({
        data: { userId: findUser.id, memeId },
      });
    }

    const newLikesCount = await prisma.like.count({ where: { memeId } });

    console.log(newLikesCount);
    console.log(!existingLike);
    return { likesCount: newLikesCount, liked: !existingLike };
  } catch (error) {
    console.error("Error updating meme like:", error);
    throw error;
  }
};

export const getComments = async (memeId: string) => {
  try {
    const user = await currentUser();
    if (!user) return;

    const findUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
    if (!findUser) {
      console.log("User not found");
      return;
    }
    const comments = await prisma.comment.findMany({ where: { memeId: memeId } });
    console.log(comments);
    return comments;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const addComments = async (content: string, memeId: string) => {
  try {
    const user = await currentUser();
    if (!user) return;

    const findUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
    if (!findUser) {
      console.log("User not found");
      return;
    }
    const newComment = await prisma.comment.create({
      data: {
        content: content,
        userId: findUser.id,
        memeId: memeId
      }
    })
    return newComment;
  } catch (error) {
    console.log(error);
  }
}

export const top10Memes = async () => {
  try {
    const posts = await prisma.post.findMany({
      take: 10,
      orderBy: { likes: { _count: "desc" } },
      include: {
        author: true,
        likes: true,
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });
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
      commentsCount: post._count.comments,
      liked: post.likes.some(like => like.userId === post.authorId),
      likes: [], // Add empty array to match meme-explorer type
    }));
    return formattedPosts;
  } catch (error) {
    console.log(error);
    return [];
  }
}
