import type { FighterData } from '../types/fighter';

import classicSubzero from '../data/fighters/classic-subzero.json';
import cyrax         from '../data/fighters/cyrax.json';
import ermac         from '../data/fighters/ermac.json';
import humanSmoke    from '../data/fighters/human-smoke.json';
import jade          from '../data/fighters/jade.json';
import jax           from '../data/fighters/jax.json';
import kabal         from '../data/fighters/kabal.json';
import kano          from '../data/fighters/kano.json';
import kitana        from '../data/fighters/kitana.json';
import kunglao       from '../data/fighters/kunglao.json';
import liukang       from '../data/fighters/liukang.json';
import mileena       from '../data/fighters/mileena.json';
import motaro        from '../data/fighters/motaro.json';
import nightwolf     from '../data/fighters/nightwolf.json';
import noobsaibot    from '../data/fighters/noobsaibot.json';
import rain          from '../data/fighters/rain.json';
import reptile       from '../data/fighters/reptile.json';
import scorpion      from '../data/fighters/scorpion.json';
import sektor        from '../data/fighters/sektor.json';
import shangtsung    from '../data/fighters/shangtsung.json';
import shaokahn      from '../data/fighters/shaokahn.json';
import sindel        from '../data/fighters/sindel.json';
import smoke         from '../data/fighters/smoke.json';
import sonya         from '../data/fighters/sonya.json';
import stryker       from '../data/fighters/stryker.json';
import subzero       from '../data/fighters/subzero.json';

export const FIGHTER_CONTENT: Record<string, FighterData> = {
  'classic-subzero': classicSubzero as FighterData,
  cyrax:             cyrax          as FighterData,
  ermac:             ermac          as FighterData,
  'human-smoke':     humanSmoke     as FighterData,
  jade:              jade           as FighterData,
  jax:               jax            as FighterData,
  kabal:             kabal          as FighterData,
  kano:              kano           as FighterData,
  kitana:            kitana         as FighterData,
  kunglao:           kunglao        as FighterData,
  liukang:           liukang        as FighterData,
  mileena:           mileena        as FighterData,
  motaro:            motaro         as FighterData,
  nightwolf:         nightwolf      as FighterData,
  noobsaibot:        noobsaibot     as FighterData,
  rain:              rain           as FighterData,
  reptile:           reptile        as FighterData,
  scorpion:          scorpion       as FighterData,
  sektor:            sektor         as FighterData,
  shangtsung:        shangtsung     as FighterData,
  shaokahn:          shaokahn       as FighterData,
  sindel:            sindel         as FighterData,
  smoke:             smoke          as FighterData,
  sonya:             sonya          as FighterData,
  stryker:           stryker        as FighterData,
  subzero:           subzero        as FighterData,
};
