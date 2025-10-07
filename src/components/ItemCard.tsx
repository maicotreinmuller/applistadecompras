import React, { useState } from 'react';
import { FaCheck, FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import { Item } from '../types/Item';
import { formatarMoeda } from '../utils/formatters';
import { NumericKeyboard } from './NumericKeyboard';

interface ItemCardProps {
  item: Item;
  onToggleComplete: (id: number) => void;
  onQuantidadeChange: (id: number, quantidade: number) => void;
  onValorChange: (id: number, valor: number) => void;
  onDelete: (id: number) => void;
}

export function ItemCard({
  item,
  onToggleComplete,
  onQuantidadeChange,
  onValorChange,
  onDelete,
}: ItemCardProps) {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [numericValue, setNumericValue] = useState(
    Math.round((item.valor || 0) * 100).toString()
  );

  const handleValorChange = (value: string) => {
    setNumericValue(value);
    onValorChange(item.id, Number(value) / 100);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm transition-all ${
        item.completo ? 'bg-opacity-75' : ''
      }`}
    >
      <div className="p-3">
        {/* Linha Superior: Checkbox, Nome e Menu */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => onToggleComplete(item.id)}
            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
              item.completo
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 text-transparent hover:border-green-500'
            }`}
          >
            <FaCheck size={12} />
          </button>

          <span
            className={`flex-1 text-sm font-medium truncate ${
              item.completo ? 'line-through text-gray-400' : 'text-gray-700'
            }`}
          >
            {item.nome}
          </span>

          <button
            onClick={() => onDelete(item.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Linha Inferior: Quantidade, Valor e Total */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center bg-gray-50 rounded-md border border-gray-100">
            <button
              onClick={() =>
                onQuantidadeChange(item.id, Math.max(1, item.quantidade - 1))
              }
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-violet-600"
            >
              <FaMinus size={10} />
            </button>
            <span className="w-8 text-center font-medium text-gray-700">
              {item.quantidade}
            </span>
            <button
              onClick={() => onQuantidadeChange(item.id, item.quantidade + 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-violet-600"
            >
              <FaPlus size={10} />
            </button>
          </div>

          <span className="text-gray-400">×</span>

          <button
            onClick={() => setShowKeyboard(true)}
            className="w-20 h-8 px-2 text-right text-sm border border-gray-100 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            {formatarMoeda(item.valor)}
          </button>

          <span className="text-gray-400">=</span>

          <span className="font-medium text-violet-600 ml-auto">
            {formatarMoeda((item.quantidade || 0) * (item.valor || 0))}
          </span>
        </div>
      </div>

      {/* Teclado Numérico */}
      <NumericKeyboard
        isOpen={showKeyboard}
        onClose={() => setShowKeyboard(false)}
        value={numericValue}
        onChange={handleValorChange}
      />
    </div>
  );
}