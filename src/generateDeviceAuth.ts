// Game credentials (these are available anywhere)
const CLIENT_ID = "3f69e56c7649492c8cc29f1af08a8a12";
const CLIENT_SECRET = "b51ee9cb12234f50a69efa67ef53812e";
const BASIC_AUTH = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
  "base64",
);
const TOKEN_URL =
  "https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token";

async function main() {
  const authCode = process.argv[2];

  if (!authCode) {
    console.log("Not authCode provided");
    return;
  }

  // Method to get an access token after login with epic api
  const tokenResponse = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${BASIC_AUTH}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: authCode,
    }),
  });

  console.log("tokenResponse", tokenResponse);

  const tokenData = (await tokenResponse.json()) as {
    access_token: string;
    account_id: string;
  };

  console.log(tokenData);

  const deviceAuthUrl = `https://account-public-service-prod.ol.epicgames.com/account/api/public/account/${tokenData.account_id}/deviceAuth`;

  const deviceResponse = await fetch(deviceAuthUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "Content-Type": "application/json",
    },
  });

  const deviceData = (await deviceResponse.json()) as {
    accountId: string;
    deviceId: string;
    secret: string;
  };

  console.log(`EPIC_ACCOUNT_ID=${deviceData.accountId}`);
  console.log(`EPIC_DEVICE_ID=${deviceData.deviceId}`);
  console.log(`EPIC_DEVICE_SECRET=${deviceData.secret}`);
}

main();
