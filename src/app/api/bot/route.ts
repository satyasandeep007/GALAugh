import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { message } = body;

  try {
    const chatId = message?.chat?.id; // Extract chatId once

    if (message?.text === "/start") {
      await sendMessage(chatId, `Starting the app`);
    } else if (message?.text) {
      await sendMessage(chatId, `Message Received: ${message.text}`);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Error handling the request:", error.message);
    return NextResponse.json({ status: "error", message: error.message });
  }
}

async function sendMessage(chatId: string, text: string) {
  const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }
}
