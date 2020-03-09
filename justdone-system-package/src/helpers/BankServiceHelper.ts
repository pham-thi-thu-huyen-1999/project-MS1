import {Config} from '../config';
import * as request from 'request-promise';
import {ErrorYodlee} from '../app/model/common/Error';

export default class BankServiceHelper {
    static async createAccount(userId: string, email: string) {
        const body = {
            userId: userId,
            email: email
        };
        try {
            let yodleeAccount = await request({
                uri: `${Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee`,
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                body: body,
                json: true
            });
            return yodleeAccount;
        }
        catch (error) {
            throw new ErrorYodlee(3);
        }
    }

    static async removeBank(userId: string, providerAccountId: string) {
        // let userToken = await this.getLoginToken(userId);

        // return await request({
        //     uri: Config.PROJECT.YODLEE.API_BASE + 'providerAccounts/' + providerAccountId,
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
        //     },
        //     method: 'DELETE',
        //     json: true
        // });
        return 'ahihi da remove';
    }

    static async addBank(userId: string, providerId: string, loginForm: any) {
        let res = await request({
            uri: `${Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/add-bank`,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: {
                'userId': userId,
                'providerId': providerId,
                'loginForm': loginForm
            },
            json: true
        });
        return res.data;
    }

    static async updateBank(userId: string, providerId: string, loginForm: any) {
        let res = await request({
            uri: `${Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/update-bank`,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PUT',
            body: {
                'userId': userId,
                'providerId': providerId,
                'loginForm': loginForm
            },
            json: true
        });
        return res.data;
    }

    static async getProviders(userId: string) {
        let res = await request({
            uri: `${Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/providers/${userId}`,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
            json: true
        });
        return res.data;
    }

    static async getFormLoginBankByProviderAccountId(userId, providerId) {
        try {
            let res = await request({
                uri: `${Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/form-credential/${userId}/${providerId}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET',
                json: true
            });
            return res.data.loginForm;
        }
        catch (error) {
            console.log(error);
            throw new ErrorYodlee(4);
        }
    }

    static async getFormLoginBank(userId: string, providerId: string) {
        try {
            let res = await request({
                uri: `${Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/form-login-bank/${userId}/${providerId}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET',
                json: true
            });
            console.log(res.data);
            return res.data.provider[0];
        }
        catch (error) {
            console.log(error);
            throw new ErrorYodlee(4);
        }
    }
    static async getProviderById(userId: string, providerId: string) {
        let res = await request({
            uri: `${Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/providers/${userId}/${providerId}`,
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
            uri: `${Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/connecting-bank-status/${userId}/${providerAccountId}`,
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
            uri: `${Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/bank-accounts/${userId}`,
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
            uri: `${Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/statement/${userId}/${selectAccountId}/${type}`,
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
            uri: `${Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/public-key`,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
            json: true
        });
        return res.data;
    }

    static async getSytemInfo() {
        let res = await request({
            uri: `${Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/system/get-bank-infor`,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
            json: true
        });
        return res.data;
    }

    static async updateOpenBalanceStatement(data: any): Promise<any> {
        let res = await request({
            uri: `${Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/update-openbalance-multi-bank`,
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
            method: 'PUT',
            json: true
        });
        return res.data;
    }

    static async getStransactionByMonth(data: any): Promise<any> {
        let res = await request({
            uri: `${Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/transaction/get-transaction-by-month`,
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
            method: 'POST',
            json: true
        });
        return res.data;
    }

    static async calcTransactionByClosing(data: any): Promise<any> {
        let res = await request({
            uri: `${Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/yodlee/calc-trans-by-closing`,
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
            method: 'POST',
            json: true
        });
        return res.data;
    }

    static async updateStatement(data: any): Promise<any> {
        let res = await request({
            uri: `${Config.PROJECT.SERVER.BANK_SERVICE.PROTOTYPE}://${Config.PROJECT.SERVER.BANK_SERVICE.DOMAIN}/api/statement/update-statement-manual`,
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
            method: 'PUT',
            json: true
        });
        return res.data;
    }
}
