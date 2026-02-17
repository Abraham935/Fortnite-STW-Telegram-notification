import fetch from "node-fetch";
import { getConfig } from "../utils/config";

const CLIENT_ID = "3f69e56c7649492c8cc29f1af08a8a12";
const CLIENT_SECRET = "b51ee9cb12234f50a69efa67ef53812e";
const BASIC_AUTH = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
  "base64",
);

const TOKEN_URL =
  "https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token";

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 300_000) {
    console.log("Using exisitng cache");
    return cachedToken.token;
  }

  const config = getConfig();

  console.log("Getting new token");

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${BASIC_AUTH}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "device_auth",
      account_id: config.epic.accountId,
      device_id: config.epic.deviceId,
      secret: config.epic.secret,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error (${response.status}): ${error}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_at: string;
  };

  cachedToken = {
    token: data.access_token,
    expiresAt: new Date(data.expires_at).getTime(),
  };

  console.log("New token expires at:", data.expires_at);

  return data.access_token;
}
