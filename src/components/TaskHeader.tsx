import React from 'react';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

interface TaskHeaderProps {
  onSync: () => Promise<void>;
  fetchLists: () => Promise<void>;
}

export function TaskHeader({ onSync, fetchLists }: TaskHeaderProps) {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    if (confirm('Deseja realmente sair?')) {
      await signOut();
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-100/50 dark:border-gray-700/50">
      <div className="container mx-auto max-w-2xl px-4 h-full flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Lista de Compras
        </h1>
        <button
          onClick={handleSignOut}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          title="Sair"
        >
          <FiLogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
