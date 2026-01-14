import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'
type CalculatedTheme = Extract<Theme, 'dark' | 'light'>

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  calculatedTheme: CalculatedTheme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | null>(null)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  )

  const [calculatedTheme, setCalculatedTheme] = useState<CalculatedTheme>(() =>
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme,
  )

  const setThemeClass = (newTheme: Extract<Theme, 'dark' | 'light'>) => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(newTheme)
    setCalculatedTheme(newTheme)
  }

  useEffect(() => {
    if (theme === 'system') {
      const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')

      setThemeClass(mediaQueryList.matches ? 'dark' : 'light')

      const handleMediaQueryChange = (event: MediaQueryListEvent) => {
        const newTheme = event.matches ? 'dark' : 'light'
        setThemeClass(newTheme)
      }

      mediaQueryList.addEventListener('change', handleMediaQueryChange)

      return () => {
        mediaQueryList.removeEventListener('change', handleMediaQueryChange)
      }
    }

    setThemeClass(theme)

    return () => {}
  }, [theme])

  // listen to the storage event to update the theme when the theme is changed in another window
  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === storageKey) {
        setTheme(event.newValue as Theme)
      }
    }

    window.addEventListener('storage', handleStorageEvent)

    return () => {
      window.removeEventListener('storage', handleStorageEvent)
    }
  }, [storageKey])

  const value = {
    theme,
    calculatedTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext {...props} value={value}>
      {children}
    </ThemeProviderContext>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === null) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
