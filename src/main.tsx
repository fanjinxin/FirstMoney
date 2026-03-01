import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { BackdoorProvider } from './contexts/BackdoorContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <BackdoorProvider>
        <App />
      </BackdoorProvider>
    </HashRouter>
  </React.StrictMode>,
)
