import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

// New key so older "theme=lightMode" saves don't override the dark default.
const THEME_KEY = 'portfolio-theme'
const DEFAULT_THEME = 'darkMode'

function readStoredTheme() {
  if (typeof window === 'undefined') return DEFAULT_THEME
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'lightMode' || stored === 'darkMode') return stored
  } catch {
    // ignore
  }
  return DEFAULT_THEME
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readStoredTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(THEME_KEY, theme)
      // Drop legacy key so it can't force light mode again.
      localStorage.removeItem('theme')
    } catch {
      // ignore
    }
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'lightMode' ? 'darkMode' : 'lightMode'))

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
