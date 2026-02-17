// File to send data from the missionsData service to the Telegram bot

import { send } from "node:process";
import { getVBucksMissions } from "./services/missionsData";
import { sendDataMission } from "./services/telegram";

async function main() {
  try {
    const missions = await getVBucksMissions();

    sendDataMission(missions);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
