import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: (isDark: boolean) => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  const handleToggle = () => {
    const newTheme = !isDark;
    onToggle(newTheme);
    localStorage.setItem('dark_mode', newTheme.toString());
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
      title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
    >
      {isDark ? <FaSun size={20} /> : <FaMoon size={20} />}
    </button>
  );
}