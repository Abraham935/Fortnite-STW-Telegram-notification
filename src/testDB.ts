import { query, closePool } from "./services/db";

async function main() {
  try {
    const result = await query<{ now: Date }>("SELECT NOW()");
    console.log("Conexión exitosa. Hora del servidor:", result);
  } catch (error) {
    console.error("Error conectando a la DB:", error);
  } finally {
    await closePool();
  }
}

main();
