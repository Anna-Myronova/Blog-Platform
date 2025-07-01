import { pool } from "../db";

export const createUser = async (
  username: string,
  email: string,
  hashedPassword: string
) => {
  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *;",
      [username, email, hashedPassword]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1;", [
      email,
    ]);
    return result.rows[0] || null;
  } catch (err) {
    console.error("Error finding user:", err);
    throw err;
  }
};

export const deleteUserById = async (id: number) => {
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *;",
      [id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error("Error deleting user:", err);
    throw err;
  }
};

export const getUserById = async (id: number) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1;", [id]);
    return result.rows[0] || null;
  } catch (err) {
    console.error("Error deleting user:", err);
    throw err;
  }
};

export const updateUser = async (
  id: number,
  username: string,
  email: string
) => {
  try {
    const result = await pool.query(
      "UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *;",
      [username, email, id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error("Error updating user:", err);
    throw err;
  }
};
