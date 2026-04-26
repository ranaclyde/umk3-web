import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { clsx } from 'clsx';
import { useAppState } from '../context/AppContext';
import { useSound } from '../context/SoundContext';
import { useGridInput } from '../hooks/useGridInput';
import { useCheatCode } from '../hooks/useCheatCode';
import {
  REGULAR_FIGHTERS, FIGHTER_BY_ID,
  GRID_ROW_WIDTHS,
} from '../lib/fighters';
import { FIGHTER_CONTENT } from '../lib/fighterContent';
import type { FighterAssets } from '../types/fighter';

type SelectionPhase = 'none' | 'victory' | 'confirmed';

// Pre-computed from module-level constants — doesn't change
const REGULAR_ROWS: FighterAssets[][] = [];
const ROW_OFFSETS: number[] = [];
(function buildRows() {
  let off = 0;
  for (const width of GRID_ROW_WIDTHS) {
    ROW_OFFSETS.push(off);
    REGULAR_ROWS.push(REGULAR_FIGHTERS.slice(off, off + width));
    off += width;
  }
})();

export default function CharacterGrid() {
  const { state, dispatch } = useAppState();
  const { playSfx } = useSound();
  const { secretUnlocked, pushKey } = useCheatCode();

  const [flashActive, setFlashActive] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [selectionPhase, setSelectionPhase] = useState<SelectionPhase>('none');
  const [confirmedFighterId, setConfirmedFighterId] = useState<string | null>(null);

  useEffect(() => {
    if (secretUnlocked) dispatch({ type: 'UNLOCK_SECRET' });
  }, [secretUnlocked, dispatch]);

  const enabledBossData = useMemo(
    () => (state.enabledBoss ? (FIGHTER_BY_ID[state.enabledBoss] ?? null) : null),
    [state.enabledBoss]
  );

  const allFighters = useMemo(
    () => (enabledBossData ? [...REGULAR_FIGHTERS, enabledBossData] : REGULAR_FIGHTERS),
    [enabledBossData]
  );

  const rowWidths = useMemo(
    () => (enabledBossData ? [...GRID_ROW_WIDTHS, 1] : GRID_ROW_WIDTHS) as readonly number[],
    [enabledBossData]
  );

  const handleSelect = useCallback(
    (flatIdx: number) => {
      const fighter = allFighters[flatIdx];
      if (!fighter) return;
      playSfx('select');
      setFlashActive(true);
      setHasInteracted(true);
      setTimeout(() => setFlashActive(false), 200);
      setConfirmedFighterId(fighter.id);
      setSelectionPhase('victory');
      setTimeout(() => setSelectionPhase('confirmed'), 800);
    },
    [allFighters, playSfx]
  );

  const handleBack = useCallback(
    () => dispatch({ type: 'GO_TO_MENU' }),
    [dispatch]
  );

  const { activeIndex, setActiveIndex, onKeyDown } = useGridInput({
    rowWidths,
    onSelect: handleSelect,
    onBack: handleBack,
    onExtraKey: pushKey,
  });

  // Sound on cursor move
  const prevIndex = useRef(activeIndex);
  useEffect(() => {
    if (prevIndex.current !== activeIndex) {
      playSfx('cursor');
      prevIndex.current = activeIndex;
    }
  }, [activeIndex, playSfx]);

  // Keyboard handler — always active (no locking)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setHasInteracted(true);
      }
      onKeyDown(e);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onKeyDown]);

  const activeFighter = allFighters[activeIndex] ?? allFighters[0];
  const activeContent = activeFighter ? (FIGHTER_CONTENT[activeFighter.id] ?? null) : null;

  return (
    <div className="absolute inset-0 flex gap-3 p-3 font-mk">

      {/* ── Left: grid area ─────────────────────────────── */}
      <div className="flex flex-col flex-1 gap-2 min-w-0">
        <div className="text-center text-mk-yellow text-xl tracking-widest shrink-0 text-glow-sm-yellow">
          CHOOSE YOUR FIGHTER
        </div>

        <div className="flex flex-col justify-center gap-0.5 flex-1 min-h-0">
          {REGULAR_ROWS.map((rowFighters, rowIdx) => (
            <div key={rowIdx} className="flex justify-center gap-0.5">
              {rowFighters.map((fighter, fi) => {
                const flatIdx = ROW_OFFSETS[rowIdx]! + fi;
                return (
                  <SelectorCell
                    key={fighter.id}
                    fighter={fighter}
                    isActive={flatIdx === activeIndex}
                    onClick={() => { setHasInteracted(true); handleSelect(flatIdx); }}
                    onMouseEnter={() => { setHasInteracted(true); setActiveIndex(flatIdx); }}
                  />
                );
              })}
            </div>
          ))}

          {enabledBossData && (
            <div className="flex justify-center mt-1">
              <SelectorCell
                fighter={enabledBossData}
                isActive={REGULAR_FIGHTERS.length === activeIndex}
                onClick={() => { setHasInteracted(true); handleSelect(REGULAR_FIGHTERS.length); }}
                onMouseEnter={() => { setHasInteracted(true); setActiveIndex(REGULAR_FIGHTERS.length); }}
              />
            </div>
          )}
        </div>

        <div className="text-center text-[#444] text-[10px] tracking-widest shrink-0">
          ESC · VOLVER AL MENÚ
        </div>
      </div>

      {/* ── Right: info panel ───────────────────────────── */}
      <div className="w-64 flex flex-col shrink-0 border-l border-mk-border pl-3 min-h-0">

        {/* Character image */}
        <div className="flex-1 min-h-0 flex items-center justify-center py-2">
          <img
            src={hasInteracted ? activeFighter?.base : '/assets/images/unknow-selector.png'}
            alt={hasInteracted ? activeFighter?.displayName : '?'}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Name */}
        <div className={clsx(
          'text-center tracking-widest text-lg shrink-0 py-1',
          hasInteracted ? ['text-mk-yellow', 'text-glow-sm-yellow'] : 'text-[#444]'
        )}>
          {hasInteracted ? activeFighter?.displayName.toUpperCase() : '???'}
        </div>

        {/* Bio + moves */}
        {hasInteracted && activeContent && (
          <div className="overflow-y-auto shrink-0 text-[10px] leading-relaxed" style={{ maxHeight: '48%' }}>
            <p className="text-[#999] mb-2">{activeContent.bio}</p>

            {activeContent.specialMoves.length > 0 && (
              <>
                <div className="text-mk-yellow tracking-widest text-[9px] border-b border-mk-border pb-0.5 mb-1">
                  — SPECIAL MOVES —
                </div>
                {activeContent.specialMoves.map((m, i) => (
                  <div key={i} className="mb-0.5">
                    <span className="text-mk-green">▸ {m.name}:</span>{' '}
                    <span className="text-[#777]">{m.input}</span>
                  </div>
                ))}
              </>
            )}

            {activeContent.fatalities.length > 0 && (
              <>
                <div className="text-mk-red tracking-widest text-[9px] border-b border-mk-border pb-0.5 mb-1 mt-2">
                  — FATALITIES —
                </div>
                {activeContent.fatalities.map((f, i) => (
                  <div key={i} className="mb-0.5">
                    <span className="text-mk-red">▸ {f.name}:</span>{' '}
                    <span className="text-[#777]">{f.input}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Flash overlay */}
      {flashActive && (
        <div
          className="fixed inset-0 bg-white pointer-events-none"
          style={{ animation: 'mk-flash 200ms step-start forwards', zIndex: 100 }}
        />
      )}
    </div>
  );
}

// ── SelectorCell ──────────────────────────────────────────────────────────

interface SelectorCellProps {
  fighter: FighterAssets;
  isActive: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

function SelectorCell({ fighter, isActive, onClick, onMouseEnter }: SelectorCellProps) {
  // Human Smoke: alternate between human-smoke and smoke selector every 2s
  const [smokeAlt, setSmokeAlt] = useState(false);
  useEffect(() => {
    if (fighter.id !== 'human-smoke') return;
    const t = setInterval(() => setSmokeAlt(v => !v), 2000);
    return () => clearInterval(t);
  }, [fighter.id]);

  const src =
    fighter.id === 'human-smoke' && smokeAlt
      ? '/assets/images/fighters/smoke/selector.png'
      : fighter.selector;

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={clsx(
        'cursor-pointer shrink-0 overflow-hidden bg-mk-dark border-2 w-20 h-20',
        isActive ? ['border-mk-green', 'cell-glow-green'] : 'border-mk-border'
      )}
    >
      <img src={src} alt={fighter.displayName} className="w-full h-full object-cover" />
    </div>
  );
}
