import { prisma } from "@/lib/db"; // Adjust this import path according to your setup
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request, { params }: { params: { chatId: string } }) {
  const { chatId } = params;



  // Simulate user authentication (replace with actual authentication logic)
  const userId = await authenticateUser(req); // Implement this function to get the current user's ID

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    // Fetch the chat details along with messages
    const chat = await prisma.chat.findUnique({
      where: { id: chatId }, // Look for the chat with the given chatId
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }, // Order messages by creation date
        },
      },
    });

    // If no chat is found or the current user is not authorized, return a 404 error
    if (!chat || chat.userId !== userId) {
      return new Response(JSON.stringify({ error: 'Chat not found' }), { status: 404 });
    }

    // Return the chat and its associated messages
    return new Response(JSON.stringify({ chat }), { status: 200 });
  } catch (error) {
    console.error('Error fetching chat:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

// Example authentication function (replace with your own logic)
async function authenticateUser(req: Request) {
  const user = await getCurrentUser();
  return user?.id;
}
