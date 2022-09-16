import { registerDecorator, IsInt, IsPositive } from 'class-validator';

import { IsUTCDate } from '../custom-validators.js';

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
  sessionDate: number;
  sessionIndex: number;
  lastHeavySessionAchieved: number;
  schedule: number[];
  currentScheduleIndex: number;
}

export class EnduroGripInit {
  @IsInt()
  @IsPositive()
  @IsUTCDate()
  startDate: Date;

  @IsScheduleArray()
  schedule: number[];

  constructor(startDate: Date, schedule: number[]) {
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
