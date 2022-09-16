import { registerDecorator } from 'class-validator';

export function IsUTCDate() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsUTCDate',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: any) {
          return new Date(Number(value)).toString() === 'Invalid Date';
        },
      },
    });
  };
}
