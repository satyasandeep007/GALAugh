import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { message } = body;

  try {
    if (message?.text === "/start") {
      const chatId = message.chat.id;

      const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: `Starting the app`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      return NextResponse.json({ status: "ok" });
    } else if (message?.text) {
      const chatId = message.chat.id;

      const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: `Message Received: ${message.text}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      return NextResponse.json({ status: "ok" });
    }
  } catch (error: any) {
    console.error("Error handling the request:", error.message);
    return NextResponse.json({ status: "error", message: error.message });
  }
}
