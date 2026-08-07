import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../utils/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'darkMode'

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="btn btn-ghost btn-xs btn-circle text-base-content/55 hover:text-primary"
    >
      {isDark ? <FiSun className="w-3.5 h-3.5" /> : <FiMoon className="w-3.5 h-3.5" />}
    </button>
  )
}
