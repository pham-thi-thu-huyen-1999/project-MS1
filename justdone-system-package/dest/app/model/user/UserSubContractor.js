"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserSubContractor {
    constructor(model) {
        if (!model)
            return;
        this.name = model.name;
        this.abnCode = model.abnCode;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new UserSubContractor(item)) : [];
    }
}
Object.seal(UserSubContractor);
exports.default = UserSubContractor;
