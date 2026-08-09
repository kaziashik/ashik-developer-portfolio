// Static config only. Profile, skills, projects, experience, and education now come
// live from the backend (see src/api/ and src/contexts/ProfileContext.jsx).
// `contributions` stays static since it's not part of the backend schema.
// Leave empty to hide the Contributions section + nav link. Add entries when you
// start contributing to open source (PRs / repos).

export const contributions = [
  // Example when you have real contributions:
  // {
  //   repo: 'org/repo',
  //   name: 'Repo Name',
  //   description: 'What you contributed (bugfix, feature, docs).',
  //   url: 'https://github.com/org/repo',
  //   live: '',
  //   stack: ['React'],
  // },
]

const allNavItems = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Contributions', href: '#contributions', id: 'contributions' },
  { label: 'Contact', href: '/contact', id: 'contact', isRoute: true },
]

export const navItems = allNavItems.filter(
  (item) => item.id !== 'contributions' || contributions.length > 0,
)
