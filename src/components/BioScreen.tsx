import { useState, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';
import { useAppState } from '../context/AppContext';
import { FIGHTER_BY_ID } from '../lib/fighters';
import { FIGHTER_CONTENT } from '../lib/fighterContent';
import type { FighterData } from '../types/fighter';

export default function BioScreen() {
  const { state, dispatch } = useAppState();
  const [curtainActive, setCurtainActive] = useState(false);

  const fighter = state.selectedFighter ? FIGHTER_BY_ID[state.selectedFighter] : null;
  const content: FighterData | null = state.selectedFighter
    ? (FIGHTER_CONTENT[state.selectedFighter] ?? null)
    : null;

  const handleBack = useCallback(() => {
    setCurtainActive(true);
    setTimeout(() => dispatch({ type: 'GO_BACK' }), 350);
  }, [dispatch]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleBack();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleBack]);

  if (!fighter || !content) return null;

  return (
    <div className="absolute inset-0 bg-mk-dark text-white font-mk flex flex-col overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between shrink-0 px-4 py-2"
        style={{ background: '#1a0000', borderBottom: '2px solid #c0392b' }}
      >
        <button
          onClick={handleBack}
          className="text-mk-red text-sm tracking-widest cursor-pointer bg-transparent px-2 py-0.5 border border-mk-red"
          style={{ fontFamily: 'inherit' }}
        >
          ◄ BACK
        </button>
        <span className="text-mk-yellow text-2xl tracking-widest text-glow-sm-yellow">
          {content.displayName.toUpperCase()}
        </span>
        <div className="w-20" />
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Fighter GIF */}
        <div
          className="flex items-center justify-center p-4 shrink-0"
          style={{ width: '35%', borderRight: '2px solid #3a3a3a' }}
        >
          <img
            src={fighter.base}
            alt={content.displayName}
            className="max-h-full max-w-full"
          />
        </div>

        {/* Bio content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 text-[14px] leading-relaxed">
          <p className="text-[#ccc] mb-5">{content.bio}</p>

          {content.specialMoves.length > 0 && (
            <>
              <div
                className={clsx(
                  'text-mk-yellow text-[15px] tracking-widest mb-2',
                  'border-b border-mk-border pb-1'
                )}
              >
                — SPECIAL MOVES —
              </div>
              {content.specialMoves.map((m, i) => (
                <div key={i} className="mb-1.5">
                  <span className="text-mk-green">▸ {m.name}:</span>{' '}
                  <span className="text-[#aaa]">{m.input}</span>
                </div>
              ))}
            </>
          )}

          {content.fatalities.length > 0 && (
            <>
              <div
                className={clsx(
                  'text-mk-red text-[15px] tracking-widest mt-5 mb-2',
                  'border-b border-mk-border pb-1'
                )}
              >
                — FATALITIES —
              </div>
              {content.fatalities.map((f, i) => (
                <div key={i} className="mb-1.5">
                  <span className="text-mk-red">▸ {f.name}:</span>{' '}
                  <span className="text-[#aaa]">{f.input}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Curtain */}
      <div
        className="fixed inset-0 bg-black"
        style={{
          transform: curtainActive ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: 'top center',
          animation: curtainActive ? 'mk-curtain-in 300ms step-start forwards' : 'none',
          zIndex: 200,
          pointerEvents: curtainActive ? 'all' : 'none',
        }}
      />
    </div>
  );
}
