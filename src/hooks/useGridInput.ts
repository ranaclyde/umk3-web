import { useState, useCallback } from 'react';

export interface UseGridInputOptions {
  rowWidths: readonly number[];
  onSelect?: (flatIndex: number) => void;
  onBack?: () => void;
  onExtraKey?: (key: string) => void;
}

export interface UseGridInputReturn {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onKeyDown: (e: KeyboardEvent) => void;
}

function toFlat(rowWidths: readonly number[], row: number, col: number): number {
  let idx = 0;
  for (let r = 0; r < row; r++) idx += rowWidths[r] ?? 0;
  return idx + col;
}

function toRowCol(rowWidths: readonly number[], flat: number): { row: number; col: number } {
  let remaining = flat;
  for (let r = 0; r < rowWidths.length; r++) {
    const w = rowWidths[r] ?? 0;
    if (remaining < w) return { row: r, col: remaining };
    remaining -= w;
  }
  return { row: rowWidths.length - 1, col: (rowWidths[rowWidths.length - 1] ?? 1) - 1 };
}

export function useGridInput({
  rowWidths,
  onSelect,
  onBack,
  onExtraKey,
}: UseGridInputOptions): UseGridInputReturn {
  const [activeIndex, setActiveIndexRaw] = useState(0);

  const setActiveIndex = useCallback((idx: number) => {
    setActiveIndexRaw(idx);
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      onExtraKey?.(e.key);

      const { row, col } = toRowCol(rowWidths, activeIndex);

      switch (e.key) {
        case 'ArrowRight': {
          e.preventDefault();
          const rowLen = rowWidths[row] ?? 1;
          const newCol = (col + 1) % rowLen;
          setActiveIndexRaw(toFlat(rowWidths, row, newCol));
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          const rowLen = rowWidths[row] ?? 1;
          const newCol = (col - 1 + rowLen) % rowLen;
          setActiveIndexRaw(toFlat(rowWidths, row, newCol));
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          const nextRow = row + 1;
          if (nextRow < rowWidths.length) {
            const clampedCol = Math.min(col, (rowWidths[nextRow] ?? 1) - 1);
            setActiveIndexRaw(toFlat(rowWidths, nextRow, clampedCol));
          }
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prevRow = row - 1;
          if (prevRow >= 0) {
            const clampedCol = Math.min(col, (rowWidths[prevRow] ?? 1) - 1);
            setActiveIndexRaw(toFlat(rowWidths, prevRow, clampedCol));
          }
          break;
        }
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
    [activeIndex, rowWidths, onSelect, onBack, onExtraKey]
  );

  return { activeIndex, setActiveIndex, onKeyDown };
}
