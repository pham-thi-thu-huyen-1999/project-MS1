import {Config} from '../config';
import * as request from 'request-promise';

export default class AddressifyHelper {
    static createUrlFromKeyword(keyword: string, maxResults: number): string {
        return (`${Config.PROJECT.ADDRESSIFY.URL}api_key=${Config.PROJECT.ADDRESSIFY.KEY}&term=${keyword}&max_results=${maxResults}`);
    }

    static formatKeyword(keyword: string): string {
        let arr = keyword.split(' ');
        let result = arr[0];
        for (let i = 1; i < arr.length; i++) {
            result = result + '+' + arr[i];
        }
        return result;
    }

    static async getAddressAutoComplete(keyword: string, maxResults?: number) {
        keyword = this.formatKeyword(keyword);
        let maxRecordNumber = maxResults || 10;
        let url = this.createUrlFromKeyword(keyword, maxRecordNumber);
        return new Promise((resolve, reject) => {
            request({uri: url, method: 'GET', json: true
            }).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            });
        });
    }
}
