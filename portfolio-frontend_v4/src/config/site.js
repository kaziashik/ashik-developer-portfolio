export const SOCIAL_LINKS = {
  github: 'https://github.com/kaziashik',
  linkedin: 'https://www.linkedin.com/in/kazi-ashik96',
}

export const SITE_BRAND = 'KAZIASHIK.DEV'

export function mergeProfileLinks(profile) {
  if (!profile) {
    return { links: { ...SOCIAL_LINKS } }
  }

  return {
    ...profile,
    links: {
      ...(profile.links || {}),
      github: profile.links?.github?.trim() || SOCIAL_LINKS.github,
      linkedin: profile.links?.linkedin?.trim() || SOCIAL_LINKS.linkedin,
    },
  }
}
