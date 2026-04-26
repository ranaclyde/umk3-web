export type AppScreen =
  | 'title'
  | 'menu'
  | 'secret-menu'
  | 'character-select'
  | 'bio';

export type BossId = 'motaro' | 'shaokahn';

export interface AppState {
  screen: AppScreen;
  secretUnlocked: boolean;
  enabledBoss: BossId | null;
  selectedFighter: string | null;
  previousScreen: AppScreen | null;
}

export type AppAction =
  | { type: 'GO_TO_MENU' }
  | { type: 'GO_TO_SECRET_MENU' }
  | { type: 'GO_TO_CHARACTER_SELECT' }
  | { type: 'SELECT_FIGHTER'; fighterId: string }
  | { type: 'GO_TO_BIO' }
  | { type: 'GO_BACK' }
  | { type: 'UNLOCK_SECRET' }
  | { type: 'SET_BOSS'; boss: BossId | null }
  | { type: 'GO_TO_TITLE' };
