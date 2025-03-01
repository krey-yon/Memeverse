"use server";

import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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