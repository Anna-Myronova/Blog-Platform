import { pool } from "../db";

export const createComment = async (
  articleId: number,
  userId: number,
  content: string
) => {
  try {
    const result = await pool.query(
      "INSERT INTO comments (article_id, user_id, content) VALUES ($1, $2, $3) RETURNING *;",
      [articleId, userId, content]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error creating comment:", err);
    throw err;
  }
};

export const getCommentById = async (id: number) => {
  // public func
  try {
    const result = await pool.query(
      "SELECT * FROM comments WHERE user_id = $1 AND id = $2",
      [id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error("Error finding comment:", err);
    throw err;
  }
};

export const deleteCommentById = async (userId: number, id: number) => {
  try {
    const result = await pool.query(
      "DELETE FROM comments WHERE user_id = $1 AND id = $2 RETURNING *",
      [userId, id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error("Error deleting comment:", err);
    throw err;
  }
};

export const getCommentsByArticleId = async (
  articleId: number,
  limit: number,
  offset: number
) => {
  try {
    const finalLimit = Math.max(Math.min(limit, 20), 1);
    const result = await pool.query(
      `SELECT * FROM comments
       WHERE article_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3;`,
      [articleId, finalLimit, offset]
    );
    return result.rows;
  } catch (err) {
    console.error("Error fetching comments with pagination:", err);
    throw err;
  }
};