import { prisma } from "@/lib/db"; // Adjust path to match your project structure

export async function POST(req: Request, { params }: { params: { chatId: string } }) {
    const { chatId } = params;

    try {
        // Update the chat to mark it as not archived (restored)
        await prisma.chat.update({
            where: { id: chatId },
            data: { archived: false }, // Adjust the field name as per your schema
        });

        return new Response(JSON.stringify({ message: "Chat restored successfully" }), {
            status: 200,
        });
    } catch (error) {
        console.error("Error restoring chat:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        });
    }
}
