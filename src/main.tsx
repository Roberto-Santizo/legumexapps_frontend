import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRouter from './router';
import './index.css'
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
    <ToastContainer />
  </StrictMode>,
)
