export interface FighterAssets {
  id: string;
  displayName: string;
  isBoss: boolean;
  gridIndex: number;
  base: string;
  selector: string;
  versus: string | null;
  victory: string;
  winGif: string | null;
}

export interface SpecialMove {
  name: string;
  input: string;
}

export interface FighterData {
  id: string;
  displayName: string;
  bio: string;
  specialMoves: SpecialMove[];
  fatalities: SpecialMove[];
}
