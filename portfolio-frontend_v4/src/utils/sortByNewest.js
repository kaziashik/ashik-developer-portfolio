export function sortByNewest(list) {
  return [...(list || [])].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  )
}
