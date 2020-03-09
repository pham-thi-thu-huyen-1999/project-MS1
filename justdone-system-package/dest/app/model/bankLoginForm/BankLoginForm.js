"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BankLoginForm {
    constructor(model) {
        if (!model)
            return;
        this.providerId = model.providerId;
        this.loginForm = model.loginForm;
        this.logo = model.logo;
        this.bankName = model.bankName;
        this.languageISOCode = model.languageISOCode;
        this.countryISOCode = model.countryISOCode;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new BankLoginForm(item)) : [];
    }
}
Object.seal(BankLoginForm);
exports.default = BankLoginForm;
