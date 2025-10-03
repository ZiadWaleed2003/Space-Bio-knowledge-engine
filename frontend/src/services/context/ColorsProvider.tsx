import React, { useEffect, useMemo } from 'react'
import { useDarkLightContext } from './DarkLightProvider'
import { MAIN_COLORS } from '../constants/COLORS'

export const ColorsProvider = ({ children }: { children: React.ReactNode }) => {
  const { isDark } = useDarkLightContext()

  const colors = useMemo(() => {
    return isDark ? MAIN_COLORS.dark : MAIN_COLORS.light
  }, [isDark])

  useEffect(() => {
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--c-${key}`, value)
    })
  }, [colors])

  return <>{children}</>
}
