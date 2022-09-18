import { registerDecorator } from 'class-validator';
import { IsUTCDate } from '../custom-validators';

function IsQDVolume() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsQDVolume',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: any) {
          return (
            value.toString() === '40' ||
            value.toString() === '60' ||
            value.toString() === '80' ||
            value.toString() === '100'
          );
        },
      },
    });
  };
}

export type qdVolume = 40 | 60 | 80 | 100;

export interface qdState {
  sessionDate: number;
  scheduleIndex: number;
  lastVolume: qdVolume;
}

export class qdInit {
  @IsUTCDate()
  startDate: number;

  constructor(startDate: number) {
    this.startDate = startDate;
  }
}

export class qdAchieved {
  @IsQDVolume()
  volume: qdVolume;

  constructor(volume: qdVolume) {
    this.volume = volume;
  }
}
