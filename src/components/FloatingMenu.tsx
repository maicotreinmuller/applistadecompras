import React, { useState } from 'react';
import { RiAddLine, RiHome4Line, RiSettings4Line } from 'react-icons/ri';

interface FloatingMenuProps {
  onNavigateToHome: () => void;
  onNavigateToManagement?: () => void;
  onCreateList?: () => void;
  showCreateList?: boolean;
}

export function FloatingMenu({
  onNavigateToHome,
  onNavigateToManagement,
  onCreateList,
  showCreateList = false,
}: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="fixed right-0 bottom-6 flex items-center flex-col">
      {/* Menu de opções */}
      {isOpen && (
        <div className="mb-2 flex flex-col items-center gap-2">
          {showCreateList && (
            <button
              onClick={() => handleAction(onCreateList!)}
              className="w-12 h-12 bg-violet-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-violet-700 transition-colors"
            >
              <RiAddLine size={24} />
            </button>
          )}
          
          <button
            onClick={() => handleAction(onNavigateToHome)}
            className="w-12 h-12 bg-violet-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-violet-700 transition-colors"
          >
            <RiHome4Line size={24} />
          </button>
          
          {onNavigateToManagement && (
            <button
              onClick={() => handleAction(onNavigateToManagement)}
              className="w-12 h-12 bg-violet-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-violet-700 transition-colors"
            >
              <RiSettings4Line size={24} />
            </button>
          )}
        </div>
      )}

      {/* Botão principal */}
      <div className="px-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-violet-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-violet-700 transition-colors"
        >
          <RiAddLine
            size={24}
            className={`transform transition-transform ${isOpen ? 'rotate-45' : ''}`}
          />
        </button>
      </div>

      {/* Overlay para fechar o menu ao clicar fora */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}