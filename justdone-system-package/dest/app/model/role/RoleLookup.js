"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class Role {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.name = model.name;
        this.level = model.level;
        this.code = model.code;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new Role(item)) : [];
    }
}
Object.seal(Role);
exports.default = Role;
