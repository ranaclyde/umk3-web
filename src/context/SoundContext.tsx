import {
  createContext, useContext, useRef, useCallback, useState, useEffect,
  type ReactNode,
} from 'react';
import { AUDIO_TRACKS, type BgmKey } from '../lib/audio';

export type SfxKey = 'cursor' | 'select' | 'menuOpen' | 'excellent';

interface SoundContextValue {
  playBgm:    (track: BgmKey) => void;
  stopBgm:    () => void;
  playSfx:    (sfx: SfxKey) => void;
  playPath:   (path: string) => HTMLAudioElement | null;
  isMuted:    boolean;
  toggleMute: () => void;
}

const SFX_MAP: Partial<Record<SfxKey, string>> = {};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const bgmRef   = useRef<HTMLAudioElement | null>(null);
  const mutedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);

  // Resume BGM after first user interaction (browsers block autoplay)
  useEffect(() => {
    const resume = () => {
      if (bgmRef.current && bgmRef.current.paused) {
        bgmRef.current.play().catch(() => {});
      }
    };
    document.addEventListener('click', resume, { once: true });
    document.addEventListener('keydown', resume, { once: true });
    return () => {
      document.removeEventListener('click', resume);
      document.removeEventListener('keydown', resume);
    };
  }, []);

  const stopBgm = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
    }
  }, []);

  const playBgm = useCallback(
    (track: BgmKey) => {
      const path = AUDIO_TRACKS.bgm[track];
      if (bgmRef.current && !bgmRef.current.paused) {
        const currentSrc = decodeURIComponent(bgmRef.current.src);
        if (currentSrc.endsWith(path.split('/').pop()!)) return;
      }
      stopBgm();
      const audio = new Audio(path);
      audio.loop   = true;
      audio.volume = mutedRef.current ? 0 : 0.7;
      bgmRef.current = audio;
      audio.play().catch(() => {});
    },
    [stopBgm]
  );

  const playSfx = useCallback((sfx: SfxKey) => {
    if (mutedRef.current) return;
    const path = SFX_MAP[sfx];
    if (!path) return;
    const audio = new Audio(path);
    audio.volume = 1.0;
    audio.play().catch(() => {});
  }, []);

  const playPath = useCallback((path: string): HTMLAudioElement | null => {
    try {
      const audio = new Audio(path);
      audio.volume = mutedRef.current ? 0 : 0.7;
      audio.play().catch(() => {});
      return audio;
    } catch {
      return null;
    }
  }, []);

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current;
    setIsMuted(mutedRef.current);
    if (bgmRef.current) {
      bgmRef.current.volume = mutedRef.current ? 0 : 0.7;
    }
  }, []);

  return (
    <SoundContext.Provider value={{ playBgm, stopBgm, playSfx, playPath, isMuted, toggleMute }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound must be inside SoundProvider');
  return ctx;
}
