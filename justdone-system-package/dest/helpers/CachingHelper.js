"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise");
const config_1 = require("../config");
const DataHelper_1 = require("./DataHelper");
class CachingHelper {
    static get(url) {
        return DataHelper_1.default.handlePromiseRequest(request({
            method: 'GET',
            uri: `http://${config_1.Config.PROJECT.DOMAIN}:${config_1.Config.PROJECT.PORT_CACHING}/api/caching` + url,
            json: true
        }));
    }
    static post(url, data) {
        return DataHelper_1.default.handlePromiseRequest(request({
            method: 'POST',
            uri: `http://${config_1.Config.PROJECT.DOMAIN}:${config_1.Config.PROJECT.PORT_CACHING}/api/caching` + url,
            body: data,
            json: true
        }));
    }
    static put(url, data) {
        return DataHelper_1.default.handlePromiseRequest(request({
            method: 'PUT',
            uri: `http://${config_1.Config.PROJECT.DOMAIN}:${config_1.Config.PROJECT.PORT_CACHING}/api/caching` + url,
            body: data,
            json: true
        }));
    }
    static patch(url, data) {
        return DataHelper_1.default.handlePromiseRequest(request({
            method: 'PATCH',
            uri: `http://${config_1.Config.PROJECT.DOMAIN}:${config_1.Config.PROJECT.PORT_CACHING}/api/caching` + url,
            body: data,
            json: true
        }));
    }
    static delete(url) {
        return DataHelper_1.default.handlePromiseRequest(request({
            method: 'DELETE',
            uri: `http://${config_1.Config.PROJECT.DOMAIN}:${config_1.Config.PROJECT.PORT_CACHING}/api/caching` + url,
            json: true
        }));
    }
}
Object.seal(CachingHelper);
exports.default = CachingHelper;
