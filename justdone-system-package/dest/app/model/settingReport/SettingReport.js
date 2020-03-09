"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SettingReport {
    constructor(model) {
        if (!model)
            return;
        this._id = model._id && model._id.toString();
        this.code = model.code;
        this.groupId = model.groupId;
        this.reportType = model.reportType;
        this.isCreditAsPositive = model.isCreditAsPositive;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new SettingReport(item)) : [];
    }
}
Object.seal(SettingReport);
exports.default = SettingReport;
