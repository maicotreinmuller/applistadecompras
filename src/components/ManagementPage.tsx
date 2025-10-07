import React, { useState } from 'react';
import { FaPlus, FaLayerGroup, FaListUl, FaBoxes } from 'react-icons/fa';
import { useOfflineGroups } from '../hooks/useOfflineGroups';
import { useOfflineSuggestions } from '../hooks/useOfflineSuggestions';

interface ManagementPageProps {
  onNavigateToHome: () => void;
}

export function ManagementPage({ onNavigateToHome }: ManagementPageProps) {
  const { groups, addGroup, removeGroup } = useOfflineGroups();
  const { suggestions, addSuggestion, removeSuggestion } = useOfflineSuggestions();
  const [newItem, setNewItem] = useState('');
  const [currentTab, setCurrentTab] = useState<'categories' | 'suggestions'>('categories');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      if (currentTab === 'categories') {
        addGroup(newItem.trim());
      } else {
        addSuggestion(newItem.trim());
      }
      setNewItem('');
    }
  };

  const suggestedGroups = [
    '🥬 Hortifruti',
    '🥩 Carnes',
    '🥛 Laticínios',
    '🥖 Padaria',
    '🥫 Mercearia',
    '🧃 Bebidas',
    '🧹 Limpeza',
    '🧴 Higiene',
    '🧊 Congelados',
    '🥜 Cereais',
    '🍝 Massas',
    '🥫 Enlatados',
    '🧂 Temperos',
    '🍬 Doces',
    '🐶 Pet Shop',
    '📦 Outros',
  ].sort((a, b) => a.localeCompare(b, 'pt', { sensitivity: 'base' }));

  return (
    <div className="min-h-screen bg-slate-100 pb-20 hide-scrollbar">
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <div className="flex items-center justify-between mb-6">
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 flex">
          <button
            onClick={() => setCurrentTab('categories')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors ${
              currentTab === 'categories'
                ? 'bg-violet-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaLayerGroup />
            <span>Categorias</span>
          </button>
          <button
            onClick={() => setCurrentTab('suggestions')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors ${
              currentTab === 'suggestions'
                ? 'bg-violet-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaListUl />
            <span>Sugestões</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={currentTab === 'categories' ? 'Nova categoria' : 'Nova sugestão'}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-50 border-0 focus:ring-2 focus:ring-violet-500 outline-none text-sm"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <FaPlus size={16} />
            </button>
          </form>

          <div className="space-y-2">
            {currentTab === 'categories' ? (
              <>
                {groups.map((group) => (
                  <div
                    key={group}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <span className="text-sm font-medium">{group}</span>
                    <button
                      onClick={() => removeGroup(group)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                    >
                      Remover
                    </button>
                  </div>
                ))}

                <div className="mt-6">
                  <h2 className="text-lg font-medium mb-4">Categorias Sugeridas</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestedGroups.map((group) => (
                      <button
                        key={group}
                        onClick={() => addGroup(group)}
                        className="p-2 text-sm bg-slate-50 rounded-lg hover:bg-slate-100 text-left"
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              suggestions.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <span className="text-sm font-medium">{item}</span>
                  <button
                    onClick={() => removeSuggestion(item)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                  >
                    Remover
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}