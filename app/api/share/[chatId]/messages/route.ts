import { prisma } from "@/lib/db"; // Adjust this import path according to your setup

export async function GET(req: Request, { params }: { params: { chatId: string } }) {
  const { chatId } = params;

  try {
    // Fetch the chat details along with messages
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }, // Order messages by creation date
        },
      },
    });

    // If the chat is not found or if the status is PRIVATE, return a 404 error
    if (!chat || chat.status === 'PRIVATE') {
      return new Response(JSON.stringify({ error: 'Chat not found' }), { status: 404 });
    }

    // Return the chat and its associated messages
    return new Response(JSON.stringify({ chat }), { status: 200 });
  } catch (error) {
    console.error('Error fetching chat:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
