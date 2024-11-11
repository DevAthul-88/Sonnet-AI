import { v4 as uuidv4 } from 'uuid';
import { prisma } from "@/lib/db"; // Adjust this import path according to your setup
const { GoogleGenerativeAI } = require("@google/generative-ai");

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { message: userPrompt, userId } = await req.json();

    // Validate the presence of the required fields
    if (!userPrompt || !userId) {
      return new Response(JSON.stringify({ error: 'Prompt and userId are required' }), { status: 400 });
    }

    // Initialize Google Generative AI with the provided API key
    const genAI = new GoogleGenerativeAI(process.env.AI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // First AI prompt to respond to the user's message
    const modifiedPrompt = `You are a friendly chatbot. Respond to the following prompt in a helpful and informative way: "${userPrompt}"`;

    // Call the AI model to generate a response to the user's message
    const result = await model.generateContent({
      contents: [
        {
          parts: [
            {
              text: modifiedPrompt // Pass the user prompt correctly
            }
          ]
        }
      ]
    });

    // Extract and process the AI response
    const aiResponse = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    // Handle empty or unavailable AI response
    if (!aiResponse || aiResponse.includes('AI response unavailable')) {
      console.error('No valid response received from the AI.');
      return new Response(JSON.stringify({ error: 'AI response unavailable' }), { status: 500 });
    }

    // Second AI prompt to generate a creative chat name based on the conversation
    const namePrompt = `Generate a single creative and fitting chat name for the AI assistant Sonnet, who was created by Athul Vinod, based on the user's message: "${userPrompt}". The name should be concise and presented in plain text.`;    
    // Call the AI model to generate a chat name
    const nameResult = await model.generateContent({
      contents: [
        {
          parts: [
            {
              text: namePrompt
            }
          ]
        }
      ]
    });

    // Extract the chat name from the AI's response
    const chatName = nameResult?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    // Handle empty or unavailable chat name response
    if (!chatName) {
      console.error('No valid chat name received from the AI.');
      return new Response(JSON.stringify({ error: 'Chat name generation failed' }), { status: 500 });
    }

    // Create a new chat in the database with the AI-generated name
    const newChat = await prisma.chat.create({
      data: {
        id: uuidv4(),
        status: 'PRIVATE',
        archived: false,
        userId: userId,
        name: chatName.slice(0, 50) || 'Chat', // Use the AI-generated name, limit to 50 chars
      },
    });

    // Save the user prompt and AI-generated response in the database
    await prisma.message.create({
      data: {
        message: '', // User's input
        content: userPrompt, // AI's response
        chatId: newChat.id, // Associate with the chat
        userId: userId, // Same user who sent the message
        type_u: "user", // Indicate this message is from the user
      },
    });

    await prisma.message.create({
      data: {
        message: '', // User's input
        content: aiResponse, // AI's response
        chatId: newChat.id, // Associate with the chat
        userId: userId, // Same user who sent the message
        type_u: "ai", // Indicate this message is from the AI
      },
    });

    // Return the newly created chat ID and AI response
    return new Response(JSON.stringify({ chatId: newChat.id, response: aiResponse, chatName }), { status: 200 });

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
