import React, { useMemo } from 'react'

export type ITheme = 'light' | 'dark' | 'system'

export const DarkLightContext = React.createContext({
  theme: 'light' as ITheme,
  setTheme: () => {},
  isDark: false,
} as {
  theme: ITheme
  setTheme: React.Dispatch<React.SetStateAction<ITheme>>
  isDark: boolean
})
export const DarkLightProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = React.useState<ITheme>('light')

  const isDark = useMemo(() => {
    return (
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    )
  }, [theme])

  return (
    <DarkLightContext.Provider
      value={{
        theme,
        setTheme,
        isDark,
      }}
    >
      {children}
    </DarkLightContext.Provider>
  )
}

export const useDarkLightContext = () => {
  const context = React.useContext(DarkLightContext)

  if (!context) {
    throw new Error(
      'useDarkLightContext must be used within a DarkLightProvider'
    )
  }

  return context
}
