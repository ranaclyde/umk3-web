const AUDIO_BASE = '/assets/audio';
const ARENAS_BASE = `${AUDIO_BASE}/arenas`;
const AUTHOR = 'Dan Forden, Chris Braymen, Roy Wilkins';

export const AUDIO_TRACKS = {
  bgm: {
    title:       `${AUDIO_BASE}/01 - Title Theme - ${AUTHOR}.mp3`,
    select:      `${AUDIO_BASE}/02 - Select Your Fighter - ${AUTHOR}.mp3`,
    soulChamber: `${AUDIO_BASE}/27 - Soul Chamber - ${AUTHOR}.mp3`,
  },
  arenas: [
    { id: 'subway',  label: 'The Subway',                          path: `${ARENAS_BASE}/06 - The Subway - ${AUTHOR}.mp3` },
    { id: 'rooftop', label: "Rooftop / Khan's Tower / Jade's Desert", path: `${ARENAS_BASE}/09 - The Rooftop, Shao Khan's Tower, & Jade's Desert - ${AUTHOR}.mp3` },
    { id: 'bank',    label: 'The Bank & River Kombat',              path: `${ARENAS_BASE}/12 - The Bank & River Kombat - ${AUTHOR}.mp3` },
    { id: 'temple',  label: "Kombat Temple & Scorpion's Lair",      path: `${ARENAS_BASE}/15 - Kombat Temple & Scorpion's Lair - ${AUTHOR}.mp3` },
    { id: 'streets', label: 'The Streets',                          path: `${ARENAS_BASE}/18 - The Streets - ${AUTHOR}.mp3` },
    { id: 'bridge',  label: "The Bridge & Khan's Kave",             path: `${ARENAS_BASE}/21 - The Bridge & Khan's Kave - ${AUTHOR}.mp3` },
    { id: 'balcony', label: 'The Balcony, Pit 3 & The Lost World',  path: `${ARENAS_BASE}/24 - The Balcony, The Pit 3, & The Lost World - ${AUTHOR}.mp3` },
  ],
} as const;

export type BgmKey = keyof typeof AUDIO_TRACKS.bgm;
export type ArenaTrack = (typeof AUDIO_TRACKS.arenas)[number];
