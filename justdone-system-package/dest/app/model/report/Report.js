"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Report {
    constructor(model) {
        if (!model)
            return;
        this._id = model._id && model._id.toString();
        this.name = model.name;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new Report(item)) : [];
    }
}
Object.seal(Report);
exports.default = Report;
