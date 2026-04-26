import { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { useAppState } from '../context/AppContext';
import { useSound } from '../context/SoundContext';
import { useInput } from '../hooks/useInput';
import { useCheatCode } from '../hooks/useCheatCode';
import { AUDIO_TRACKS } from '../lib/audio';
import type { BossId } from '../types/state';

type MenuPhase = 'main' | 'options' | 'cheats' | 'killer-codes';

export default function MenuPrincipal() {
  const { state, dispatch } = useAppState();
  const { playBgm, playPath, playSfx } = useSound();
  const { secretUnlocked, pushKey } = useCheatCode();
  const [phase, setPhase] = useState<MenuPhase>(
    state.screen === 'secret-menu' ? 'options' : 'main'
  );
  const soundTestAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (secretUnlocked && !state.secretUnlocked) {
      dispatch({ type: 'UNLOCK_SECRET' });
      playSfx('excellent');
    }
  }, [secretUnlocked, state.secretUnlocked, dispatch, playSfx]);

  useEffect(() => {
    if (phase === 'main') playBgm('title');
  }, [phase, playBgm]);

  if (phase === 'main') {
    return (
      <MainMenu
        secretUnlocked={state.secretUnlocked}
        onStart={() => {
          playBgm('select');
          dispatch({ type: 'GO_TO_CHARACTER_SELECT' });
        }}
        onOptions={() => {
          setPhase('options');
          dispatch({ type: 'GO_TO_SECRET_MENU' });
          playSfx('menuOpen');
        }}
        onKey={pushKey}
      />
    );
  }

  if (phase === 'options') {
    return (
      <SecretMenu
        title="OPTIONS"
        items={['CHEATS', 'KILLER CODES', 'BACK']}
        onSelect={(idx) => {
          if (idx === 0) setPhase('cheats');
          else if (idx === 1) setPhase('killer-codes');
          else setPhase('main');
        }}
        onBack={() => setPhase('main')}
        onKey={pushKey}
      />
    );
  }

  if (phase === 'killer-codes') {
    const items: string[] = [
      state.enabledBoss === 'motaro'   ? 'MOTARO ★'    : 'MOTARO',
      state.enabledBoss === 'shaokahn' ? 'SHAO KAHN ★' : 'SHAO KAHN',
      'NONE',
      'BACK',
    ];
    return (
      <SecretMenu
        title="KILLER CODES"
        items={items}
        onSelect={(idx) => {
          const bossMap: Array<BossId | null> = ['motaro', 'shaokahn', null];
          if (idx < 3) dispatch({ type: 'SET_BOSS', boss: bossMap[idx]! });
          else setPhase('options');
        }}
        onBack={() => setPhase('options')}
        onKey={pushKey}
      />
    );
  }

  // Cheats = sound test
  const arenaLabels = AUDIO_TRACKS.arenas.map(a => a.label.toUpperCase());
  return (
    <SecretMenu
      title="CHEATS"
      items={[...arenaLabels, 'BACK']}
      onSelect={(idx) => {
        if (idx < AUDIO_TRACKS.arenas.length) {
          if (soundTestAudioRef.current) soundTestAudioRef.current.pause();
          const arena = AUDIO_TRACKS.arenas[idx];
          if (arena) soundTestAudioRef.current = playPath(arena.path);
        } else {
          if (soundTestAudioRef.current) soundTestAudioRef.current.pause();
          setPhase('options');
        }
      }}
      onBack={() => {
        if (soundTestAudioRef.current) soundTestAudioRef.current.pause();
        setPhase('options');
      }}
      onKey={pushKey}
    />
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function MainMenu({
  secretUnlocked,
  onStart,
  onOptions,
  onKey,
}: {
  secretUnlocked: boolean;
  onStart: () => void;
  onOptions: () => void;
  onKey: (k: string) => void;
}) {
  const items = secretUnlocked ? ['START GAME', 'OPTIONS'] : ['START GAME'];

  const { activeIndex, onKeyDown } = useInput({
    itemCount: items.length,
    columns: 1,
    onSelect: (i) => (i === 0 ? onStart() : onOptions()),
    onExtraKey: onKey,
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKeyDown(e);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onKeyDown]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 md:gap-8 font-mk">
      <img
        src="/assets/images/logo-umk3.png"
        alt="Ultimate Mortal Kombat 3"
        className="max-w-[90%] md:max-w-[78%] relative"
      />
      <div className="relative flex flex-col gap-1 md:gap-3 items-start">
        {items.map((label, i) => (
          <div
            key={label}
            onClick={() => (i === 0 ? onStart() : onOptions())}
            className={clsx(
              'text-2xl md:text-3xl tracking-widest cursor-pointer touch-manipulation flex items-center gap-3 py-2 md:py-0',
              i === activeIndex ? ['text-mk-yellow', 'text-glow-yellow'] : 'text-[#ccc]'
            )}
          >
            <span className={clsx(activeIndex === i ? 'visible' : 'invisible')}>►</span>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function SecretMenu({
  title,
  items,
  onSelect,
  onBack,
  onKey,
}: {
  title: string;
  items: string[];
  onSelect: (idx: number) => void;
  onBack: () => void;
  onKey: (k: string) => void;
}) {
  const { activeIndex, onKeyDown } = useInput({
    itemCount: items.length,
    columns: 1,
    onSelect,
    onBack,
    onExtraKey: onKey,
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKeyDown(e);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onKeyDown]);

  return (
    <div className="absolute inset-0 bg-mk-dark flex flex-col items-center justify-center gap-0.5 md:gap-1.5 font-mk">
      <div className="text-mk-red text-xl md:text-2xl tracking-widest mb-4 md:mb-5 text-glow-red">
        {title}
      </div>
      {items.map((label, i) => (
        <div
          key={i}
          onClick={() => onSelect(i)}
          className={clsx(
            'text-sm md:text-base tracking-widest cursor-pointer touch-manipulation flex items-center gap-2 py-2.5 md:py-1 px-4 md:px-0',
            i === activeIndex ? ['text-mk-yellow', 'text-glow-sm-yellow'] : 'text-[#888]'
          )}
        >
          <span className={clsx(activeIndex === i ? 'visible' : 'invisible')}>►</span>
          {label}
        </div>
      ))}
    </div>
  );
}
