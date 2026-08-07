export const publicCache = (req, res, next) => {
  res.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  next();
};

export default publicCache;
