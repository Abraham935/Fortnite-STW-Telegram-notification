import fetch from "node-fetch";
import { getConfig } from "../utils/config";
import { VBucksMission } from "./missionsData";

const API = "https://api.telegram.org";
const { botToken, chatId } = getConfig().telegram;

export async function sendMessage(chatId: string, message: string) {
  const url = `${API}/bot${botToken}/sendMessage`;

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
  sendMessage(chatId, "Hola esta es una alerta de vbucks");
}

export async function sendDataMission(data: VBucksMission[]) {
  if (data.length === 0) {
    sendMessage(chatId, "No hay misiones de V-Bucks hoy");
    return;
  }

  let message = "Misiones de V-Bucks hoy:\n";
  data.forEach((mission) => {
    message += `- ${mission.theaterName}: ${mission.vbucksAmount} V-Bucks\n`;
  });
  sendMessage(chatId, message);
}
