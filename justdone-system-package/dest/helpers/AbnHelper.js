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
const Error_1 = require("../app/model/common/Error");
const parseString = require('xml2js').parseString;
class AbnHelper {
    static abnLookup(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            let urlLookup = `${config_1.Config.PROJECT.ABN.URL}searchString=${keyword}&includeHistoricalDetails=Y&authenticationGuid=${config_1.Config.PROJECT.ABN.GUID}`;
            let res = yield request({
                uri: urlLookup,
                method: 'GET',
                json: true
            });
            return new Promise((resolve, reject) => {
                parseString(res, { trim: true }, (err, result) => {
                    if (err)
                        reject(err);
                    resolve(result.ABRPayloadSearchResults.response[0]);
                });
            }).catch(err => {
                throw new Error_1.ErrorCommon(101, 'Abn');
            });
        });
    }
    static abnUKLookup(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            let urlLookup = `${config_1.Config.PROJECT.UKABN.URL}search/companies?q=${keyword}&items_per_page=10`;
            const APIKEY = 'Basic ' + Buffer.from(config_1.Config.PROJECT.UKABN.KEY).toString('base64');
            let res = yield request({
                uri: urlLookup,
                method: 'GET',
                headers: {
                    'Authorization': APIKEY
                },
                json: true
            });
            if (!res || !res.items || !res.items.length)
                throw new Error_1.ErrorCommon(101, 'Abn');
            return res.items[0];
        });
    }
}
exports.default = AbnHelper;
