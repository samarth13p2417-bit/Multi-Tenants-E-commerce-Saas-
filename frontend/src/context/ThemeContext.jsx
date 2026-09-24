import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({
  theme: 'system', // 'light' | 'dark' | 'system'
  resolvedTheme: 'light', // 'light' | 'dark'
  setTheme: () => {},
  toggleTheme: () => {},
})

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('omnimarket_theme')
      return saved && ['light', 'dark', 'system'].includes(saved) ? saved : 'light'
    } catch {
      return 'light'
    }
  })

  const [resolvedTheme, setResolvedTheme] = useState('light')

  useEffect(() => {
    const root = document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      let isDark = false
      if (theme === 'dark') {
        isDark = true
      } else if (theme === 'light') {
        isDark = false
      } else {
        isDark = mediaQuery.matches
      }

      if (isDark) {
        root.classList.add('dark')
        root.setAttribute('data-theme', 'dark')
        root.style.colorScheme = 'dark'
        setResolvedTheme('dark')
      } else {
        root.classList.remove('dark')
        root.setAttribute('data-theme', 'light')
        root.style.colorScheme = 'light'
        setResolvedTheme('light')
      }
    }

    applyTheme()

    try {
      localStorage.setItem('omnimarket_theme', theme)
    } catch (e) {
      console.warn('Unable to persist theme to localStorage', e)
    }

    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handleSystemChange)
    return () => mediaQuery.removeEventListener('change', handleSystemChange)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext
