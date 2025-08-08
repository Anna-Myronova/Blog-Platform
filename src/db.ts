import { Pool } from "pg";
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: envFile });

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool
  .query("SELECT NOW()")
  .then((res) => {
    console.log("✅ Успішне підключення до бази даних:", res.rows[0]);
  })
  .catch((err) => {
    console.error("❌ Помилка підключення до бази даних:", err.message);
  });