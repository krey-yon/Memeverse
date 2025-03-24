"use server";

import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import {MemePost} from "@/lib/api";

export const fetchUserProfile = async () =>  {
    try {
        const user = await currentUser();
        if (!user) return;
        const finduser = await prisma.user.findUnique({where : {
            clerkId : user.id
        }})
        return finduser;
    } catch (error) {
        console.log(error);
        return;
    }
}

export const updateUser = async (data : {name : string | null, password : string | null}) => {
    try {
        const user = await currentUser();
        if (!user) return;
        await prisma.user.update({data : data, where : {clerkId : user.id}})
    } catch (error) {
        console.log(error);
    }
}

export const onAuthenticateUser = async () => {
    try {
        const user = await currentUser();
        if (!user) return false;

        const userEmail = user.emailAddresses[0]?.emailAddress;

        // if (!userEmail) {
        //     console.error("User email not found.");
        //     return false;
        // }

        // Check if user exists by either Clerk ID or email
        const userExists = await prisma.user.findFirst({
            where: {
                OR: [{ clerkId: user.id }, { email: userEmail }]
            }
        });

        if (userExists) return true; // User already exists

        // Create user
        const newUser = await prisma.user.create({
            data: {
                clerkId: user.id,
                email: userEmail,
                name: user.firstName || "Unknown",
            }
        });

        return !!newUser; // Return true if created successfully
    } catch (error) {
        console.error("Authentication Error:", error);
        return false;
    }
};

export const fetchUserMemes = async () => {
    try {
        const user = await currentUser();

        if (!user) {
            console.log("no user");
            return;
        }

        const userPosts = await prisma.post.findMany({
            where: {
               author : {
                   clerkId : user.id
               }
            },
            include: {
                likes: true,
                comments: true,
                author : true

            }
        });

        const likedPosts = await prisma.like.findMany({
            where: {
                user : {
                    clerkId : user.id
                }
            },
            include: {
                meme: {
                    include: {
                        likes: true,
                        comments: true,
                        author : true

                    }
                }
            }
        });


        const allMemes: MemePost[] = [
            ...userPosts.map((p) => ({
                id: p.id,
                author: { id: p.author.id, name: p.author.name! },
                authorId: p.authorId,
                caption: p.caption!,
                commentsCount: p.comments.length,
                createdAt: p.createdAt.toString(),
                imageUrl: p.imageUrl,
                likesCount: p.likes.length,
                likes: p.likes,
            })),
            ...likedPosts.map((p) => ({
                id: p.meme.id,
                author: { id: p.meme.author.id, name: p.meme.author.name! },
                authorId: p.meme.authorId,
                caption: p.meme.caption!,
                commentsCount: p.meme.comments.length,
                createdAt: p.meme.createdAt.toString(),
                imageUrl: p.meme.imageUrl,
                likesCount: p.meme.likes.length,
                likes: p.meme.likes,
            })),
        ];

        const uniqueMemes = allMemes.filter(
            (meme, index, self) =>
                index === self.findIndex((m) => m.id === meme.id)
        );

        return uniqueMemes;
    } catch (e) {
        console.log(e);
        return [];
    }
}