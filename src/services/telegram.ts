import fetch from "node-fetch";
import { getConfig } from "../utils/config";
import { text } from "node:stream/consumers";

const API = "https://api.telegram.org";

async function sendMessage(chatId: string, message: string) {
  const { botToken } = getConfig().telegram;

  // Define URL
  const url = `${API}/bot${botToken}/sendMessage`;
  console.log(message);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.log(error);
  }
}

export async function sendTestMessage() {
  const { chatId } = getConfig().telegram;

  sendMessage(chatId, "Hola esta es una alerta de vbucks");
}
