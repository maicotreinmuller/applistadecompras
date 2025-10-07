import React, { useState, useRef, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useOfflineGroups } from '../hooks/useOfflineGroups';
import { useOfflineSuggestions } from '../hooks/useOfflineSuggestions';
import { GroupSelector } from './GroupSelector';

interface AddItemBarProps {
  onAdd: (nome: string, grupo: string) => void;
}

export function AddItemBar({ onAdd }: AddItemBarProps) {
  const { groups } = useOfflineGroups();
  const { filterSuggestions } = useOfflineSuggestions();
  const [nome, setNome] = useState('');
  const [grupo, setGrupo] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSuggestions(filterSuggestions(nome));
  }, [nome]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim() && grupo.trim()) {
      onAdd(nome.trim(), grupo.trim());
      setNome('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNome(suggestion);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <GroupSelector
        groups={groups}
        selectedGroup={grupo}
        onSelectGroup={setGrupo}
        placeholder="Selecione um grupo"
      />
      
      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Delay hiding suggestions to allow clicks
              setTimeout(() => setShowSuggestions(false), 150);
            }}
            placeholder="Nome do item"
            className="flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-violet-500 outline-none text-sm dark:text-white dark:placeholder-gray-400"
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-2 rounded-lg hover:opacity-90 transition-opacity"
            disabled={!nome.trim() || !grupo.trim()}
          >
            <FaPlus size={16} />
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onMouseDown={(e) => e.preventDefault()} // Prevent blur
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-gray-700 text-sm dark:text-gray-300"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}