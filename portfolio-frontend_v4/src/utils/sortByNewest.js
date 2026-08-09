export function sortByNewest(list) {
  if (!Array.isArray(list)) return []
  return [...list].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  )
}
