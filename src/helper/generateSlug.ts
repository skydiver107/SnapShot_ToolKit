export const getSlug = (title: string) => {
  return title
    ?.replace(/[^a-zA-Z]/g, "_")
    .replace(/^-+|-+(?=-|$)/g, "")
    .toLowerCase();
};
