import { Pool } from "pg";
import { getConfig } from "../utils/config";

const config = getConfig();

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  user: config.db.user,
  password: config.db.password,
});

export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export async function closePool(): Promise<void> {
  await pool.end();
}

export async function addSubscriber(chatId: number): Promise<void> {
  await query(
    `INSERT INTO subscribers (chat_id, active)
     VALUES ($1, true)
     ON CONFLICT (chat_id)
     DO UPDATE SET active = true`,
    [chatId],
  );
}

export async function removeSubscriber(chatId: number): Promise<void> {
  await query(`UPDATE subscribers SET active = false WHERE chat_id = $1`, [
    chatId,
  ]);
}

export async function getActiveSubscribers(): Promise<{ chat_id: number }[]> {
  return query<{ chat_id: number }>(
    `SELECT chat_id FROM subscribers WHERE active = true`,
  );
}

export async function isSubscribed(chatId: number): Promise<boolean> {
  const result = await query<{ active: boolean }>(
    `SELECT active FROM subscribers WHERE chat_id = $1`,
    [chatId],
  );
  return result.length > 0 && !!result[0]?.active;
}
