import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { getAppData, resetToDemoData } from './utils/storage'
import './index.css'

function InitializeDemoData() {
  useEffect(() => {
    const data = getAppData()
    if (data.timeEntries.length === 0) {
      resetToDemoData()
    }
  }, [])
  return null
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <InitializeDemoData />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
