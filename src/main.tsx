import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (error) {
  console.error("Critical React Mount Error:", error);
  document.body.innerHTML = `<div style="color: red; padding: 20px;"><h1>Critical Mount Error</h1><pre>${error}</pre></div>`;
}
