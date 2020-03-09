"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoleUpdate {
    constructor(model) {
        if (!model)
            return;
        this.name = model.name;
        this.level = model.level;
        this.code = model.code;
    }
}
Object.seal(RoleUpdate);
exports.default = RoleUpdate;
