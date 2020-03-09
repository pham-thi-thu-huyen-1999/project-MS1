"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoleCreate {
    constructor(model) {
        if (!model)
            return;
        this.name = model.name;
        this.level = model.level;
        this.code = model.code;
        this.products = model.products;
    }
}
Object.seal(RoleCreate);
exports.default = RoleCreate;
