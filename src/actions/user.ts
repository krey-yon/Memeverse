"use server";

import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";



export const onAuthenticateUser = async () => {
    try {
        const user = await currentUser();
        if (!user) return false;

        const userEmail = user.emailAddresses[0]?.emailAddress;

        if (!userEmail) {
            console.error("User email not found.");
            return false;
        }

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
        if (!user) return [];

        const userPosts = await prisma.post.findMany({
            where: {
               author : {
                   clerkId : user.id
               }
            },
            include: {
                likes: true,
                comments: true
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
                        comments: true
                    }
                }
            }
        });

        const allMemes : {id : string, createdAt : Date, imageUrl: string,caption: string | null, likesCount : number, comments : {id: string,createdAt: Date,userId: string,memeId: string,content: string}[]}[] = [];

        userPosts.map((p) => {
            allMemes.push({
                id : p.id,
                createdAt : p.createdAt,
                imageUrl : p.imageUrl,
                caption : p.caption,
                likesCount : p.likes.length,
                comments : p.comments
            });
        })

        return userPosts;

    } catch (e) {
        console.log(e);
        return [];
    }
}