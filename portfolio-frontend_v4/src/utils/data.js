// Static config only. Profile, skills, projects, experience, and education now come
// live from the backend (see src/api/ and src/contexts/ProfileContext.jsx).
// `contributions` stays static since it's not part of the backend schema.

export const navItems = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Contributions', href: '#contributions', id: 'contributions' },
  { label: 'Contact', href: '/contact', id: 'contact', isRoute: true },
]

export const contributions = [
  {
    repo: 'open-source/library-one',
    description: 'Short note on the bug fixed, feature added, or docs improved.',
    url: 'https://github.com/open-source/library-one',
    stars: 1200
  },
  {
    repo: 'open-source/library-two',
    description: 'Short note on the bug fixed, feature added, or docs improved.',
    url: 'https://github.com/open-source/library-two',
    stars: 480
  }
]
