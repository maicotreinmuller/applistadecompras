import React, { useRef, useState } from 'react';

interface GroupFilterProps {
  groups: string[];
  selectedGroup: string | null;
  onSelectGroup: (group: string | null) => void;
}

export function GroupFilter({ groups, selectedGroup, onSelectGroup }: GroupFilterProps) {
  const [isDragging, setIsDragging] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (scrollContainerRef.current) {
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (scrollContainerRef.current) {
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <div 
      ref={scrollContainerRef}
      className="flex overflow-x-auto hide-scrollbar bg-white dark:bg-gray-800 rounded-xl shadow-sm p-2 mb-4"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
    >
      <button
        onClick={() => onSelectGroup(null)}
        className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
          selectedGroup === null
            ? 'bg-violet-600 text-white'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
        }`}
      >
        Todos
      </button>
      
      {groups.map((group) => (
        <button
          key={group}
          onClick={() => onSelectGroup(group)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ml-2 ${
            selectedGroup === group
              ? 'bg-violet-600 text-white'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
          }`}
        >
          {group}
        </button>
      ))}
    </div>
  );
}