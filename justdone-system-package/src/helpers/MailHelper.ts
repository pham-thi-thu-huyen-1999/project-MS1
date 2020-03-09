import * as fs from 'fs';
import * as SendInBlue from 'sendinblue-api';
import * as emailExistence from 'email-existence';
import {Config} from '../config';

class MailHelper {
    static sendMailAdvanced(fromData: any, toData: any, subject: string, html: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!toData || !subject || !html)
                reject(false);
            if (!fromData || !fromData.email || !fromData.name)
                fromData = {
                    email: Config.PROJECT.SENDINBLUE.SENDER.EMAIL,
                    name: Config.PROJECT.SENDINBLUE.SENDER.NAME
                };
            let data = {
                from: [`${fromData.email.trim().toLowerCase()}`, `${fromData.name}`],
                to: toData,
                subject,
                html
            };

            let sendInBlueClient = new SendInBlue({'apiKey': Config.PROJECT.SENDINBLUE.API_KEY, 'timeout': 10000});
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

    static checkRealEmail(email: string): Promise<boolean> {
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
export default MailHelper;
