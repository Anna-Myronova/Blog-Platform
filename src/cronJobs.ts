import cron from "node-cron";
import { pool } from "./db";

export const startEachTwoMinutesPriorityDecay = () => {
  cron.schedule("0 0 */3 * *", async () => {
    console.log("Running each-two-day priority decay...");
    try {
      await pool.query(
        "UPDATE user_interests SET priority = FLOOR(priority / 2);"
      );
      console.log("Priorities updated.");
    } catch (err) {
      console.error("Error updating priorities:", err);
    }
  });
};
