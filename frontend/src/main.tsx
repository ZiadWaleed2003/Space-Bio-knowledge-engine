import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import '@ant-design/v5-patch-for-react-19'
import App from './App.tsx'
import { UiProvider } from './services/index.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UiProvider>
      <App />
    </UiProvider>
  </StrictMode>
)
