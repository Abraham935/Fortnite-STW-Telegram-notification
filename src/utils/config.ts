import dotenv from "dotenv";

dotenv.config();

export function getConfig() {
  return {
    epic: {
      accountId: requireEnv("EPIC_ACCOUNT_ID"),
      deviceId: requireEnv("EPIC_DEVICE_ID"),
      secret: requireEnv("EPIC_DEVICE_SECRET"),
    },
    telegram: {
      botToken: requireEnv("TELEGRAM_BOT_TOKEN"),
      chatId: requireEnv("TELEGRAM_CHAT_ID"),
    },
    db: {
      host: process.env.DB_HOST ?? "localhost",
      port: parseInt(process.env.DB_PORT ?? "5432"),
      name: process.env.DB_NAME ?? "fortnite-stw",
      user: process.env.DB_USER ?? "postgres",
      password: requireEnv("DB_PASSWORD"),
    },
  };
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno: ${name}`);
  }
  return value;
}
