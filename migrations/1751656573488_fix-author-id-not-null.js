export const up = (pgm) => {
  pgm.alterColumn("articles", "author_id", {
    notNull: true,
  });
};

export const down = (pgm) => {
  pgm.alterColumn("articles", "author_id", {
    notNull: false,
  });
};