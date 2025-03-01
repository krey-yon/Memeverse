"use server"

import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const onAuthenticateUser = async () => {
    try {
        const user = await currentUser();
        if (!user) {
            return false;
        }
        const userExists = await prisma.user.findUnique({
            where : {
                clerkId : user.id
            }
        })
        if (userExists) return true;
        const newUser = await prisma.user.create({
            data : {
                clerkId : user.id,
                email : user.emailAddresses[0].emailAddress,
                name : user.firstName,
            }
        })
        if (newUser) return true;
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}