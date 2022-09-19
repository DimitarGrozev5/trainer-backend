import { registerDecorator, IsInt, IsPositive } from 'class-validator';

import { IsSessionDate } from '../custom-validators.js';
import { SessionDate } from '../extra-types.js';

function IsScheduleArray() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsScheduleArray',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: any) {
          return value.toString() === '4' || value.toString() === '4,3';
        },
      },
    });
  };
}

export interface EnduroGripState {
  sessionDate: SessionDate;
  sessionIndex: number;
  lastHeavySessionAchieved: number;
  schedule: number[];
  currentScheduleIndex: number;
}

export class EnduroGripInit {
  @IsSessionDate()
  startDate: SessionDate;

  @IsScheduleArray()
  schedule: number[];

  constructor(startDate: SessionDate, schedule: number[]) {
    this.startDate = startDate;
    this.schedule = schedule;
  }
}

export class EnduroGripAchieved {
  @IsInt()
  @IsPositive()
  sets: number;

  constructor(sets: number) {
    this.sets = sets;
  }
}
