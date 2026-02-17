import { getAccessToken } from "./services/epicAuth";

async function main() {
  try {
    const token = await getAccessToken();
    console.log("Token:", token.substring(0, 10) + "...");
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
