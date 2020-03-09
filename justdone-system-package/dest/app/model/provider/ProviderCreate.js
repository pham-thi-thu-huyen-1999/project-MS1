"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProviderCreate {
    constructor(model) {
        if (!model)
            return;
        this.name = model.name;
        this.loginUrl = model.loginUrl;
        this.baseUrl = model.baseUrl;
        this.favicon = model.favicon;
        this.logo = model.logo;
        this.bankId = model.bankId;
        this.countryISOCode = model.countryISOCode;
        this.languageISOCode = model.languageISOCode;
    }
}
Object.seal(ProviderCreate);
exports.default = ProviderCreate;
