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
const moment = require("moment");
const request = require("request-promise");
const LogHelper_1 = require("../helpers/LogHelper");
const fileName = 'YodleeHelper';
class YodleeHelper {
    static getAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            let YODLEE = config_1.Config.PROJECT.YODLEE;
            try {
                let result = yield request({
                    uri: YODLEE.API_BASE + 'cobrand/login',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: {
                        'cobrand': {
                            'cobrandLogin': YODLEE.USERNAME,
                            'cobrandPassword': YODLEE.PASSWORD,
                            'locale': 'en_US'
                        }
                    },
                    json: true
                });
                return result;
            }
            catch (error) {
                LogHelper_1.default.logService.create(error);
            }
        });
    }
    static getLoginToken(loginName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let YODLEE = config_1.Config.PROJECT.YODLEE;
            const fnName = 'Login Yodlee';
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: `${YODLEE.API_BASE} + 'user/login'`, description: `loging On Yodlee With Login Name : ${loginName}`, status: 1 });
            let cobrandToken = yield this.getAccessToken();
            let userToken = yield request({
                uri: YODLEE.API_BASE + 'user/login',
                headers: { 'Content-Type': 'application/json', 'Authorization': `{cobSession=${cobrandToken.session.cobSession}}` },
                method: 'POST',
                body: {
                    'user': {
                        'loginName': loginName,
                        'password': password,
                    }
                },
                json: true
            });
            return {
                cobrandToken: cobrandToken.session.cobSession,
                userToken: userToken.user.session.userSession
            };
        });
    }
    static createAccount(userId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const fnName = 'create Account';
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: `${config_1.Config.PROJECT.YODLEE.API_BASE} + 'user/register'`, description: `Create Account With UserId: ${userId} - Email:${email}`, status: 1 });
            let cobrandToken = yield this.getAccessToken();
            const body = {
                'user': {
                    'loginName': 'JustDone_Live_' + userId,
                    'password': '@69n@mTech@hungLive!',
                    'email': email,
                    'preferences': {
                        'currency': 'USD',
                        'timeZone': 'PST',
                        'dateFormat': 'MM/dd/yyyy',
                        'locale': 'en_US'
                    }
                }
            };
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: `${config_1.Config.PROJECT.YODLEE.API_BASE} + 'user/register'`, description: 'Request Yodlee With Url :' + config_1.Config.PROJECT.YODLEE.API_BASE + 'user/register', status: 1 });
            let yodleeAccount = yield request({
                uri: config_1.Config.PROJECT.YODLEE.API_BASE + 'user/register',
                headers: { 'Content-Type': 'application/json', 'Authorization': `{cobSession=${cobrandToken.session.cobSession}}` },
                method: 'POST',
                body: body,
                json: true
            });
            if (yodleeAccount && yodleeAccount.user)
                return 1;
            else
                return 0;
        });
    }
    static removeBank(loginName, password, providerAccountId) {
        return __awaiter(this, void 0, void 0, function* () {
            let userToken = yield this.getLoginToken(loginName, password);
            return yield request({
                uri: config_1.Config.PROJECT.YODLEE.API_BASE + 'providerAccounts/' + providerAccountId,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
                },
                method: 'DELETE',
                json: true
            });
        });
    }
    static addBank(loginName, password, providerId, loginForm) {
        return __awaiter(this, void 0, void 0, function* () {
            let userToken = yield this.getLoginToken(loginName, password);
            const fnName = 'Add Bank';
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: config_1.Config.PROJECT.YODLEE.API_BASE + 'providerAccounts?providerId=' + providerId, description: 'Add Bank', status: 1 });
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: config_1.Config.PROJECT.YODLEE.API_BASE + 'providerAccounts?providerId=' + providerId, description: 'Request Yodlee With Url :' + config_1.Config.PROJECT.YODLEE.API_BASE + 'providerAccounts?providerId=' + providerId, status: 1 });
            return request({
                uri: config_1.Config.PROJECT.YODLEE.API_BASE + 'providerAccounts?providerId=' + providerId,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
                },
                method: 'POST',
                body: {
                    'loginForm': loginForm
                },
                json: true
            });
        });
    }
    static getProviders(loginName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let YODLEE = config_1.Config.PROJECT.YODLEE;
            let userToken = yield this.getLoginToken(loginName, password);
            let query = '';
            const fnName = 'Get Provider';
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: YODLEE.API_BASE + 'providers?' + query, description: 'Add Bank', status: 1 });
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: YODLEE.API_BASE + 'providers?' + query, description: 'Request Yodlee With Url :' + YODLEE.API_BASE + 'providers?' + query, status: 1 });
            return yield request({
                uri: YODLEE.API_BASE + 'providers?' + query,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
                },
                method: 'GET',
                json: true
            });
        });
    }
    static getListProvider(loginName, password, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let userToken = yield this.getLoginToken(loginName, password);
            let YODLEE = config_1.Config.PROJECT.YODLEE;
            let query = '';
            if (options) {
                query = (typeof options.top !== 'undefined' && options.top ? 'top=' + options.top : '500');
                query = query + (typeof options.skip !== 'undefined' && options.skip ? (query ? '&skip=' : 'skip=') + options.skip : '');
                query = query + (typeof options.name !== 'undefined' && options.name ? (query ? '&name=' : 'name=') + options.name : '');
                query = query + (typeof options.name !== 'undefined' && options.name ? (query ? '&id=' : 'id=') + options.id : '');
            }
            return yield request({
                uri: YODLEE.API_BASE + 'providers?' + query,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
                },
                method: 'GET',
                json: true
            });
        });
    }
    static getProviderById(loginName, password, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fnName = 'Get Provider By Id';
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: config_1.Config.PROJECT.YODLEE.API_BASE + 'providers/' + providerId, description: `Get Provider:${providerId}`, status: 1 });
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: config_1.Config.PROJECT.YODLEE.API_BASE + 'providers/' + providerId, description: 'Request Yodlee With Url :' + config_1.Config.PROJECT.YODLEE.API_BASE + 'providers/' + providerId, status: 1 });
            let userToken = yield this.getLoginToken(loginName, password);
            return yield request({
                uri: config_1.Config.PROJECT.YODLEE.API_BASE + 'providers/' + providerId,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
                },
                method: 'GET',
                json: true,
            });
        });
    }
    static getFormLoginBank(loginName, password, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            let userToken = yield this.getLoginToken(loginName, password);
            const fnName = 'Get Login Form Bank';
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: config_1.Config.PROJECT.YODLEE.API_BASE + 'providers/' + providerId, description: `Get Login Form Bank Provider:${providerId}`, status: 1 });
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: config_1.Config.PROJECT.YODLEE.API_BASE + 'providers/' + providerId, description: 'Request Yodlee With Url :' + config_1.Config.PROJECT.YODLEE.API_BASE + 'providers/' + providerId, status: 1 });
            return yield request({
                uri: config_1.Config.PROJECT.YODLEE.API_BASE + 'providers/' + providerId,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
                },
                method: 'GET',
                json: true
            });
        });
    }
    static getStatusConnectingBank(loginName, password, providerAccountId) {
        return __awaiter(this, void 0, void 0, function* () {
            let userToken = yield this.getLoginToken(loginName, password);
            const fnName = 'Get Connected Bank Status';
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: config_1.Config.PROJECT.YODLEE.API_BASE + 'providerAccounts/' + providerAccountId, description: `Get Connected Bank Status With Account Id:${providerAccountId}`, status: 1 });
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: config_1.Config.PROJECT.YODLEE.API_BASE + 'providerAccounts/' + providerAccountId, description: 'Request Yodlee With Url :' + config_1.Config.PROJECT.YODLEE.API_BASE + 'providerAccounts/' + providerAccountId, status: 1 });
            return yield request({
                uri: config_1.Config.PROJECT.YODLEE.API_BASE + 'providerAccounts/' + providerAccountId,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
                },
                method: 'GET',
                json: true
            });
        });
    }
    static getStatement(loginName, password, fromDate, toDate, type, accountIdSelected, skip = 0, timeLoop = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const fnName = 'Get Transaction';
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: '', description: `Get Transaction With Account Id:${accountIdSelected}`, status: 1 });
            fromDate = moment(fromDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
            toDate = moment(toDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
            console.log('=============> params:', fromDate, toDate, type, accountIdSelected);
            if (fromDate === 'Invalid date' || toDate === 'Invalid date') {
                throw new Error('format day input not true');
            }
            let userToken = yield this.getLoginToken(loginName, password);
            let options = {
                accountId: accountIdSelected,
                fromDate: fromDate,
                toDate: toDate,
                type: type,
                skip: skip
            };
            let query = '';
            query = (typeof options.accountId !== 'undefined' && options.accountId ? 'accountId=' + options.accountId : '');
            query = query + (options.fromDate ? (query ? '&fromDate=' : 'fromDate=') + options.fromDate : '');
            query = query + (options.toDate ? (query ? '&toDate=' : 'toDate=') + options.toDate : '');
            query = query + (options.type ? '&container=' + options.type : '');
            query = query + (options.skip ? '&skip=' + options.skip : '');
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: config_1.Config.PROJECT.YODLEE.API_BASE + 'transactions' + (query ? '?' + query : ''), description: 'Request Yodlee With Url :' + config_1.Config.PROJECT.YODLEE.API_BASE + 'transactions' + (query ? '?' + query : ''), status: 1 });
            let response;
            try {
                response = yield request({
                    uri: config_1.Config.PROJECT.YODLEE.API_BASE + 'transactions' + (query ? '?' + query : ''),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
                    },
                    method: 'GET',
                    json: true,
                });
            }
            catch (error) {
                if (timeLoop === 2)
                    throw error;
                return yield YodleeHelper.getStatement(loginName, password, fromDate, toDate, type, accountIdSelected, skip, timeLoop + 1);
            }
            let transactions = response && response.transaction ? response.transaction : [];
            return transactions;
        });
    }
    static getPublicKey(timeLoop = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const fnName = 'Get Public Key';
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: config_1.Config.PROJECT.YODLEE.API_BASE + 'cobrand/publicKey', description: `Function Is Geting  Public Key`, status: 1 });
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: config_1.Config.PROJECT.YODLEE.API_BASE + 'cobrand/publicKey', description: 'Request Yodlee With Url :' + config_1.Config.PROJECT.YODLEE.API_BASE + 'cobrand/publicKey', status: 1 });
            let cobrandToken = yield this.getAccessToken();
            let response;
            try {
                response = yield request({
                    uri: config_1.Config.PROJECT.YODLEE.API_BASE + 'cobrand/publicKey',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `{cobSession=${cobrandToken.session.cobSession}}` },
                    method: 'GET',
                    json: true,
                });
            }
            catch (error) {
                if (timeLoop === 2)
                    throw error;
                return yield YodleeHelper.getPublicKey(timeLoop + 1);
            }
            return response;
        });
    }
    static getFormByProviderId(loginName, password, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            let userToken = yield this.getLoginToken(loginName, password);
            const fnName = 'Get Bank Account';
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: config_1.Config.PROJECT.YODLEE.API_BASE + `providerAccounts/${providerId}?include=credentials`, description: `Function Is Geting  Bank Account`, status: 1 });
            return request({
                uri: config_1.Config.PROJECT.YODLEE.API_BASE + `providerAccounts/${providerId}?include=credentials`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
                },
                method: 'GET',
                json: true,
            });
        });
    }
    static updateBank(loginName, password, providerAccountId, loginForm) {
        return __awaiter(this, void 0, void 0, function* () {
            let userToken = yield this.getLoginToken(loginName, password);
            const fnName = 'Add Bank';
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: config_1.Config.PROJECT.YODLEE.API_BASE + 'providerAccounts?providerAccountIds=' + providerAccountId, description: `Update Bank`, status: 1 });
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: config_1.Config.PROJECT.YODLEE.API_BASE + 'providerAccounts?providerAccountIds=' + providerAccountId, description: 'Request Yodlee Method PUT With Url :' + config_1.Config.PROJECT.YODLEE.API_BASE + 'providerAccounts?providerId=' + providerAccountId, status: 1 });
            return request({
                uri: config_1.Config.PROJECT.YODLEE.API_BASE + 'providerAccounts?providerAccountIds=' + providerAccountId,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
                },
                method: 'PUT',
                body: {
                    'loginForm': loginForm
                },
                json: true
            });
        });
    }
    static getBankAccounts(loginName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let userToken = yield this.getLoginToken(loginName, password);
            const fnName = 'Get Bank Account';
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: config_1.Config.PROJECT.YODLEE.API_BASE + 'accounts', description: `Function Is Geting  Bank Account`, status: 1 });
            LogHelper_1.default.logService.create({ system: fileName, module: null, method: fnName, path: config_1.Config.PROJECT.YODLEE.API_BASE + 'accounts', description: 'Request Yodlee With Url :' + config_1.Config.PROJECT.YODLEE.API_BASE + 'accounts', status: 1 });
            return request({
                uri: config_1.Config.PROJECT.YODLEE.API_BASE + 'accounts',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
                },
                method: 'GET',
                json: true,
            });
        });
    }
}
exports.default = YodleeHelper;
