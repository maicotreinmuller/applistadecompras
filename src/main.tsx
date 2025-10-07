import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import { offlineDB } from './lib/offlineStorage';
import { AuthProvider } from './contexts/AuthContext';

// Initialize offline database
offlineDB.open().catch(err => {
  console.error('Failed to open offline database:', err);
});

// Register service worker
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nova versão disponível. Atualizar agora?')) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log('App pronto para uso offline');
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);