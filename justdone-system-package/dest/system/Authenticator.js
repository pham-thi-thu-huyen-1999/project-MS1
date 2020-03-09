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
const express = require("express");
const AuthorizationHelper_1 = require("../helpers/AuthorizationHelper");
class Authenticator {
    constructor() {
        this.app = express();
        this.app.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let userAuth;
                let token = req.headers['authorization'];
                if (token && token.length === 128) {
                    userAuth = yield AuthorizationHelper_1.default.userService.getByToken(token).catch(error => {
                        console.log('Authenticator.middleware\n', error);
                        return Promise.resolve(null);
                    });
                }
                req[Authenticator.userKey] = userAuth || null;
            }
            catch (err) {
                console.error(err.message);
            }
            next();
        }));
    }
    getConfig() {
        return this.app;
    }
    static accessDenied(res) {
        res.status(403);
        res.send({ error: { message: 'Access denied!' } });
    }
    static setTimeoutRequestAPI() {
        Authenticator.timeOut = 0;
        let countTimeOut = setInterval(() => {
            Authenticator.timeOut = Authenticator.timeOut + 1;
            if (Authenticator.timeOut === 10) {
                clearInterval(countTimeOut);
            }
        }, 1000);
    }
    static isAuthenticated(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req[Authenticator.userKey]) {
                let targetUser = yield AuthorizationHelper_1.default.userService.get(req[Authenticator.userKey]._id).catch(error => {
                    return Promise.resolve(null);
                });
                let dateNowMilisec = new Date().getTime();
                let userLastAccessMilisec = targetUser && targetUser.lastAccess ? new Date(targetUser.lastAccess).getTime() : new Date().getTime();
                if (dateNowMilisec - userLastAccessMilisec >= 60000) {
                    yield AuthorizationHelper_1.default.userService.updateLastAccessUser(req[Authenticator.userKey]._id).catch(error => {
                        console.log('Authenticator last access\n', error);
                    });
                }
                next();
            }
            else {
                res.status(401);
                res.send({ error: { message: 'Unauthorized' } });
            }
        });
    }
    static authenticate(productCode, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (productCode && email && password) {
                let data = {
                    productCode,
                    email,
                    password
                };
                return yield AuthorizationHelper_1.default.post(`/api/user/authenticate`, data).catch(error => {
                    console.log('Authenticator.authenticate\n', error);
                    return Promise.resolve(null);
                });
            }
            return null;
        });
    }
    static removeAuthenticator(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId)
                return false;
            return yield AuthorizationHelper_1.default.delete(`/api/user/${userId}`).catch(error => {
                console.log('Authenticator.removeAuthenticator\n', error);
                return Promise.resolve(false);
            });
        });
    }
    static checkPermission(claimCode, productCode, fromRoleCode, targetId) {
        return __awaiter(this, void 0, void 0, function* () {
            let toRole;
            if (targetId) {
                let targetUser = yield AuthorizationHelper_1.default.userService.get(targetId).catch(error => {
                    console.log('Authenticator.checkPermission\n', error);
                    return Promise.resolve(null);
                });
                if (!targetUser)
                    return false;
                toRole = targetUser.permission && targetUser.permission.role;
                if (!toRole || !toRole.code)
                    return false;
            }
            let data = {
                product: productCode,
                claim: claimCode,
                fromRole: fromRoleCode,
            };
            if (toRole)
                data.toRole = toRole.code === fromRoleCode ? null : toRole.code;
            return yield AuthorizationHelper_1.default.post(`/api/permission/check-permission`, data).catch(error => {
                console.log('Authenticator.checkPermission\n', error);
                return Promise.resolve(false);
            });
        });
    }
    static filterProductCodesPermission(claimCodes, fromRoleCodes, toRoleCodes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!claimCodes || !claimCodes.length || !fromRoleCodes || !fromRoleCodes.length)
                return [];
            return yield AuthorizationHelper_1.default.get(`/api/permission/product-codes-permission?claimCodes=${claimCodes.join(',')}&fromRoleCodes=${fromRoleCodes.join(',')}&toRoleCodes=${toRoleCodes ? toRoleCodes.join(',') : ''}`).catch(error => {
                console.log('Authenticator.filterProductCodesPermission\n', error);
                return Promise.resolve([]);
            });
        });
    }
    static filterRoleCodesPermission(claimCodes, productCodes, fromRoleCodes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!claimCodes || !claimCodes.length || !productCodes || !productCodes.length || !fromRoleCodes || !fromRoleCodes.length)
                return [];
            return yield AuthorizationHelper_1.default.get(`/api/permission/role-codes-permission?claimCodes=${claimCodes.join(',')}&productCodes=${productCodes.join(',')}&fromRoleCodes=${fromRoleCodes.join(',')}`).catch(error => {
                console.log('Authenticator.filterRoleCodesPermission\n', error);
                return Promise.resolve([]);
            });
        });
    }
    static filterProductsPermission(claimCodes, originId, productCodes, toRoleCodes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!claimCodes || !claimCodes.length || !originId)
                return [];
            let originUser = yield AuthorizationHelper_1.default.userService.get(originId).catch(error => {
                console.log('Authenticator.filterProductsPermission.1\n', error);
                return Promise.resolve(null);
            });
            if (!originUser)
                return [];
            let fromRole = originUser.permission && originUser.permission.role;
            if (!fromRole || !fromRole.code)
                return [];
            let productCodesPermission = yield Authenticator.filterProductCodesPermission(claimCodes, [fromRole.code], toRoleCodes);
            if (productCodes && productCodes.length)
                productCodesPermission = productCodesPermission.filter(productCode => productCodes.find(code => code === productCode));
            if (!productCodesPermission || !productCodesPermission.length)
                return [];
            return yield AuthorizationHelper_1.default.get(`/api/product/codes?codes=${productCodesPermission.join(',')}`).catch(error => {
                console.log('Authenticator.filterProductsPermission.2\n', error);
                return Promise.resolve([]);
            });
        });
    }
    static filterPermission(claimCodes, originId, productCodes, toRoleCodes) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = { products: [], roles: [] };
            if (!claimCodes || !claimCodes.length || !originId)
                return result;
            let originUser = yield AuthorizationHelper_1.default.userService.get(originId).catch(error => {
                console.log('Authenticator.filterPermission.1\n', error);
                return Promise.resolve(null);
            });
            ;
            if (!originUser)
                return result;
            let fromRole = originUser.permission && originUser.permission.role;
            if (!fromRole || !fromRole.code)
                return result;
            let productCodesPermission = yield Authenticator.filterProductCodesPermission(claimCodes, [fromRole.code], toRoleCodes);
            if (productCodes && productCodes.length)
                productCodesPermission = productCodesPermission.filter(productCode => productCodes.find(code => code === productCode));
            if (!productCodesPermission || !productCodesPermission.length)
                return result;
            let roleCodesPermission = yield Authenticator.filterRoleCodesPermission(claimCodes, productCodesPermission, [fromRole.code]);
            if (toRoleCodes && toRoleCodes.length)
                roleCodesPermission = roleCodesPermission.filter(roleCode => toRoleCodes.find(code => code === roleCode));
            result.products = yield AuthorizationHelper_1.default.get(`/api/product/codes?codes=${productCodesPermission.join(',')}`).catch(error => {
                console.log('Authenticator.filterPermission.2\n', error);
                return Promise.resolve([]);
            });
            if (roleCodesPermission && roleCodesPermission.length) {
                result.roles = yield AuthorizationHelper_1.default.get(`/api/role/codes?codes=${roleCodesPermission.join(',')}`).catch(error => {
                    console.log('Authenticator.filterPermission.3\n', error);
                    return Promise.resolve([]);
                });
            }
            return result;
        });
    }
}
Authenticator.userKey = 'authUser';
Authenticator.lastAPI = 0;
Authenticator.lastAccess = new Date();
Authenticator.timeOut = 0;
Authenticator.invalid = false;
Object.seal(Authenticator);
exports.default = Authenticator;
