import * as fs from 'fs';
import * as request from 'request-promise';
import {Config} from '../config';

export default class ReportHelper {
    static writeLoga(message: string) {
        fs.appendFile('../../logs.txt', (new Date()).toLocaleString() + ' : ' + message + '\n', 'utf8', err => console.error(err));
    }

    static async writeLog(req, err: any): Promise<any> {
        let ip = req.header['x-forwarded-for'] || req.connection.remoteAddress;
        let data = {
            ipAddress: ip ? ip.split(':').pop() : '',
            // userId: DataHelper.toObjectId(''),
            productCode: 1,
            url: req.originalUrl,
            method: req.method,
            content: JSON.stringify(req.body),
            description: JSON.stringify(err),
            status: err ? 2 : 1,
            device: req.headers['user-agent']
        };
        try {
            return await request({
                uri: `${Config.PROJECT.SERVER.REPORT.PROTOTYPE}://${Config.PROJECT.SERVER.REPORT.DOMAIN}/api/log`,
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                body: data,
                json: true
            });
        }
        catch (error) {
            throw new Error('Cannot write log!!');
        }
    }

    static async getSytemInfo() {
        let res = await request({
            uri: `${Config.PROJECT.SERVER.REPORT.PROTOTYPE}://${Config.PROJECT.SERVER.REPORT.DOMAIN}/api/system/get-report-infor`,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
            json: true
        });
        return res.data;
    }
}
