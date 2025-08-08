export const up = (pgm) => {
  pgm.sql("ALTER TABLE users ADD COLUMN refresh_token TEXT;");
};

export const down = (pgm) => {
  pgm.sql("ALTER TABLE users DROP COLUMN refresh_token TEXT;");
};