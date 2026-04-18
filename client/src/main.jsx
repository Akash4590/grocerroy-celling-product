import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { CartProvider } from './context/CartContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 2500,
            style: {
              background: '#1a1a26',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#0a0a0f' } },
            error: { iconTheme: { primary: '#f43f5e', secondary: '#0a0a0f' } },
          }}
        />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
)
