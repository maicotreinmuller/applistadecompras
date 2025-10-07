import React, { useState } from 'react';
import { RiCloseLine, RiCalculatorLine } from 'react-icons/ri';

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Calculator({ isOpen, onClose }: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [firstNumber, setFirstNumber] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    if (firstNumber === null) {
      setFirstNumber(current);
    } else if (operation) {
      const result = calculate(firstNumber, current, operation);
      setFirstNumber(result);
      setDisplay(result.toString());
    }
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (first: number, second: number, op: string): number => {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '×': return first * second;
      case '÷': return first / second;
      default: return second;
    }
  };

  const handleEquals = () => {
    if (firstNumber === null || operation === null) return;
    
    const current = parseFloat(display);
    const result = calculate(firstNumber, current, operation);
    setDisplay(result.toString());
    setFirstNumber(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setFirstNumber(null);
    setOperation(null);
    setNewNumber(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm mx-4 transform transition-transform duration-200 ease-out animate-slide-up">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <span className="text-lg font-medium flex items-center gap-2">
            <RiCalculatorLine />
            Calculadora
          </span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="bg-slate-50 p-4 rounded-lg mb-4 text-right">
            <span className="text-2xl font-medium">{display}</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={handleClear}
              className="p-4 text-lg font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors col-span-2"
            >
              C
            </button>
            <button
              onClick={() => handleOperation('÷')}
              className="p-4 text-lg font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              ÷
            </button>
            <button
              onClick={() => handleOperation('×')}
              className="p-4 text-lg font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              ×
            </button>

            {[7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumber(num.toString())}
                className="p-4 text-lg font-medium bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleOperation('-')}
              className="p-4 text-lg font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              -
            </button>

            {[4, 5, 6].map(num => (
              <button
                key={num}
                onClick={() => handleNumber(num.toString())}
                className="p-4 text-lg font-medium bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleOperation('+')}
              className="p-4 text-lg font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              +
            </button>

            {[1, 2, 3].map(num => (
              <button
                key={num}
                onClick={() => handleNumber(num.toString())}
                className="p-4 text-lg font-medium bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleEquals}
              className="p-4 text-lg font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors row-span-2"
            >
              =
            </button>

            <button
              onClick={() => handleNumber('0')}
              className="p-4 text-lg font-medium bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors col-span-2"
            >
              0
            </button>
            <button
              onClick={() => handleNumber('.')}
              className="p-4 text-lg font-medium bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              .
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}