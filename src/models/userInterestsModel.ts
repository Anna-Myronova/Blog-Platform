import { pool } from "../db";
import { PoolClient } from "pg";

export const getUserInterests = async (userId: number) => {
  try {
    const result = await pool.query(
      `SELECT tags.name FROM user_interests 
        JOIN tags ON user_interests.tag_id = tags.id
        WHERE user_interests.user_id = $1`,
      [userId]
    );
    return result.rows;
  } catch (err) {
    console.error("Error finding interests:", err);
    throw err;
  }
};

export const setStartPriority = async (interests: string[], userId: number) => {
  const client: PoolClient = await pool.connect();
  try {
    await client.query("BEGIN");

    if (!interests || interests.length === 0) {
      throw new Error("At least 1 interest must be chosen");
    }

    const priority = 2;

    for (let interest of interests) {
      const tag = await client.query("SELECT id FROM tags WHERE name = $1", [
        interest,
      ]);
      await client.query(
        "INSERT INTO user_interests (user_id, tag_id, priority) VALUES ($1, $2, $3)",
        [userId, tag.rows[0].id, priority]
      );
    }

    await client.query("COMMIT");

    return interests;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error setting priority:", err);
    throw err;
  } finally {
    client.release();
  }
};

export const getUserInterestsCount = async (userId: number) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM user_interests WHERE user_id = $1 AND priority > 0",
      [userId]
    );
    return Number(result.rows[0].count);
  } catch (err) {
    console.error("Error finding interests:", err);
    throw err;
  }
};

export const getFeed = async (
  userId: number,
  limit: number,
  offset: number
) => {
  try {
    const finalLimit = Math.max(Math.min(limit, 10), 1);

    const tags = await pool.query(
      `SELECT tags.id FROM user_interests
      WHERE user_id = $1
      ORDER BY priority DESC
      `,
      [userId]
    );

    const tagIds = tags.rows.map((row) => row.id);

    const result = await pool.query(
      `SELECT DISTINCT articles.*
      FROM articles
      JOIN article_tags ON articles.id = article_tags.article_id
      WHERE article_tags.tag_id = ANY($1)
      ORDER BY articles.created_at DESC
      LIMIT $2 OFFSET $3;`,
      [tagIds, finalLimit, offset]
    );
    return result.rows;
  } catch (err) {
    console.error("Error getting feed:", err);
    throw err;
  }
};
