import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRouter from './router';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './index.css'
import { ToastContainer } from 'react-toastify';

const queryCliente = new QueryClient;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryCliente}>
      <AppRouter />
    </QueryClientProvider>
    <ToastContainer pauseOnFocusLoss={false} toastClassName="z-[99999]"/>
  </StrictMode>,
)
