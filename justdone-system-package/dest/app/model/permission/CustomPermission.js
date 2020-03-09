"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class CustomPermission {
    constructor(model) {
        if (!model)
            return;
        this.claim = model.claim;
        this.assigner = DataHelper_1.default.handleFileDataModel(model.assigner);
        this.assignee = model.assignee ? DataHelper_1.default.handleFileDataModel(model.assignee) : null;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new CustomPermission(item)) : [];
    }
}
Object.seal(CustomPermission);
exports.default = CustomPermission;
