import { getVBucksMissions } from "./services/missionsData";

async function main() {
  try {
    const missions = await getVBucksMissions();

    if (missions.length === 0) {
      console.log("No hay misiones de V-Bucks hoy");
      return;
    }

    console.log(`\nMisiones de V-Bucks encontradas:\n`);
    for (const mission of missions) {
      console.log(
        `  ${mission.vbucksAmount} V-Bucks — ${mission.theaterName} (tile ${mission.powerLevel})`,
      );
      console.log(`  Disponible hasta: ${mission.availableUntil}\n`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
