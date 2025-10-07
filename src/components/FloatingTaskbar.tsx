import React, { useState } from 'react';
import { RiHome4Line, RiAddLine, RiFileListLine, RiCalculatorLine } from 'react-icons/ri';
import { Calculator } from './Calculator';

interface FloatingTaskbarProps {
  onNavigateToHome: () => void;
  onNavigateToManagement: () => void;
  onCreateList?: () => void;
}

export function FloatingTaskbar({
  onNavigateToHome,
  onNavigateToManagement,
  onCreateList,
}: FloatingTaskbarProps) {
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-xl border-t border-gray-100/50 dark:border-gray-700/50">
        <div className="container mx-auto max-w-2xl flex items-center justify-around py-2">
          <button
            onClick={onNavigateToHome}
            className="text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 p-2"
            title="Início"
          >
            <RiHome4Line size={20} />
          </button>
          
          <button
            onClick={onCreateList}
            className="text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 p-2"
            title="Nova Lista"
          >
            <RiAddLine size={20} />
          </button>
          
          <button
            onClick={onNavigateToManagement}
            className="text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 p-2"
            title="Minhas Listas"
          >
            <RiFileListLine size={20} />
          </button>

          <button
            onClick={() => setShowCalculator(true)}
            className="text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 p-2"
            title="Calculadora"
          >
            <RiCalculatorLine size={20} />
          </button>
        </div>
      </div>

      <Calculator isOpen={showCalculator} onClose={() => setShowCalculator(false)} />
    </>
  );
}