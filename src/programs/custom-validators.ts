import { registerDecorator } from 'class-validator';

import { SessionDate } from './extra-types.js';

export function IsUTCDate() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsUTCDate',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: any) {
          return new Date(Number(value)).toString() !== 'Invalid Date';
        },
      },
    });
  };
}

export function IsSessionDate() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsSessionDate',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: any) {
          return SessionDate.toDate(value).toString() !== 'Invalid Date';
        },
      },
    });
  };
}
