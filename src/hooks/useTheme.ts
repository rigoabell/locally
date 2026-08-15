import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

function getPreferredTheme(): Theme {
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // ignore private-mode storage errors
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.style.colorScheme = theme
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() =>
    typeof document === 'undefined' ? 'light' : getPreferredTheme(),
  )

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // ignore
    }
  }, [theme])

  return {
    theme,
    setTheme: setThemeState,
    toggleTheme: () => setThemeState((current) => (current === 'dark' ? 'light' : 'dark')),
  }
}
