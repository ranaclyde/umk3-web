import { useEffect } from 'react';
import { clsx } from 'clsx';
import { AppProvider, useAppState } from '../context/AppContext';
import { SoundProvider, useSound } from '../context/SoundContext';
import MenuPrincipal from './MenuPrincipal';
import CharacterGrid from './CharacterGrid';
import BioScreen from './BioScreen';

function SoundToggle() {
  const { isMuted, toggleMute } = useSound();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') toggleMute();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleMute]);

  return (
    <button
      onClick={toggleMute}
      title={isMuted ? 'Activar sonido (M)' : 'Silenciar (M)'}
      className={clsx(
        'absolute top-2 right-2 font-mk text-[11px] tracking-widest',
        'px-1.5 py-0.5 cursor-pointer border',
        'bg-black/75',
        isMuted ? 'border-mk-border text-[#555]' : 'border-mk-yellow text-mk-yellow'
      )}
      style={{ zIndex: 996, lineHeight: 1 }}
    >
      {isMuted ? '✕ SND' : '♪ SND'}
    </button>
  );
}

function AppInner() {
  const { state } = useAppState();

  switch (state.screen) {
    case 'title':
    case 'menu':
    case 'secret-menu':
      return <MenuPrincipal />;
    case 'character-select':
      return <CharacterGrid />;
    case 'bio':
      return <BioScreen />;
    default:
      return <MenuPrincipal />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <SoundProvider>
        <div className="absolute inset-0">
          <AppInner />
          <SoundToggle />
        </div>
      </SoundProvider>
    </AppProvider>
  );
}
