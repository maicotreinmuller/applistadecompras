import React, { useState, useEffect, useRef } from 'react';
import { RiRefreshLine } from 'react-icons/ri';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isRefreshing = useRef(false);
  const threshold = 80;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop <= 0) {
        setStartY(e.touches[0].clientY);
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return;

      const y = e.touches[0].clientY;
      const distance = Math.max(0, y - startY);
      
      if (distance > 0 && container.scrollTop <= 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance * 0.5, threshold));
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;

      if (pullDistance >= threshold && !isRefreshing.current) {
        isRefreshing.current = true;
        await onRefresh();
        isRefreshing.current = false;
      }

      setIsPulling(false);
      setPullDistance(0);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, startY, onRefresh]);

  return (
    <div 
      ref={containerRef} 
      className="h-full overflow-y-auto"
      style={{ overscrollBehavior: 'none' }}
    >
      <div 
        style={{ 
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        <div 
          className="absolute left-0 right-0 flex justify-center"
          style={{ 
            top: '-40px',
            transform: `translateY(${pullDistance}px) rotate(${pullDistance * 2}deg)`,
            opacity: Math.min(pullDistance / threshold, 1),
            transition: isPulling ? 'none' : 'all 0.2s ease-out'
          }}
        >
          <RiRefreshLine size={24} className="text-violet-600" />
        </div>
        {children}
      </div>
    </div>
  );
}