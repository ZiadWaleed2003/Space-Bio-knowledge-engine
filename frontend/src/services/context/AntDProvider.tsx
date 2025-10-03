import { ConfigProvider } from 'antd'
import React from 'react'
import { useDarkLightContext } from './DarkLightProvider'
import { ANTD_THEME, ANTD_THEME_DARK } from '../constants/ANT_CONFIG'

export const AntDProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isDark } = useDarkLightContext()

  return (
    <ConfigProvider theme={isDark ? ANTD_THEME_DARK : ANTD_THEME}>
      {children}
    </ConfigProvider>
  )
}
