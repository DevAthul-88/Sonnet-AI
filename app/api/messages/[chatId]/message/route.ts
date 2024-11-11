import { v4 as uuidv4 } from 'uuid';
import { prisma } from "@/lib/db"; // Adjust this import path according to your setup
const { GoogleGenerativeAI } = require("@google/generative-ai");

export async function POST(req: Request, { params }) {
  try {
    // Get chatId from the request params
    const { chatId } = params;

    // Parse the request body
    const { message: userPrompt, userId } = await req.json();

    // Validate the presence of the required fields
    if (!userPrompt || !userId || !chatId) {
      return new Response(JSON.stringify({ error: 'Prompt, userId, and chatId are required' }), { status: 400 });
    }

    // Check if chatId exists
    const chatExists = await prisma.chat.findUnique({
      where: { id: chatId },
    });

    

    // Check if the chat is archived
    if (chatExists && chatExists.archived == true) {
      return new Response(null, { status: 404, headers: { Location: '/pagenotfound' } });
    }

    // If chat does not exist, return 404
    if (!chatExists) {
      return new Response(null, { status: 404, headers: { Location: '/pagenotfound' } });
    }

    // Check the current number of messages in the chat
    const currentMessagesCount = await prisma.message.count({
      where: { chatId: chatId },
    });

    // If the message count exceeds 15, return an error response
    if (currentMessagesCount >= 15) {
      return new Response(
        JSON.stringify({ error: 'Message limit reached. You cannot send more than 15 messages in a chat.', limit: true }),
        { status: 403 }
      );
    }

    // Fetch existing messages from the database
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    });

    // Construct chat history
    const chatHistory = messages.map((msg) => ({
      role: msg.type_u === "user" ? "user" : "model", // Map user to 'user' and AI to 'model'
      parts: [{ text: msg.content }],
    }));

    // Add the user's new message to the chat history
    chatHistory.push({
      role: "user",
      parts: [{ text: userPrompt }],
    });

    // Initialize Google Generative AI with the provided API key
    const genAI = new GoogleGenerativeAI(process.env.AI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Start the chat with existing messages
    const chat = model.startChat({ history: chatHistory });

    // Send the new user message to the AI model
    let result = await chat.sendMessage(userPrompt);
    
    // Extract and process the AI response
    const aiResponse = result.response.text();

    // Handle empty or unavailable AI response
    if (!aiResponse || aiResponse.includes('AI response unavailable')) {
      return new Response(JSON.stringify({ error: 'AI response unavailable' }), { status: 500 });
    }

    // Save the user prompt in the database
    await prisma.message.create({
      data: {
        message: userPrompt, // User's input
        content: userPrompt, // Store user message
        chatId: chatId, // Associate with the existing chat
        userId: userId, // Same user who sent the message
        type_u: "user", // Indicate this message is from the user
      },
    });

    // Save the AI-generated response in the database
    await prisma.message.create({
      data: {
        message: "", // Not applicable for AI response
        content: aiResponse, // AI's response
        chatId: chatId, // Associate with the chat
        userId: userId, // Same user who sent the message
        type_u: "ai", // Indicate this message is from the AI
      },
    });

    // Return the AI response
    return new Response(JSON.stringify({ response: aiResponse }), { status: 200 });

  } catch (error) {
    console.error('Error processing request:', error);

    if (error.code === 'P2025') { // Prisma code for record not found
      return new Response(null, { status: 404, headers: { Location: '/pagenotfound' } });
    }

    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
