import { useRef, useCallback, useState } from 'react';
import { CHEAT_SEQUENCE } from '../lib/cheatCode';

export interface UseCheatCodeReturn {
  secretUnlocked: boolean;
  pushKey: (key: string) => void;
}

export function useCheatCode(): UseCheatCodeReturn {
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const bufferRef = useRef<string[]>([]);
  const N = CHEAT_SEQUENCE.length;

  const pushKey = useCallback(
    (key: string) => {
      if (secretUnlocked) return;

      bufferRef.current.push(key);
      if (bufferRef.current.length > N) {
        bufferRef.current = bufferRef.current.slice(-N);
      }

      if (bufferRef.current.length === N) {
        const match = CHEAT_SEQUENCE.every((k, i) => bufferRef.current[i] === k);
        if (match) setSecretUnlocked(true);
      }
    },
    [secretUnlocked, N]
  );

  return { secretUnlocked, pushKey };
}
