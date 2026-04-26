import {
  createContext, useContext, useReducer,
  type ReactNode, type Dispatch,
} from 'react';
import type { AppState, AppAction } from '../types/state';

const INITIAL: AppState = {
  screen:          'menu',
  secretUnlocked:  false,
  enabledBoss:     null,
  selectedFighter: null,
  previousScreen:  null,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'GO_TO_MENU':
      return { ...state, screen: 'menu', previousScreen: state.screen };
    case 'GO_TO_SECRET_MENU':
      return { ...state, screen: 'secret-menu', previousScreen: state.screen };
    case 'GO_TO_CHARACTER_SELECT':
      return { ...state, screen: 'character-select', previousScreen: state.screen };
    case 'SELECT_FIGHTER':
      return { ...state, selectedFighter: action.fighterId };
    case 'GO_BACK':
      return { ...state, screen: state.previousScreen ?? 'menu', previousScreen: null };
    case 'UNLOCK_SECRET':
      return { ...state, secretUnlocked: true };
    case 'SET_BOSS':
      return { ...state, enabledBoss: action.boss };
    case 'GO_TO_TITLE':
      return { ...INITIAL };
    default:
      return state;
  }
}

interface ContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<ContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState(): ContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be inside AppProvider');
  return ctx;
}
