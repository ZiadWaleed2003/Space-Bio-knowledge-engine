// EDIT COLORS ALSO IN 'tailwind.config', 'general.css' and 'ANTD_THEME' files
import { theme, type ThemeConfig } from 'antd'
import { MAIN_COLORS } from './COLORS'
// #2F2F2F
const MAIN_THEME_TOKEN: ThemeConfig['token'] = {
  borderRadius: 8,
  borderRadiusLG: 8,
  borderRadiusOuter: 8,
  // fontFamily: `var(--font-main)`,
  fontSize: 14,
  fontSizeXL: 16,
  controlHeight: 34,
  controlHeightLG: 51,
}

//     --color-border: rgba(233, 235, 236, var(--tw-border-
export const ANTD_THEME: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: MAIN_COLORS.light.primary,
    colorBgBase: MAIN_COLORS.light.background,
    colorTextBase: MAIN_COLORS.light.text + 'b6',
    colorBorder: MAIN_COLORS.light.border,
    ...MAIN_THEME_TOKEN,
  },
  components: {},
}

export const ANTD_THEME_DARK: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: MAIN_COLORS.dark.primary,
    colorBgBase: MAIN_COLORS.dark.background,
    colorTextBase: MAIN_COLORS.dark.text + 'b6',
    colorBorder: MAIN_COLORS.dark.border,

    ...MAIN_THEME_TOKEN,
  },
  components: {},
}
