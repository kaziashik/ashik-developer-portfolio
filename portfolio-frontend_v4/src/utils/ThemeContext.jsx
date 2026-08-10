import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

// v3: default follows browser/OS preference unless user toggles.
const THEME_KEY = 'portfolio-theme-v3'
const DEFAULT_PREFERENCE = 'system'

function getSystemTheme() {
  if (typeof window === 'undefined') return 'lightMode'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'darkMode' : 'lightMode'
}

function readStoredPreference() {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCE
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'system' || stored === 'lightMode' || stored === 'darkMode') return stored
  } catch {
    // ignore
  }
  return DEFAULT_PREFERENCE
}

function resolveTheme(preference) {
  return preference === 'system' ? getSystemTheme() : preference
}

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(readStoredPreference)
  const [theme, setTheme] = useState(() => resolveTheme(readStoredPreference()))

  useEffect(() => {
    const apply = (nextPreference) => {
      const resolved = resolveTheme(nextPreference)
      setTheme(resolved)
      document.documentElement.setAttribute('data-theme', resolved)
    }

    apply(preference)

    try {
      localStorage.setItem(THEME_KEY, preference)
      localStorage.removeItem('theme')
      localStorage.removeItem('portfolio-theme')
      localStorage.removeItem('portfolio-theme-v2')
    } catch {
      // ignore
    }

    if (preference !== 'system') return undefined

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => apply('system')

    if (media.addEventListener) media.addEventListener('change', onChange)
    else media.addListener(onChange)

    return () => {
      if (media.removeEventListener) media.removeEventListener('change', onChange)
      else media.removeListener(onChange)
    }
  }, [preference])

  const toggleTheme = () => {
    setPreference((current) => {
      const resolved = resolveTheme(current)
      return resolved === 'darkMode' ? 'lightMode' : 'darkMode'
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, preference, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
