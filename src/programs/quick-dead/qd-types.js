var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { registerDecorator } from 'class-validator';
import { IsSessionDate } from '../custom-validators.js';
function IsQDVolume() {
    return function (object, propertyName) {
        registerDecorator({
            name: 'IsQDVolume',
            target: object.constructor,
            propertyName: propertyName,
            validator: {
                validate(value) {
                    return (value.toString() === '40' ||
                        value.toString() === '60' ||
                        value.toString() === '80' ||
                        value.toString() === '100');
                },
            },
        });
    };
}
export class qdInit {
    constructor(startDate) {
        this.startDate = startDate;
    }
}
__decorate([
    IsSessionDate()
], qdInit.prototype, "startDate", void 0);
export class qdAchieved {
    constructor(volume) {
        this.volume = volume;
    }
}
__decorate([
    IsQDVolume()
], qdAchieved.prototype, "volume", void 0);
