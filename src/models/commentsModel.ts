import { noUnrecognized } from "zod/v3";
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

export const getCommentById = async (userId: number, commentId: number) => {
  // public func
  try {
    const result = await pool.query(
      "SELECT * FROM comments WHERE user_id = $1 AND id = $2",
      [userId, commentId]
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

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM comments WHERE article_id = $1;`,
      [articleId]
    );
    const total = parseInt(countResult.rows[0].count, 10);

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

export const updateCommentById = async (
  newContent: string,
  commentId: number,
  userId: number
) => {
  try {
    const result = await pool.query(
      "UPDATE comments SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [newContent, commentId, userId]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error updating comment:", err);
    throw err;
  }
};

export const checkIfUserIsAuthorComment = async (commentId: number) => {
  try {
    const result = await pool.query(
      "SELECT user_id FROM comments WHERE id = $1",
      [commentId]
    );

    if (result.rows.length === 0) return null;

    return result.rows[0].user_id;
  } catch (err) {
    console.error("Error checking if user is author of the comment:", err);
    throw err;
  }
};

export const countTotalCommentsByArticleId = async (articleId: number) => {
  try {
    const totalSum = await pool.query(
      "SELECT COUNT(*) FROM comments WHERE article_id = $1;",
      [articleId]
    );

    return totalSum;
  } catch (err) {
    console.error(`Error counting total comments`, err);
    throw err;
  }
};
