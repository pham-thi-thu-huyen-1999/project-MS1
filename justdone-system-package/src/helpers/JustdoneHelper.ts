import {Config} from '../config';
import * as request from 'request-promise';
import {ErrorYodlee} from '../app/model/common/Error';
const URL = 'https://app.justdone.com.au';

export default class JustdoneHelper {
    static async login() {
        const body = {
            email: 'admin@justdone.com.au',
            password: 'thenatives123@'
        };
        try {
            let token = await request({
                uri: `${URL}/auth/login`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic YWRtaW5AanVzdGRvbmUuY29tLmF1OnRoZW5hdGl2ZXMxMjNA'
                },
                method: 'POST',
                body: body,
                json: true
            });
            return token;
        }
        catch (error) {
            console.log(error);
            throw new ErrorYodlee(3);
        }
    }

    static async getCrunch(token: string, email: string, day: string, type: string) {
        let res = await request({
            uri: `${URL}/api/crunch-tool/${email}/${day}/${type}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            method: 'GET',
            json: true
        }).catch(err => {
            console.log(err);
        });
        return res;
    }

    static async getProviders(userId: string) {
        let res = await request({
            uri: `${Config.PROJECT.SERVER.INTEGRATION.PROTOTYPE}://${Config.PROJECT.SERVER.INTEGRATION.DOMAIN}/api/yodlee/providers/${userId}`,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
            json: true
        });
        return res.data;
    }

    static async getFormLoginBank(userId: string, providerId: string) {
        try {
            let res = await request({
                uri: `${Config.PROJECT.SERVER.INTEGRATION.PROTOTYPE}://${Config.PROJECT.SERVER.INTEGRATION.DOMAIN}/api/yodlee/form-login-bank/${userId}/${providerId}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET',
                json: true
            });
            return res.data.provider[0].loginForm;
        }
        catch (error) {
            console.log(error);
            throw new ErrorYodlee(4);
        }
    }
    static async getProviderById(userId: string, providerId: string) {
        let res = await request({
            uri: `${Config.PROJECT.SERVER.INTEGRATION.PROTOTYPE}://${Config.PROJECT.SERVER.INTEGRATION.DOMAIN}/api/yodlee/providers/${userId}/${providerId}`,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
            json: true
        });
        return res.data;
    }

    static async getStatusConnectingBank(userId: string, providerAccountId: string) {
        let res = await request({
            uri: `${Config.PROJECT.SERVER.INTEGRATION.PROTOTYPE}://${Config.PROJECT.SERVER.INTEGRATION.DOMAIN}/api/yodlee/connecting-bank-status/${userId}/${providerAccountId}`,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
            json: true
        });
        return res.data;
    }

    static async getBankAccounts(userId: string) {
        let res = await request({
            uri: `${Config.PROJECT.SERVER.INTEGRATION.PROTOTYPE}://${Config.PROJECT.SERVER.INTEGRATION.DOMAIN}/api/yodlee/bank-accounts/${userId}`,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
            json: true
        });
        return res.data;
    }

    static async getStatement(userId: string, selectAccountId: string, type: string): Promise<any> {
        let res = await request({
            uri: `${Config.PROJECT.SERVER.INTEGRATION.PROTOTYPE}://${Config.PROJECT.SERVER.INTEGRATION.DOMAIN}/api/yodlee/statement/${userId}/${selectAccountId}/${type}`,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
            json: true
        });
        return res.data;
    }

    static async getPublicKey() {
        let res = await request({
            uri: `${Config.PROJECT.SERVER.INTEGRATION.PROTOTYPE}://${Config.PROJECT.SERVER.INTEGRATION.DOMAIN}/api/yodlee/public-key`,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
            json: true
        });
        return res.data;
    }
}
