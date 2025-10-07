import React from 'react';
import { formatarMoeda } from '../utils/formatters';

interface TotalBarProps {
  total: number;
  className?: string;
}

export function TotalBar({ total, className = '' }: TotalBarProps) {
  return (
    <div className={`bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="flex flex-col">
        <h2 className="text-xs font-medium text-white/80 mb-1">Total da Lista</h2>
        <p className="text-3xl font-bold text-white">
          {formatarMoeda(total)}
        </p>
      </div>
    </div>
  );
}