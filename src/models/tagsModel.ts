import { pool } from "../db";
import { PoolClient } from "pg";

export const createTag = async (name: string, client: PoolClient) => {
  try {
    const result = await client.query(
      "INSERT INTO tags (name) VALUES ($1) RETURNING *;",
      [name]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error creating tag:", err);
    throw err;
  }
};

export const getAllTags = async () => {
  try {
    const result = await pool.query("SELECT * FROM tags ORDER BY name;");
    return result.rows;
  } catch (err) {
    console.error("Error finding tags:", err);
    throw err;
  }
};

export const getTagByName = async (name: string, client: PoolClient) => {
  const result = await client.query("SELECT * FROM tags WHERE name = $1;", [name]);
  return result.rows[0] || null;
};

// Table "public.tags"
//  Column |  Type   | Collation | Nullable |             Default
// --------+---------+-----------+----------+----------------------------------
//  id     | integer |           | not null | nextval('tags_id_seq'::regclass)
//  name   | text    |           | not null |
