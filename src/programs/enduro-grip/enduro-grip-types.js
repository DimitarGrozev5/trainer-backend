var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { registerDecorator, IsInt, IsPositive } from 'class-validator';
import { IsSessionDate } from '../custom-validators.js';
function IsScheduleArray() {
    return function (object, propertyName) {
        registerDecorator({
            name: 'IsScheduleArray',
            target: object.constructor,
            propertyName: propertyName,
            validator: {
                validate(value) {
                    return value.toString() === '4' || value.toString() === '4,3';
                },
            },
        });
    };
}
export class EnduroGripInit {
    constructor(startDate, schedule) {
        this.startDate = startDate;
        this.schedule = schedule;
    }
}
__decorate([
    IsSessionDate()
], EnduroGripInit.prototype, "startDate", void 0);
__decorate([
    IsScheduleArray()
], EnduroGripInit.prototype, "schedule", void 0);
export class EnduroGripAchieved {
    constructor(sets) {
        this.sets = sets;
    }
}
__decorate([
    IsInt(),
    IsPositive()
], EnduroGripAchieved.prototype, "sets", void 0);
