import { prisma } from "@/lib/db"; // Adjust path to match your project structure

export async function DELETE(req: Request, { params }: { params: { chatId: string } }) {
    const { chatId } = params;

    try {
        // Delete all messages related to the chat first
        await prisma.message.deleteMany({
            where: { chatId:chatId },
        });

        // Then delete the chat itself
        await prisma.chat.delete({
            where: { id: chatId },
        });

        return new Response(JSON.stringify({ message: "Chat and its messages deleted successfully" }), {
            status: 200,
        });
    } catch (error) {
        console.error("Error deleting chat:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        });
    }
}
