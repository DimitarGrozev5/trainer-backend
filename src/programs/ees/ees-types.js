var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IsInt, Min, Max } from 'class-validator';
export class eesAchieved {
    constructor(push, pull, squat, ab, accessory) {
        this.push = push;
        this.pull = pull;
        this.squat = squat;
        this.ab = ab;
        this.accessory = accessory;
    }
}
__decorate([
    IsInt(),
    Min(0),
    Max(2)
], eesAchieved.prototype, "push", void 0);
__decorate([
    IsInt(),
    Min(0),
    Max(2)
], eesAchieved.prototype, "pull", void 0);
__decorate([
    IsInt(),
    Min(0),
    Max(2)
], eesAchieved.prototype, "squat", void 0);
__decorate([
    IsInt(),
    Min(0),
    Max(2)
], eesAchieved.prototype, "ab", void 0);
__decorate([
    IsInt(),
    Min(0),
    Max(2)
], eesAchieved.prototype, "accessory", void 0);
