import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('MiseOS registry console root element not found')
}

const root = createRoot(rootElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    console.info('MiseOS Registry Console hot update accepted', newModule)
  })
}
