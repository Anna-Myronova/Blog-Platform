export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE user_interests (
      user_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      priority INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (user_id, tag_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
  `);
};

export const down = (pgm) => {
  pgm.sql('DROP TABLE user_interests;');
};