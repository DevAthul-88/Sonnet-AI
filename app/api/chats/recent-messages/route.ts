import { prisma } from "@/lib/db"; // Adjust this import path according to your setup
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
  // Authenticate user
  const user = await getCurrentUser();
  const userId = user?.id;

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    // Fetch the latest 5 messages for the authenticated user
    const messages = await prisma.chat.findMany({
      where: { userId, archived:false },
      orderBy: { createdAt: 'desc' },
      take: 5, // Fetch only 5 recent messages
    });

    return new Response(JSON.stringify({ messages }), { status: 200 });
  } catch (error) {
    console.error('Error fetching recent messages:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
