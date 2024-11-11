import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: NextRequest) {
    try {
        // Retrieve the authenticated user's ID
        const user = await getCurrentUser();
        const userId = user?.id;

        // If the user is not authenticated, return a 401 Unauthorized response
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch all chats associated with the authenticated user, including only the first message of each chat and the chat creator's information
        const chats = await prisma.chat.findMany({
            where: { userId, archived: true },
            select: {
                id: true,
                name: true,
                createdAt: true,
                status: true,
                user: {  // Include the user who created the chat
                    select: {
                        image: true,
                        id: true,
                        name: true, // Adjust fields as necessary (e.g., email)
                    },
                },
                messages: {
                    orderBy: { createdAt: "asc" },
                    take: 1, // Only the first message per chat
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        type_u: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Return the list of chats, including each chat's first message and creator's information
        return NextResponse.json({ chats }, { status: 200 });
    } catch (error) {
        console.error("Error fetching chats and messages:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
