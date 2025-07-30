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

    const tagsId = await pool.query(
      `SELECT tag_id FROM article_tags WHERE article_id = $1`,
      [articleId]
    );

    for (let row of tagsId.rows) {
      await pool.query(
        `INSERT INTO user_interests (user_id, tag_id, priority)
         VALUES ($1, $2, 1)
         ON CONFLICT (user_id, tag_id)
         DO UPDATE SET priority = user_interests.priority + 1`,
        [userId, row.tag_id]
      );
    }

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
    if (!(await hasLiked(userId, articleId))) {
      throw new Error("User didn't like this article.");
    }

    const result = await pool.query(
      "DELETE FROM likes WHERE user_id = $1 AND article_id = $2 RETURNING *;",
      [userId, articleId]
    );

        const tagsId = await pool.query(
      `SELECT tag_id FROM article_tags WHERE article_id = $1`,
      [articleId]
    );

    for (let row of tagsId.rows) {
      await pool.query(
        `UPDATE user_interests
         SET priority = GREATEST(priority - 1, 0)
         WHERE user_id = $1 AND tag_id = $2`,
        [userId, row.tag_id]
      );
    }

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

export const countTotalLikes = async (articleId: number) => {
  try {
    const totalSum = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE article_id = $1;", [articleId]
    );

    return totalSum;
  } catch (err) {
        console.error(
      `Error counting total likes`,
      err
    );
    throw err;
  }
}
