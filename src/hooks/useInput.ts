import { useState, useCallback } from 'react';

export interface UseInputOptions {
  itemCount: number;
  columns?: number;
  onSelect?: (index: number) => void;
  onBack?: () => void;
  onExtraKey?: (key: string) => void;
  initialIndex?: number;
}

export interface UseInputReturn {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onKeyDown: (e: KeyboardEvent) => void;
}

export function useInput({
  itemCount,
  columns = 1,
  onSelect,
  onBack,
  onExtraKey,
  initialIndex = 0,
}: UseInputOptions): UseInputReturn {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      onExtraKey?.(e.key);

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          setActiveIndex(i => (i + 1) % itemCount);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setActiveIndex(i => (i - 1 + itemCount) % itemCount);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(i => {
            const next = i + columns;
            return next < itemCount ? next : i;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(i => {
            const next = i - columns;
            return next >= 0 ? next : i;
          });
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          onSelect?.(activeIndex);
          break;
        case 'Escape':
          e.preventDefault();
          onBack?.();
          break;
      }
    },
    [activeIndex, itemCount, columns, onSelect, onBack, onExtraKey]
  );

  return { activeIndex, setActiveIndex, onKeyDown };
}
