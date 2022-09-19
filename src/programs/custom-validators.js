import { registerDecorator } from 'class-validator';
import { SessionDate } from './extra-types';
export function IsUTCDate() {
    return function (object, propertyName) {
        registerDecorator({
            name: 'IsUTCDate',
            target: object.constructor,
            propertyName: propertyName,
            validator: {
                validate(value) {
                    return new Date(Number(value)).toString() !== 'Invalid Date';
                },
            },
        });
    };
}
export function IsSessionDate() {
    return function (object, propertyName) {
        registerDecorator({
            name: 'IsSessionDate',
            target: object.constructor,
            propertyName: propertyName,
            validator: {
                validate(value) {
                    return SessionDate.toDate(value).toString() !== 'Invalid Date';
                },
            },
        });
    };
}
