import { callbackify } from "util";
import { pool } from "../db";
import { createTag, getTagByName } from "./tagsModel";
import { PoolClient } from "pg";

export const createArticle = async (
  userId: number,
  title: string,
  content: string,
  tags?: string[]
) => {
  const client: PoolClient = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO articles (author_id, title, content) VALUES ($1, $2, $3) RETURNING *;`,
      [userId, title, content]
    );

    const articleId = result.rows[0].id;
    const uniqueTags = [...new Set(tags ?? [])];

    if (uniqueTags && uniqueTags.length > 0) {
      for (let tagName of uniqueTags) {
        const existingTag = await getTagByName(tagName, client);
        let tagId: number;

        if (!existingTag) {
          const newTag = await createTag(tagName, client);
          tagId = newTag.id;
        } else {
          tagId = existingTag.id;
        }

        await client.query(
          "INSERT INTO article_tags (article_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;",
          [articleId, tagId]
        );
      }
    }

    await client.query("COMMIT");

    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating article:", err);
    throw err;
  } finally {
    client.release();
  }
};

export const getArticleById = async (id: number, userId: number) => {
  try {
    const result = await pool.query(
      "SELECT * FROM articles WHERE id = $1 AND author_id = $2;",
      [id, userId]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error("Error finding article:", err);
    throw err;
  }
};

export const getArticlesByUserId = async (
  userId: number,
  limit: number,
  offset: number
) => {
  try {
    const finalLimit = Math.max(Math.min(limit, 10), 1);
    const result = await pool.query(
      `SELECT * FROM articles
       WHERE author_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3;`,
      [userId, finalLimit, offset]
    );
    return result.rows;
  } catch (err) {
    console.error("Error fetching articles with pagination:", err);
    throw err;
  }
};

export const deleteArticleById = async (userId: number, id: number) => {
  try {
    const result = await pool.query(
      "DELETE FROM articles WHERE author_id = $1 AND id = $2 RETURNING *;",
      [userId, id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error("Error deleting article:", err);
    throw err;
  }
};

export const updateArticleById = async (
  title: string,
  content: string,
  articleId: number,
  userId: number
) => {
  try {
    const result = await pool.query(
      "UPDATE articles SET title = $1, content = $2 WHERE id = $3 AND author_id = $4 RETURNING *;",
      [title, content, articleId, userId]
    );

    return result.rows[0];
  } catch (err) {
    console.error("Error updating article:", err);
    throw err;
  }
};

export const getArticleByIdWithoutUserCheck = async (id: number) => {
  try {
    const result = await pool.query("SELECT * FROM articles WHERE id = $1;", [
      id,
    ]);
    return result.rows[0] || null;
  } catch (err) {
    console.error("Error finding article:", err);
    throw err;
  }
};
