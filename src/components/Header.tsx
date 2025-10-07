import React from 'react';
import { FaShoppingBasket } from 'react-icons/fa';

export function Header() {

  return (
    <header className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-6 px-4 shadow-lg">
      <div className="container mx-auto max-w-2xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lista de Compras</h1>
          <p className="text-sm opacity-90">Controle seus gastos facilmente</p>
        </div>
        <div className="bg-white/20 p-3 rounded-full">
          <FaShoppingBasket size={24} />
        </div>
      </div>
    </header>
  );
}