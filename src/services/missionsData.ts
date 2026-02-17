import fetch from "node-fetch";
import { getAccessToken } from "./epicAuth";

const WORLD_INFO_URL =
  "https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/game/v2/world/info";

const THEATER_MAP: Record<string, string> = {
  "33A2311D4AE64B361CCE27BC9F313C8B": "Stonewood",
  D477605B4FA48648107B649CE97FCF27: "Plankerton",
  E6ECBD064B153234656CB4BDE6743870: "Canny Valley",
  D9A801C5444D1C74D1B7DAB5C7C12C5B: "Twine Peaks",
};

const POWER_LEVEL_MAP: Record<string, Record<number, number>> = {
  Start: { 1: 1, 2: 3, 3: 5, 4: 9, 5: 15 },
  Normal: { 1: 19, 2: 23, 3: 28, 4: 34, 5: 40 },
  Hard: { 1: 46, 2: 52, 3: 58, 4: 64, 5: 70 },
  Nightmare: { 1: 76, 2: 82, 3: 88, 4: 94, 5: 100, 10: 108 },
  Endgame: { 1: 108, 2: 116, 3: 124, 4: 132, 5: 140, 6: 160 },
};

const VBUCKS_ITEM_TYPE = "AccountResource:currency_mtxswap";

interface MissionAlert {
  missionAlertGuid: string;
  tileIndex: number;
  availableUntil: string;
  missionAlertRewards: {
    items: RewardItem[];
  };
}

interface RewardItem {
  itemType: string;
  quantity: number;
}

export interface VBucksMission {
  id: string;
  theaterName: string;
  vbucksAmount: number;
  powerLevel: number;
  availableUntil: string;
}

export async function getVBucksMissions(): Promise<VBucksMission[]> {
  const token = await getAccessToken();

  console.log("Consulting world info");
  const response = await fetch(WORLD_INFO_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(
      `Error consulting world info (${response.status}): ${error}`,
    );
  }

  const data = await response.json();

  const vbucksMissions: VBucksMission[] = [];
  let missionDifficulty = new Map();

  // Get data from missions array and create a map with missionGuid as key and missionDifficultyInfo as value

  for (const mission of data.missions) {
    for (const item of mission.availableMissions) {
      if (mission.theaterId === "FF97186D4741CB5F2A980BB0164081D4") continue;
      const key = mission.theaterId + "-" + item.tileIndex;
      //Split rowName into parts to get zone and zoneLevel

      if (item.missionDifficultyInfo?.rowName) {
        const parts = item.missionDifficultyInfo.rowName.split("_");

        const zone = parts[1];
        const zoneLevel = parseInt(parts[parts.length - 1].replace("Zone", ""));

        const conversionValue = POWER_LEVEL_MAP[zone]?.[zoneLevel];

        missionDifficulty.set(key, conversionValue);
      }
    }
  }

  for (const alertMissions of data.missionAlerts) {
    if (alertMissions.theaterId !== "D9A801C5444D1C74D1B7DAB5C7C12C5B")
      continue;
    for (const mission of alertMissions.availableMissionAlerts) {
      const difficultyInfo = missionDifficulty.get(
        alertMissions.theaterId + "-" + mission.tileIndex,
      );
      console.log(difficultyInfo);
    }
  }

  console.log(`Missions found with Vbucks ${vbucksMissions.length}`);

  return vbucksMissions;
}
