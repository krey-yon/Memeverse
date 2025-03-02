"use server"
import { currentUser } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const uploadMeme = async (imageUrl : string, caption : string) => {
    try {
        const user = await currentUser();
        if (!user) {
            return;
        }
        const findUser = await prisma.user.findUnique({where : {clerkId : user.id}});
        if (!findUser) {
            console.log("user not found");
            return;
        }
        await prisma.post.create({
            data : {
                imageUrl,
                caption,
                authorId : findUser.id
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