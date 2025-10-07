import React, { useState } from 'react';
import { Item } from '../types/Item';
import { ItemCard } from './ItemCard';
import { FaCheck, FaChevronDown, FaChevronRight, FaPlus } from 'react-icons/fa';
import { formatarMoeda } from '../utils/formatters';
import { useOfflineSuggestions } from '../hooks/useOfflineSuggestions';

interface ItemGroupProps {
  grupo: string;
  items: Item[];
  onToggleComplete: (id: number) => void;
  onQuantidadeChange: (id: number, quantidade: number) => void;
  onValorChange: (id: number, valor: number) => void;
  onDelete: (id: number) => void;
  onAdd: (nome: string, grupo: string) => void;
}

export function ItemGroup({
  grupo,
  items,
  onToggleComplete,
  onQuantidadeChange,
  onValorChange,
  onDelete,
  onAdd,
}: ItemGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { filterSuggestions } = useOfflineSuggestions();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const subtotal = items.reduce((acc, item) => acc + item.valor * item.quantidade, 0);
  const allCompleted = items.length > 0 && items.every(item => item.completo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      onAdd(newItem.trim(), grupo);
      setNewItem('');
      setSuggestions([]);
    }
  };

  const handleInputChange = (value: string) => {
    setNewItem(value);
    setSuggestions(filterSuggestions(value));
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewItem(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <button
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between text-sm font-medium text-gray-600 mb-3 px-2 hover:text-gray-700"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <FaChevronDown size={12} />
          ) : (
            <FaChevronRight size={12} />
          )}
          <span>{grupo}</span>
          <span className="text-gray-400 text-sm">({items.length})</span>
          {allCompleted && (
            <span className="bg-green-500 text-white p-1 rounded-full">
              <FaCheck size={10} />
            </span>
          )}
        </div>
        <span className="text-violet-600 font-medium">
          {formatarMoeda(subtotal)}
        </span>
      </button>

      <div className={`space-y-2 ${isExpanded ? '' : 'hidden'}`}>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={newItem}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                // Delay hiding suggestions to allow clicks
                setTimeout(() => setShowSuggestions(false), 150);
              }}
              placeholder="Adicionar item ao grupo"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border-0 focus:ring-2 focus:ring-violet-500 outline-none text-sm"
              autoComplete="off"
              spellCheck="false"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-2 rounded-lg hover:opacity-90 transition-opacity"
            disabled={!newItem.trim()}
          >
            <FaPlus size={16} />
          </button>
        </form>

        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onToggleComplete={onToggleComplete}
            onQuantidadeChange={onQuantidadeChange}
            onValorChange={onValorChange}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}