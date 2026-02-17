import { handleCommand } from "./services/commandHandler";
import { closePool } from "./services/db";

async function main() {
  const testChatId = parseInt(process.env.TELEGRAM_CHAT_ID ?? "0");

  console.log("Testing /start...");
  await handleCommand(testChatId, "/start");

  await closePool();
}

main().catch(console.error);
