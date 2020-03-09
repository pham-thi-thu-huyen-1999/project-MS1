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
const URL = 'https://app.justdone.com.au';
class JustdoneHelper {
    static login() {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                email: 'admin@justdone.com.au',
                password: 'thenatives123@'
            };
            try {
                let token = yield request({
                    uri: `${URL}/auth/login`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic YWRtaW5AanVzdGRvbmUuY29tLmF1OnRoZW5hdGl2ZXMxMjNA'
                    },
                    method: 'POST',
                    body: body,
                    json: true
                });
                return token;
            }
            catch (error) {
                console.log(error);
                throw new Error_1.ErrorYodlee(3);
            }
        });
    }
    static getCrunch(token, email, day, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield request({
                uri: `${URL}/api/crunch-tool/${email}/${day}/${type}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                method: 'GET',
                json: true
            }).catch(err => {
                console.log(err);
            });
            return res;
        });
    }
    static getProviders(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield request({
                uri: `${config_1.Config.PROJECT.SERVER.INTEGRATION.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.INTEGRATION.DOMAIN}/api/yodlee/providers/${userId}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                json: true
            });
            return res.data;
        });
    }
    static getFormLoginBank(userId, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield request({
                    uri: `${config_1.Config.PROJECT.SERVER.INTEGRATION.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.INTEGRATION.DOMAIN}/api/yodlee/form-login-bank/${userId}/${providerId}`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'GET',
                    json: true
                });
                return res.data.provider[0].loginForm;
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
                uri: `${config_1.Config.PROJECT.SERVER.INTEGRATION.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.INTEGRATION.DOMAIN}/api/yodlee/providers/${userId}/${providerId}`,
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
                uri: `${config_1.Config.PROJECT.SERVER.INTEGRATION.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.INTEGRATION.DOMAIN}/api/yodlee/connecting-bank-status/${userId}/${providerAccountId}`,
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
                uri: `${config_1.Config.PROJECT.SERVER.INTEGRATION.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.INTEGRATION.DOMAIN}/api/yodlee/bank-accounts/${userId}`,
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
                uri: `${config_1.Config.PROJECT.SERVER.INTEGRATION.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.INTEGRATION.DOMAIN}/api/yodlee/statement/${userId}/${selectAccountId}/${type}`,
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
                uri: `${config_1.Config.PROJECT.SERVER.INTEGRATION.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.INTEGRATION.DOMAIN}/api/yodlee/public-key`,
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                json: true
            });
            return res.data;
        });
    }
}
exports.default = JustdoneHelper;
