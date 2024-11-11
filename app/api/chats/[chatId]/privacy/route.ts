import { prisma } from "@/lib/db"; // Adjust the path to match your project structure

export async function PUT(req: Request, { params }: { params: { chatId: string } }) {
    const { chatId } = params;

    try {
        // Parse the request body to get the new status
        const { status } = await req.json();

        // Validate the status
        if (status !== "PUBLIC" && status !== "PRIVATE") {
            return new Response(JSON.stringify({ error: "Invalid status provided" }), {
                status: 400,
            });
        }

        // Update the chat's privacy status
        const updatedChat = await prisma.chat.update({
            where: { id: chatId },
            data: { status },
        });

        return new Response(
            JSON.stringify({
                message: "Privacy setting updated successfully",
                chat: { id: updatedChat.id, status: updatedChat.status },
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating privacy setting:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        });
    }
}
