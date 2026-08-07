import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

// Defaults to light mode. Persists the user's choice in localStorage
// and falls back to "lightMode" on first visit (no system-preference override).
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'lightMode'
    return localStorage.getItem('theme') || 'lightMode'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'lightMode' ? 'darkMode' : 'lightMode'))

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
