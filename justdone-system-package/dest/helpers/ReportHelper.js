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
const fs = require("fs");
const request = require("request-promise");
const config_1 = require("../config");
class ReportHelper {
    static writeLoga(message) {
        fs.appendFile('../../logs.txt', (new Date()).toLocaleString() + ' : ' + message + '\n', 'utf8', err => console.error(err));
    }
    static writeLog(req, err) {
        return __awaiter(this, void 0, void 0, function* () {
            let ip = req.header['x-forwarded-for'] || req.connection.remoteAddress;
            let data = {
                ipAddress: ip ? ip.split(':').pop() : '',
                productCode: 1,
                url: req.originalUrl,
                method: req.method,
                content: JSON.stringify(req.body),
                description: JSON.stringify(err),
                status: err ? 2 : 1,
                device: req.headers['user-agent']
            };
            try {
                return yield request({
                    uri: `${config_1.Config.PROJECT.SERVER.REPORT.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.REPORT.DOMAIN}/api/log`,
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: data,
                    json: true
                });
            }
            catch (error) {
                throw new Error('Cannot write log!!');
            }
        });
    }
    static getSytemInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield request({
                uri: `${config_1.Config.PROJECT.SERVER.REPORT.PROTOTYPE}://${config_1.Config.PROJECT.SERVER.REPORT.DOMAIN}/api/system/get-report-infor`,
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
exports.default = ReportHelper;
