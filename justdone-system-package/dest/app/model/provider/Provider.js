"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class Provider {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.name = model.name;
        this.loginUrl = model.loginUrl;
        this.baseUrl = model.baseUrl;
        this.favicon = model.favicon;
        this.logo = model.logo;
        this.bankId = model.bankId;
        this.countryISOCode = model.countryISOCode;
        this.languageISOCode = model.languageISOCode;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new Provider(item)) : [];
    }
}
Object.seal(Provider);
exports.default = Provider;
