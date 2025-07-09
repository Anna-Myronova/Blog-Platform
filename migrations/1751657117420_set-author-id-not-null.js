export const up = (pgm) => {
  pgm.sql('ALTER TABLE articles ALTER COLUMN author_id SET NOT NULL;');
};

export const down = (pgm) => {
  pgm.sql('ALTER TABLE articles ALTER COLUMN author_id DROP NOT NULL;');
};