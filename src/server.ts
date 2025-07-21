import app from "./app";
import { pool } from "./db";
import { startEachTwoMinutesPriorityDecay } from "./cronJobs";

const PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;

async function checkConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Connected to PostgreSQL. Server time:", res.rows[0].now);

    app.listen(PORT, () => {
      console.log(`Server is working on http://localhost:${PORT}`);
    });

    startEachTwoMinutesPriorityDecay();
  } catch (err) {
    console.error("Error connecting to database:", err);
    process.exit(1);
  }
}

checkConnection();
