"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserPaymentCard {
    constructor(model) {
        if (!model)
            return;
        this.name = model.name;
        this.lastFourDigit = model.lastFourDigit;
        this.expiredMonth = model.expiredMonth;
        this.expiredYear = model.expiredYear;
    }
}
Object.seal(UserPaymentCard);
exports.default = UserPaymentCard;
