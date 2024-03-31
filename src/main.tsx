import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { CssBaseline, CssVarsProvider } from "@mui/joy"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssVarsProvider>
				<CssBaseline disableColorScheme />
				<App />
    </CssVarsProvider>
  </React.StrictMode>
)
