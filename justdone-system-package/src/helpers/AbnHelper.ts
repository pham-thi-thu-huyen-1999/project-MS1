import * as request from 'request-promise';
import {Config} from '../config';
import {ErrorCommon} from '../app/model/common/Error';
const parseString = require('xml2js').parseString;

export default class AbnHelper {
    static async abnLookup(keyword: string): Promise<any> {
        let urlLookup = `${Config.PROJECT.ABN.URL}searchString=${keyword}&includeHistoricalDetails=Y&authenticationGuid=${Config.PROJECT.ABN.GUID}`;

        let res = await request({
            uri: urlLookup,
            method: 'GET',
            json: true
        });

        return new Promise((resolve, reject) => {
            parseString(res, {trim: true}, (err, result) => {
                if (err)
                    reject(err);
                resolve(result.ABRPayloadSearchResults.response[0]);
            });
        }).catch(err => {
            throw new ErrorCommon(101, 'Abn');
        });
    }

    static async abnUKLookup(keyword: string): Promise<any> {
        let urlLookup = `${Config.PROJECT.UKABN.URL}search/companies?q=${keyword}&items_per_page=10`;
        const APIKEY = 'Basic ' + Buffer.from(Config.PROJECT.UKABN.KEY).toString('base64');
        let res = await request({
            uri: urlLookup,
            method: 'GET',
            headers: {
                'Authorization': APIKEY
            },
            json: true
        });

        if (!res || !res.items || !res.items.length)
            throw new ErrorCommon(101, 'Abn');
        return res.items[0];
    }
}
