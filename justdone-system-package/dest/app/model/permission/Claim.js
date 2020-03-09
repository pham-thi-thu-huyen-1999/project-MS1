"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Claim {
    constructor(model) {
        if (!model)
            return;
        this.code = model.code;
        this.name = model.name;
        this.path = model.path;
        this.method = model.method;
        this.order = model.order;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new Claim(item)) : [];
    }
}
Object.seal(Claim);
exports.default = Claim;
