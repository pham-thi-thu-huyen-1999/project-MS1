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
const request = require("request-promise");
const log4js = require("log4js");
const config_1 = require("../config");
const DataHelper_1 = require("./DataHelper");
const AuthorizationHelper_1 = require("./AuthorizationHelper");
log4js.configure({
    appenders: {
        console: { type: 'console' },
    },
    categories: {
        default: { appenders: ['console'], level: 'debug' }
    }
});
const logger = log4js.getLogger('JustDone');
class LogHelper {
    static logDebug(fileName, fnName, message) {
        logger.debug(fileName + ' - ' + fnName + ' - ' + message);
    }
    static logInfo(fileName, fnName, message) {
        logger.info(fileName + ' - ' + fnName + ' - ' + message);
    }
    static logWarn(fileName, fnName, message) {
        logger.warn(fileName + ' - ' + fnName + ' - ' + message);
    }
    static logError(fileName, fnName, message) {
        logger.error(fileName + ' - ' + fnName + ' - ' + message);
    }
    static get(url) {
        return DataHelper_1.default.handlePromiseRequest(request({
            method: 'GET',
            url: `${config_1.Config.PROJECT.SERVER.LOG.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.LOG.DOMAIN}` + url,
            json: true
        }));
    }
    static post(url, data) {
        return DataHelper_1.default.handlePromiseRequest(request({
            method: 'POST',
            url: `${config_1.Config.PROJECT.SERVER.LOG.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.LOG.DOMAIN}` + url,
            body: data,
            json: true
        }));
    }
    static put(url, data) {
        return DataHelper_1.default.handlePromiseRequest(request({
            method: 'PUT',
            url: `${config_1.Config.PROJECT.SERVER.LOG.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.LOG.DOMAIN}` + url,
            body: data,
            json: true
        }));
    }
    static delete(url) {
        return DataHelper_1.default.handlePromiseRequest(request({
            method: 'DELETE',
            url: `${config_1.Config.PROJECT.SERVER.LOG.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.LOG.DOMAIN}` + url,
            json: true
        }));
    }
}
LogHelper.notificationService = {
    get(status, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield LogHelper.get(`/api/notification?page=${page}&limit=${limit}`);
        });
    },
    assign(productName, originId, actorNumberOneId, actorNumberTwoId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let origin = yield AuthorizationHelper_1.default.userService.get(originId);
            let actorNumberOne = yield AuthorizationHelper_1.default.userService.get(actorNumberOneId);
            let actorNumberTwo = yield AuthorizationHelper_1.default.userService.get(actorNumberTwoId);
            if (!origin || !actorNumberOne || !actorNumberTwo)
                return;
            let data = [];
            if (type === 'assign') {
                data.push({ receiverId: actorNumberOne._id, title: `Assign manager`, message: `${origin.fullName} assign manager you to ${actorNumberTwo.fullName} in ${productName} product` });
                data.push({ receiverId: actorNumberTwo._id, title: `Assign manager`, message: `${origin.fullName} assign manager ${actorNumberOne.fullName} to you in ${productName} product` });
            }
            else {
                data.push({ receiverId: actorNumberOne._id, title: `Unassign manager`, message: `${origin.fullName} unassign manager you to ${actorNumberTwo.fullName} in ${productName} product` });
                data.push({ receiverId: actorNumberTwo._id, title: `Unassign manager`, message: `${origin.fullName} unassign manager ${actorNumberOne.fullName} to you in ${productName} product` });
            }
            return yield LogHelper.post('/api/notification/create-multi-data', data);
        });
    },
    invite(productName, originId, receiverIds, toEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            let origin = yield AuthorizationHelper_1.default.userService.get(originId);
            if (!origin)
                return;
            if (!receiverIds.length || !toEmail)
                return;
            let data = {
                title: 'Invited client',
                message: `${origin.fullName} invite client with <a href="/client-management" target="_blank">${toEmail}</a> in ${productName} product`,
                receiverIds,
            };
            return yield this.createMultipleToReceiverIds(data);
        });
    },
    createUserByRole(productName, originId, receiverIds, toEmail, roleName) {
        return __awaiter(this, void 0, void 0, function* () {
            let origin = yield AuthorizationHelper_1.default.userService.get(originId);
            if (!origin || !productName || !receiverIds.length || !toEmail || !roleName)
                return;
            let data = {
                title: 'Create user',
                message: `${origin.fullName} create user <a href="/client-management" target="_blank">${toEmail}</a> with ${roleName} role in ${productName} product`,
                receiverIds,
            };
            return yield this.createMultipleToReceiverIds(data);
        });
    },
    actionAccount(productName, originId, receiverIds, email, name, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let origin = yield AuthorizationHelper_1.default.userService.get(originId);
            if (!origin || !productName || !receiverIds.length || !email || !name)
                return;
            if (receiverIds.indexOf(originId) >= 0)
                receiverIds.splice(receiverIds.indexOf(originId), 1);
            let data;
            if (type === 'enable') {
                data = {
                    title: 'Enable user',
                    message: `${origin.fullName} enable user <a href="/client-management" target="_blank">${name}(${email})</a> in ${productName} product`,
                    receiverIds,
                };
            }
            else {
                data = {
                    title: 'Disable user',
                    message: `${origin.fullName} disable user <a href="/client-management" target="_blank">${name}(${email})</a> in ${productName} product`,
                    receiverIds,
                };
            }
            return yield this.createMultipleToReceiverIds(data);
        });
    },
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield LogHelper.post('/api/notification', data);
        });
    },
    createMultipleToReceiverIds(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield LogHelper.post('/api/notification/create-multi-receivers', data);
        });
    },
    delete(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield LogHelper.delete(`/api/notification/${_id}`);
        });
    }
};
LogHelper.historyService = {
    assign(productName, originId, actorNumberOneId, actorNumberTwoId, claim, status, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let origin = yield AuthorizationHelper_1.default.userService.get(originId);
            let actorNumberOne = yield AuthorizationHelper_1.default.userService.get(actorNumberOneId);
            let actorNumberTwo = yield AuthorizationHelper_1.default.userService.get(actorNumberTwoId);
            if (!productName || !origin || !actorNumberOne || !actorNumberTwo || !claim || !status || !type)
                return;
            let data = [];
            if (type === 'assign')
                data.push({ userId: origin._id,
                    target: { id: actorNumberTwo._id,
                        email: actorNumberTwo.email },
                    claim,
                    description: `You assigned manager  ${actorNumberOne.fullName} to ${actorNumberTwo.fullName} in ${productName} product`,
                    status });
            else
                data.push({ userId: origin._id,
                    target: { id: actorNumberTwo._id,
                        email: actorNumberTwo.email },
                    claim,
                    description: `You unassigned manager  ${actorNumberOne.fullName} to ${actorNumberTwo.fullName} in ${productName} product`,
                    status });
            return yield this.create(data);
        });
    },
    createUserByRole(productName, originId, toEmail, claim, roleName, status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!originId || !productName || !toEmail || !roleName)
                return;
            let data = {
                userId: originId,
                target: { email: toEmail },
                claim: claim,
                description: `You create user <a href="/client-management" target="_blank">${toEmail}</a> with ${roleName} role in ${productName} product`,
                status,
            };
            return yield this.create(data);
        });
    },
    getListSignIn(isChoice, claim, userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield LogHelper.post(`/api/history/list-sign-in?isChoice=${isChoice}&claim=${claim}`, userIds);
        });
    },
    get(claim, status, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield LogHelper.get(`/api/history?claim=${claim}&status=${status}&page=${page}&limit=${limit}`);
        });
    },
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield LogHelper.post('/api/history', data);
        });
    },
    delete(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield LogHelper.delete(`/api/history/${_id}`);
        });
    }
};
LogHelper.logService = {
    get(system, module, method, status, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield LogHelper.get(`/api/log?system=${system}&module=${module}&method=${method}&status=${status}&page=${page}&limit=${limit}`);
        });
    },
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield LogHelper.post('/api/log', data);
        });
    },
    delete(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield LogHelper.delete(`/api/log/${_id}`);
        });
    },
    getSytemInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield LogHelper.get(`/api/system/get-log-infor`);
        });
    },
};
Object.seal(LogHelper);
exports.default = LogHelper;
