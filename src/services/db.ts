import { Pool } from "pg";
import { getConfig } from "../utils/config";

// Pool es un "pool de conexiones" — en vez de abrir y cerrar
// una conexión a la DB por cada query, mantiene varias abiertas
// y las reutiliza. Es más eficiente y es el patrón estándar.
const config = getConfig();

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  user: config.db.user,
  password: config.db.password,
});

// Función genérica para ejecutar cualquier query.
// Recibe el SQL y opcionalmente los parámetros.
// Los parámetros se pasan como array y se referencian
// en el SQL como $1, $2, $3... Esto previene SQL injection.
export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export async function closePool(): Promise<void> {
  await pool.end();
}
