"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const request = require("request-promise");
const Error_1 = require("../app/model/common/Error");
class BankServiceHelper {
    static createAccount(userId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                userId: userId,
                email: email
            };
            try {
                let yodleeAccount = yield request({
                    uri: `${config_1.Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee`,
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: body,
                    json: true
                });
                return yodleeAccount;
            }
            catch (error) {
                throw new Error_1.ErrorYodlee(3);
            }
        });
    }
    static removeBank(userId, providerAccountId) {
        return __awaiter(this, void 0, void 0, function* () {
            return 'ahihi da remove';
        });
    }
    static addBank(userId, providerId, loginForm) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield request({
                uri: `${config_1.Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/add-bank`,
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: {
                    'userId': userId,
                    'providerId': providerId,
                    'loginForm': loginForm
                },
                json: true
            });
            return res.data;
        });
    }
    static updateBank(userId, providerId, loginForm) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield request({
                uri: `${config_1.Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/update-bank`,
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'PUT',
                body: {
                    'userId': userId,
                    'providerId': providerId,
                    'loginForm': loginForm
                },
                json: true
            });
            return res.data;
        });
    }
    static getProviders(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield request({
                uri: `${config_1.Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/providers/${userId}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                json: true
            });
            return res.data;
        });
    }
    static getFormLoginBankByProviderAccountId(userId, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield request({
                    uri: `${config_1.Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/form-credential/${userId}/${providerId}`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'GET',
                    json: true
                });
                return res.data.loginForm;
            }
            catch (error) {
                console.log(error);
                throw new Error_1.ErrorYodlee(4);
            }
        });
    }
    static getFormLoginBank(userId, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield request({
                    uri: `${config_1.Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/form-login-bank/${userId}/${providerId}`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'GET',
                    json: true
                });
                console.log(res.data);
                return res.data.provider[0];
            }
            catch (error) {
                console.log(error);
                throw new Error_1.ErrorYodlee(4);
            }
        });
    }
    static getProviderById(userId, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield request({
                uri: `${config_1.Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/providers/${userId}/${providerId}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                json: true
            });
            return res.data;
        });
    }
    static getStatusConnectingBank(userId, providerAccountId) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield request({
                uri: `${config_1.Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/connecting-bank-status/${userId}/${providerAccountId}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                json: true
            });
            return res.data;
        });
    }
    static getBankAccounts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield request({
                uri: `${config_1.Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/bank-accounts/${userId}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                json: true
            });
            return res.data;
        });
    }
    static getStatement(userId, selectAccountId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield request({
                uri: `${config_1.Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/statement/${userId}/${selectAccountId}/${type}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                json: true
            });
            return res.data;
        });
    }
    static getPublicKey() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield request({
                uri: `${config_1.Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/public-key`,
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                json: true
            });
            return res.data;
        });
    }
    static getSytemInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield request({
                uri: `${config_1.Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/system/get-bank-infor`,
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                json: true
            });
            return res.data;
        });
    }
    static updateOpenBalanceStatement(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield request({
                uri: `${config_1.Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/update-openbalance-multi-bank`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data,
                method: 'PUT',
                json: true
            });
            return res.data;
        });
    }
    static getStransactionByMonth(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield request({
                uri: `${config_1.Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/transaction/get-transaction-by-month`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data,
                method: 'POST',
                json: true
            });
            return res.data;
        });
    }
    static calcTransactionByClosing(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield request({
                uri: `${config_1.Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/calc-trans-by-closing`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data,
                method: 'POST',
                json: true
            });
            return res.data;
        });
    }
    static updateStatement(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield request({
                uri: `${config_1.Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/statement/update-statement-manual`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data,
                method: 'PUT',
                json: true
            });
            return res.data;
        });
    }
}
exports.default = BankServiceHelper;
