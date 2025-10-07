import React, { useState } from 'react';
import { RiArrowDownSLine, RiCheckLine } from 'react-icons/ri';

interface GroupSelectorProps {
  groups: string[];
  selectedGroup: string;
  onSelectGroup: (group: string) => void;
  placeholder?: string;
}

export function GroupSelector({ 
  groups, 
  selectedGroup, 
  onSelectGroup, 
  placeholder = "Selecione um grupo" 
}: GroupSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectGroup = (group: string) => {
    onSelectGroup(group);
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-violet-500 outline-none text-sm text-left flex items-center justify-between"
      >
        <span className={selectedGroup ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
          {selectedGroup || placeholder}
        </span>
        <RiArrowDownSLine size={20} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-end justify-center animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-lg w-full max-h-[80vh] transform transition-transform duration-200 ease-out animate-slide-up">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium dark:text-white">Selecionar Grupo</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="text-gray-500 dark:text-gray-400">✕</span>
              </button>
            </div>

            <div className="overflow-y-auto max-h-[60vh] p-4">
              <div className="space-y-2">
                {groups.map((group) => (
                  <button
                    key={group}
                    onClick={() => handleSelectGroup(group)}
                    className={`w-full p-3 rounded-lg text-left flex items-center justify-between transition-colors ${
                      selectedGroup === group
                        ? 'bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="font-medium">{group}</span>
                    {selectedGroup === group && (
                      <RiCheckLine size={20} className="text-violet-600 dark:text-violet-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}