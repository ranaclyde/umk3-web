import type { FighterAssets } from '../types/fighter';

const BASE = '/assets/images/fighters';

// Fighters whose victory asset is .gif instead of .png
const VICTORY_GIF = new Set(['jax', 'kunglao', 'sektor']);

// Fighters with an extra win GIF
const WIN_GIFS: Record<string, string> = {
  jade:     `${BASE}/jade/jade-win.gif`,
  kitana:   `${BASE}/kitana/kitana-win.gif`,
  mileena:  `${BASE}/mileena/mileena-win.gif`,
  reptile:  `${BASE}/reptile/reptile-win.gif`,
  scorpion: `${BASE}/scorpion/scorpion-win.gif`,
};

// Fighters with no versus.png
const NO_VERSUS = new Set(['motaro']);

function asset(id: string): FighterAssets {
  return {
    id,
    displayName: DISPLAY_NAMES[id] ?? id,
    isBoss: id === 'motaro' || id === 'shaokahn',
    gridIndex: -1, // assigned below
    base:     `${BASE}/${id}/base.gif`,
    selector: `${BASE}/${id}/selector.png`,
    versus:   NO_VERSUS.has(id) ? null : `${BASE}/${id}/versus.png`,
    victory:  `${BASE}/${id}/victory.${VICTORY_GIF.has(id) ? 'gif' : 'png'}`,
    winGif:   WIN_GIFS[id] ?? null,
  };
}

const DISPLAY_NAMES: Record<string, string> = {
  'classic-subzero': 'Classic Sub-Zero',
  cyrax:             'Cyrax',
  ermac:             'Ermac',
  'human-smoke':     'Human Smoke',
  jade:              'Jade',
  jax:               'Jax',
  kabal:             'Kabal',
  kano:              'Kano',
  kitana:            'Kitana',
  kunglao:           'Kung Lao',
  liukang:           'Liu Kang',
  mileena:           'Mileena',
  motaro:            'Motaro',
  nightwolf:         'Nightwolf',
  noobsaibot:        'Noob Saibot',
  rain:              'Rain',
  reptile:           'Reptile',
  scorpion:          'Scorpion',
  sektor:            'Sektor',
  shangtsung:        'Shang Tsung',
  shaokahn:          'Shao Kahn',
  sindel:            'Sindel',
  smoke:             'Smoke',
  sonya:             'Sonya',
  stryker:           'Stryker',
  subzero:           'Sub-Zero',
};

// Genesis character select grid order (faithful to UMK3 Sega Genesis)
// Row 0 (7): rain, reptile, stryker, jax, nightwolf, jade, noobsaibot
// Row 1 (7): sonya, kano, mileena, human-smoke, subzero, classic-subzero, kunglao
// Row 2 (5): sektor, kitana, ermac, scorpion, cyrax
// Row 3 (5): kabal, sindel, smoke, liukang, shangtsung
// Boss row:  motaro, shaokahn (conditional)
const REGULAR_ORDER = [
  // Row 0
  'rain', 'reptile', 'stryker', 'jax', 'nightwolf', 'jade', 'noobsaibot',
  // Row 1
  'sonya', 'kano', 'mileena', 'human-smoke', 'subzero', 'classic-subzero', 'kunglao',
  // Row 2
  'sektor', 'kitana', 'ermac', 'scorpion', 'cyrax',
  // Row 3
  'kabal', 'sindel', 'smoke', 'liukang', 'shangtsung',
];

const BOSS_ORDER = ['motaro', 'shaokahn'];

export const REGULAR_FIGHTERS: FighterAssets[] = REGULAR_ORDER.map((id, i) => ({
  ...asset(id),
  gridIndex: i,
}));

export const BOSS_FIGHTERS: FighterAssets[] = BOSS_ORDER.map((id, i) => ({
  ...asset(id),
  gridIndex: REGULAR_ORDER.length + i,
}));

export const FIGHTERS_GRID: FighterAssets[] = [...REGULAR_FIGHTERS, ...BOSS_FIGHTERS];

export const FIGHTER_BY_ID: Record<string, FighterAssets> = Object.fromEntries(
  FIGHTERS_GRID.map(f => [f.id, f])
);

// Row widths for the Genesis irregular grid (used by useGridInput)
export const GRID_ROW_WIDTHS = [7, 7, 5, 5] as const;
export const BOSS_ROW_WIDTH = 2;
