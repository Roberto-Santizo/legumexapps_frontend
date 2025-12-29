import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from './core/notifications/NotificationContext';
import { ReactHotToastAdapter } from './config/notifications/ReactHostToastAdapter';
import { Toaster } from 'react-hot-toast';
import AppRouter from './router';
import './index.css'

const queryCliente = new QueryClient;
const adapter = new ReactHotToastAdapter();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryCliente}>
      <NotificationProvider adapter={adapter} container={<Toaster />}>
        <AppRouter />
      </NotificationProvider>
    </QueryClientProvider>
  </StrictMode>,
)
