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
        await prisma.post.create({
            data : {
                imageUrl,
                caption,
                author : {
                    connect : {
                        clerkId : user?.id
                    }
                }
            }
        })
    } catch (error) {
        console.log(error);
    }
}
