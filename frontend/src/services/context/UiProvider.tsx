import React from 'react'
import { DarkLightProvider } from './DarkLightProvider'
import { AntDProvider } from './AntDProvider'
import { ColorsProvider } from './ColorsProvider'

const UiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DarkLightProvider>
      <ColorsProvider>
        <AntDProvider>{children}</AntDProvider>
      </ColorsProvider>
    </DarkLightProvider>
  )
}

export default UiProvider
