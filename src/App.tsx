import React, { useState, useEffect } from 'react';
import { AddItemBar } from './components/AddItemBar';
import { ItemGroup } from './components/ItemGroup';
import { TotalBar } from './components/TotalBar';
import { ManagementPage } from './components/ManagementPage';
import { HomePage } from './components/HomePage';
import { FloatingTaskbar } from './components/FloatingTaskbar';
import { TaskHeader } from './components/TaskHeader';
import { GroupFilter } from './components/GroupFilter';
import { AuthPage } from './components/AuthPage';
import { useOfflineShoppingList } from './hooks/useOfflineShoppingList';
import { useOfflineGroups } from './hooks/useOfflineGroups';
import { useOfflineSuggestions } from './hooks/useOfflineSuggestions';
import { useOfflineLists } from './hooks/useOfflineLists';
import { useAuth } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function App() {
  const { user, loading: authLoading } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'list' | 'management'>('home');
  const [currentListId, setCurrentListId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const { groups, fetchGroups } = useOfflineGroups();
  const { suggestions, filterSuggestions } = useOfflineSuggestions();

  const offlineShoppingList = useOfflineShoppingList(currentListId);

  const {
    items,
    adicionarItem,
    toggleItem,
    atualizarQuantidade,
    atualizarValor,
    excluirItem,
    limparTudo,
    calcularTotal,
    agruparItens
  } = offlineShoppingList;

  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const fetchLists = async () => {
    return [];
  };

  async function fetchAllData() {
    await fetchGroups();
  }

  const filteredGroups = selectedGroup
    ? Object.fromEntries([[selectedGroup, agruparItens()[selectedGroup]]])
    : agruparItens();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={() => {}} />;
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-100 dark:bg-gray-900 pb-20">
        <TaskHeader onSync={fetchAllData} fetchLists={fetchLists} />

        <div className="pt-14">
          {currentPage === 'home' ? (
            <HomePage
              onBack={() => setCurrentPage('list')}
              onSelectList={handleSelectList}
              onNavigateToManagement={() => setCurrentPage('management')}
              showCreateModal={showCreateModal}
              setShowCreateModal={setShowCreateModal}
            />
          ) : currentPage === 'management' ? (
            <ManagementPage onNavigateToHome={handleNavigateToHome} />
          ) : (
            <>
              <div className="container mx-auto max-w-2xl px-4 py-6">
                <TotalBar total={calcularTotal()} className="mb-6" />

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                  <AddItemBar onAdd={adicionarItem} />
                </div>

                <GroupFilter
                  groups={Object.keys(agruparItens())}
                  selectedGroup={selectedGroup}
                  onSelectGroup={setSelectedGroup}
                />

                <div className="space-y-4">
                  {Object.entries(filteredGroups).map(([grupo, groupItems]) => (
                    <ItemGroup
                      key={grupo}
                      grupo={grupo}
                      items={groupItems}
                      onToggleComplete={toggleItem}
                      onQuantidadeChange={atualizarQuantidade}
                      onValorChange={atualizarValor}
                      onDelete={setItemToDelete}
                      onAdd={adicionarItem}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <FloatingTaskbar
          onNavigateToHome={handleNavigateToHome}
          onNavigateToManagement={() => setCurrentPage('management')}
          onCreateList={() => setShowCreateModal(true)}
        />

        {itemToDelete !== null && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-25 flex items-end justify-center"
            onClick={() => setItemToDelete(null)}
          >
            <div
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-t-xl shadow-lg"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  excluirItem(itemToDelete);
                  setItemToDelete(null);
                }}
                className="w-full p-4 text-red-600 dark:text-red-400 text-center font-medium hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Excluir Item
              </button>
              <button
                onClick={() => setItemToDelete(null)}
                className="w-full p-4 text-gray-500 dark:text-gray-400 text-center border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <ToastContainer position="bottom-center" />
      </div>
    </div>
  );

  function handleSelectList(listId: string) {
    setCurrentListId(listId);
    setCurrentPage('list');
  }

  function handleNavigateToHome() {
    setCurrentPage('home');
    setCurrentListId(null);
  }
}
