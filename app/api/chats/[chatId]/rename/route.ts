import { prisma } from "@/lib/db"; // Adjust this import path according to your setup

export async function POST(req: Request, { params }: { params: { chatId: string } }) {
  const { chatId } = params;

  try {
    // Parse the request body to get the new chat name
    const { newName } = await req.json();

    // Check if the new name is provided
    if (!newName) {
      return new Response(JSON.stringify({ error: 'New name is required' }), { status: 400 });
    }

    // Find and update the chat's name in the database
    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: { name: newName }, // Update the chat name
    });

    // If the chat doesn't exist, return a 404 response
    if (!updatedChat) {
      return new Response(JSON.stringify({ error: 'Chat not found' }), { status: 404 });
    }

    // Return a success message with the updated chat details
    return new Response(JSON.stringify({ message: 'Chat renamed successfully', chat: updatedChat }), { status: 200 });
  } catch (error) {
    console.error('Error renaming chat:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
