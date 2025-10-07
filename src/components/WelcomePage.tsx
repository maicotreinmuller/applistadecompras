import React, { useState } from 'react';

interface WelcomePageProps {
  onClose: () => void;
}

export function WelcomePage({ onClose }: WelcomePageProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hide_welcome', 'true');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Bem-vindo ao Lista de Compras!</h2>
        
        <div className="space-y-4 mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Aqui está um guia rápido de como usar o aplicativo:
          </p>
          
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-violet-600 dark:text-violet-400">📝 Criando Listas</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Crie diferentes listas para organizar suas compras. Cada lista pode ter seu próprio conjunto de itens.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-violet-600 dark:text-violet-400">➕ Adicionando Itens</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Adicione itens às suas listas, especificando quantidade e preço. Os itens são organizados por categorias para facilitar suas compras.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-violet-600 dark:text-violet-400">✓ Marcando Itens</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Marque os itens conforme você os coloca no carrinho. O app calculará automaticamente o total gasto.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-violet-600 dark:text-violet-400">📱 Compartilhamento</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Compartilhe suas listas facilmente com família e amigos através do WhatsApp ou copiando para a área de transferência.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded text-violet-600 focus:ring-violet-500 dark:bg-gray-700 dark:border-gray-600"
            />
            Não mostrar novamente
          </label>

          <button
            onClick={handleClose}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Começar a usar
          </button>
        </div>
      </div>
    </div>
  );
}