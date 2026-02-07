import { useEffect } from 'react'

const ThemeProvider = ({ children }) => {
  useEffect(() => {
    const root = window.document.documentElement

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')

    if (darkModeQuery.matches) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    const handleThemeChange = (e) => {
      if (e.matches) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    darkModeQuery.addEventListener('change', handleThemeChange)

    return () => {
      darkModeQuery.removeEventListener('change', handleThemeChange)
    }
  }, [])

  return children
}

export default ThemeProvider
