"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const SendInBlue = require("sendinblue-api");
const emailExistence = require("email-existence");
const config_1 = require("../config");
class MailHelper {
    static sendMailAdvanced(fromData, toData, subject, html) {
        return new Promise((resolve, reject) => {
            if (!toData || !subject || !html)
                reject(false);
            if (!fromData || !fromData.email || !fromData.name)
                fromData = {
                    email: config_1.Config.PROJECT.SENDINBLUE.SENDER.EMAIL,
                    name: config_1.Config.PROJECT.SENDINBLUE.SENDER.NAME
                };
            let data = {
                from: [`${fromData.email.trim().toLowerCase()}`, `${fromData.name}`],
                to: toData,
                subject,
                html
            };
            let sendInBlueClient = new SendInBlue({ 'apiKey': config_1.Config.PROJECT.SENDINBLUE.API_KEY, 'timeout': 10000 });
            sendInBlueClient.send_email(data, (err, response) => {
                if (err)
                    reject(false);
                else
                    resolve(true);
            });
        });
    }
    static loadMailTemplate(path, param) {
        let content = fs.readFileSync(path, 'utf8');
        if (param) {
            Object.keys(param).forEach(key => {
                content = content.replace(new RegExp(`{{${key}}}`, 'g'), param[key]);
            });
        }
        return content;
    }
    static checkRealEmail(email) {
        return new Promise((resolve, reject) => {
            emailExistence.check(email, (error, response) => {
                if (error) {
                    console.error(error);
                    resolve(false);
                }
                resolve(response);
            });
        });
    }
}
Object.seal(MailHelper);
exports.default = MailHelper;
