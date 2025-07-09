import { pool } from "../db";

export const likeArticle = async (userId: number, articleId: number) => {
  try {
    
    if (await hasLiked(userId, articleId)) {
      throw new Error("User already liked this article.");
    }
    const result = await pool.query(
      "INSERT INTO likes (user_id, article_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *;",
      [userId, articleId]
    );
    return result.rows[0];
  } catch (err) {
    console.error(
      `Error liking article (userId: ${userId}, articleId: ${articleId}):`,
      err
    );
    throw err;
  }
};

export const unlikeArticle = async (userId: number, articleId: number) => {
  try {

    if (!( await hasLiked(userId, articleId))) {
      throw new Error("User didn't like this article.");
    }

    const result = await pool.query(
      "DELETE FROM likes WHERE user_id = $1 AND article_id = $2 RETURNING *;",
      [userId, articleId]
    );
    return result.rows[0];
  } catch (err) {
    console.error(
      `Error unliking article (userId: ${userId}, articleId: ${articleId}):`,
      err
    );
    throw err;
  }
};

export const hasLiked = async (userId: number, articleId: number) => {
  const result = await pool.query(
    "SELECT 1 FROM likes WHERE user_id = $1 AND article_id = $2;",
    [userId, articleId]
  );

  return (result.rowCount ?? 0) > 0;
};