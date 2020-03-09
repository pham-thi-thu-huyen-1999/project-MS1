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
const config_1 = require("../config");
const DataHelper_1 = require("./DataHelper");
class AuthorizationHelper {
    static get(url) {
        return DataHelper_1.default.handlePromiseRequest(request({
            method: 'GET',
            uri: `${config_1.Config.PROJECT.SERVER.AUTHORIZATION.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.AUTHORIZATION.DOMAIN}` + url,
            json: true
        }));
    }
    static post(url, data) {
        return DataHelper_1.default.handlePromiseRequest(request({
            method: 'POST',
            uri: `${config_1.Config.PROJECT.SERVER.AUTHORIZATION.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.AUTHORIZATION.DOMAIN}` + url,
            body: data,
            json: true
        }));
    }
    static put(url, data) {
        return DataHelper_1.default.handlePromiseRequest(request({
            method: 'PUT',
            uri: `${config_1.Config.PROJECT.SERVER.AUTHORIZATION.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.AUTHORIZATION.DOMAIN}` + url,
            body: data,
            json: true
        }));
    }
    static patch(url, data) {
        return DataHelper_1.default.handlePromiseRequest(request({
            method: 'PATCH',
            uri: `${config_1.Config.PROJECT.SERVER.AUTHORIZATION.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.AUTHORIZATION.DOMAIN}` + url,
            body: data,
            json: true
        }));
    }
    static delete(url) {
        return DataHelper_1.default.handlePromiseRequest(request({
            method: 'DELETE',
            uri: `${config_1.Config.PROJECT.SERVER.AUTHORIZATION.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.AUTHORIZATION.DOMAIN}` + url,
            json: true
        }));
    }
}
AuthorizationHelper.userService = {
    get(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield AuthorizationHelper.get(`/api/user/${_id}`);
        });
    },
    getByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield AuthorizationHelper.get(`/api/user/access-token?token=${token}`);
        });
    },
    getByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield AuthorizationHelper.get(`/api/user/email?email=${email}`);
        });
    },
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield AuthorizationHelper.post(`/api/user`, data);
        });
    },
    delete(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield AuthorizationHelper.delete(`/api/user/${_id}`);
        });
    },
    updateLastAccessUser(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield AuthorizationHelper.post(`/api/user/lastAccess/${_id}`);
        });
    }
};
AuthorizationHelper.permissionService = {
    get(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield AuthorizationHelper.get(`/api/permission/${_id}`);
        });
    },
    getClaimPermissions(productCode, fromRoleCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield AuthorizationHelper.get(`/api/permission/claim-permissions?productCode=${productCode}&fromRoleCode=${fromRoleCode}`);
        });
    },
    getCustomPermissions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield AuthorizationHelper.get(`/api/permission/custom-permissions/${userId}`);
        });
    },
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield AuthorizationHelper.post(`/api/permission`, data);
        });
    },
    update(_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield AuthorizationHelper.put(`/api/permission/${_id}`, data);
        });
    },
    delete(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield AuthorizationHelper.delete(`/api/permission/${_id}`);
        });
    }
};
AuthorizationHelper.systemService = {
    getSytemInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield AuthorizationHelper.get(`/api/system/getAuthorizationInfor`);
        });
    },
};
Object.seal(AuthorizationHelper);
exports.default = AuthorizationHelper;
