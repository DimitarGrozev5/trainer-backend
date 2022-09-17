import { registerDecorator } from 'class-validator';
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
