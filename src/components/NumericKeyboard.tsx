import React from 'react';
import { RiCloseLine, RiDeleteBackLine } from 'react-icons/ri';
import { formatarMoeda } from '../utils/formatters';

interface NumericKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
}

export function NumericKeyboard({ isOpen, onClose, value, onChange }: NumericKeyboardProps) {
  const handleNumber = (num: string) => {
    const newValue = (value + num).replace(/\D/g, '');
    if (newValue.length <= 10) { // Limite de 10 dígitos
      onChange(newValue);
    }
  };

  const handleBackspace = () => {
    const newValue = value.slice(0, -1) || '0';
    onChange(newValue);
  };

  const handleClear = () => {
    onChange('0');
  };

  if (!isOpen) return null;

  const displayValue = formatarMoeda(Number(value) / 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-[9999] animate-fade-in">
      <div className="bg-white rounded-t-2xl shadow-lg w-full transform transition-transform duration-200 ease-out animate-slide-up">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <span className="text-lg font-medium">Valor</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="bg-slate-50 p-4 rounded-lg mb-4 text-right">
            <span className="text-2xl font-medium">{displayValue}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumber(num.toString())}
                className="p-4 text-lg font-medium bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {num}
              </button>
            ))}
            
            <button
              onClick={handleClear}
              className="p-4 text-lg font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              C
            </button>
            
            <button
              onClick={() => handleNumber('0')}
              className="p-4 text-lg font-medium bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              0
            </button>
            
            <button
              onClick={handleBackspace}
              className="p-4 text-lg font-medium bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <RiDeleteBackLine className="mx-auto" size={24} />
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-2 p-4 text-lg font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}