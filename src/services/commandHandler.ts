import { addSubscriber, removeSubscriber, isSubscribed } from "./db";
import { getVBucksMissions } from "./missionsData";
import { sendMessage } from "./telegram";

export async function handleCommand(
  chatId: number,
  text: string,
): Promise<void> {
  const command = text.trim().toLowerCase();

  switch (command) {
    case "/start":
      await handleStart(chatId);
      break;
    case "/stop":
      await handleStop(chatId);
      break;
    case "/today":
      await handleToday(chatId);
      break;
    default:
      await sendMessage(
        String(chatId),
        "Comandos disponibles:\n/start - Suscribirte a alertas de V-Bucks\n/stop - Dejar de recibir alertas\n/today - Ver misiones de V-Bucks de hoy",
      );
  }
}

async function handleStart(chatId: number): Promise<void> {
  const alreadySubscribed = await isSubscribed(chatId);

  if (alreadySubscribed) {
    await sendMessage(
      String(chatId),
      "Ya estás suscrito a las alertas de V-Bucks!",
    );
    return;
  }

  await addSubscriber(chatId);
  await sendMessage(
    String(chatId),
    "Suscripción activada! Vas a recibir una notificación cada vez que haya misiones de V-Bucks en STW.",
  );
}

async function handleStop(chatId: number): Promise<void> {
  await removeSubscriber(chatId);
  await sendMessage(
    String(chatId),
    "Suscripción desactivada. Ya no recibirás alertas. Puedes volver con /start cuando quieras.",
  );
}

async function handleToday(chatId: number): Promise<void> {
  const missions = await getVBucksMissions();

  if (missions.length === 0) {
    await sendMessage(String(chatId), "No hay misiones de V-Bucks hoy.");
    return;
  }

  let message = "Misiones de V-Bucks hoy:\n\n";
  for (const mission of missions) {
    message += `${mission.vbucksAmount} V-Bucks — ${mission.theaterName} (PL ${mission.powerLevel})\n`;
  }

  await sendMessage(String(chatId), message);
}
