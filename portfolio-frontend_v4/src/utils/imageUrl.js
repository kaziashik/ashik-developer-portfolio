const CLOUDINARY_HOST = 'res.cloudinary.com'

export function optimizeImageUrl(url, { width = 640, quality = 80 } = {}) {
  if (!url) return url

  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes(CLOUDINARY_HOST)) return url

    const parts = parsed.pathname.split('/')
    const uploadIndex = parts.indexOf('upload')
    if (uploadIndex === -1) return url

    const transform = `w_${width},f_auto,q_${quality},c_fill`
    parts.splice(uploadIndex + 1, 0, transform)
    parsed.pathname = parts.join('/')
    return parsed.toString()
  } catch {
    return url
  }
}
