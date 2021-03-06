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
class AddressifyHelper {
    static createUrlFromKeyword(keyword, maxResults) {
        return (`${config_1.Config.PROJECT.ADDRESSIFY.URL}api_key=${config_1.Config.PROJECT.ADDRESSIFY.KEY}&term=${keyword}&max_results=${maxResults}`);
    }
    static formatKeyword(keyword) {
        let arr = keyword.split(' ');
        let result = arr[0];
        for (let i = 1; i < arr.length; i++) {
            result = result + '+' + arr[i];
        }
        return result;
    }
    static getAddressAutoComplete(keyword, maxResults) {
        return __awaiter(this, void 0, void 0, function* () {
            keyword = this.formatKeyword(keyword);
            let maxRecordNumber = maxResults || 10;
            let url = this.createUrlFromKeyword(keyword, maxRecordNumber);
            return new Promise((resolve, reject) => {
                request({ uri: url, method: 'GET', json: true
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    }
}
exports.default = AddressifyHelper;
