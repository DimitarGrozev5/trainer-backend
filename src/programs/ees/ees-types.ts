import { IsInt, Min, Max } from 'class-validator';

export interface eesState {
  sessionDate: number;
  setsDone: SetsDone;
}

export type SetName = 'push' | 'pull' | 'squat' | 'ab' | 'accessory';

export interface SetsDone {
  push: number;
  pull: number;
  squat: number;
  ab: number;
  accessory: number;
}

export interface eesInit {}

export class eesAchieved implements SetsDone {
  @IsInt()
  @Min(0)
  @Max(2)
  push: number;

  @IsInt()
  @Min(0)
  @Max(2)
  pull: number;

  @IsInt()
  @Min(0)
  @Max(2)
  squat: number;

  @IsInt()
  @Min(0)
  @Max(2)
  ab: number;

  @IsInt()
  @Min(0)
  @Max(2)
  accessory: number;

  constructor(
    push: number,
    pull: number,
    squat: number,
    ab: number,
    accessory: number
  ) {
    this.push = push;
    this.pull = pull;
    this.squat = squat;
    this.ab = ab;
    this.accessory = accessory;
  }
}
