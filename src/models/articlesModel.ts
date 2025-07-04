import { pool } from "../db";

export const createArticle = async (
  userId: number,
  title: string,
  content: string
) => {
  try {
    const result = await pool.query(
      'INSERT INTO articles (author_id, title, content) VALUES ($1, $2, $3) RETURNING *;',
      [userId, title, content]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error creating article:", err);
    throw err;
  }
};

export const getArticleById = async (id: number, userId: number) => {
  try {
    const result = await pool.query(
      'SELECT * FROM articles WHERE id = $1 AND author_id = $2;',
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
    const finalLimit = Math.max(Math.min(limit, 20), 1);
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
      'DELETE FROM articles WHERE author_id = $1 AND id = $2 RETURNING *;',
      [userId, id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error("Error deleting article:", err);
    throw err;
  }
};
