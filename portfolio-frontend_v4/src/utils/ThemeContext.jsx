import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

// Bump key when default theme changes so old auto-saved values don't stick.
const THEME_KEY = 'portfolio-theme-v2'
const DEFAULT_THEME = 'lightMode'

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
      localStorage.removeItem('theme')
      localStorage.removeItem('portfolio-theme')
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
