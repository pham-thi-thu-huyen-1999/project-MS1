import {Config} from '../config';
import * as moment from 'moment';
import * as request from 'request-promise';
import LogHelper from '../helpers/LogHelper';

const fileName = 'YodleeHelper';

export default class YodleeHelper {
    private static async getAccessToken(): Promise<any> {
        let YODLEE = Config.PROJECT.YODLEE;
        try {
            let result = await request({
                uri: YODLEE.API_BASE + 'cobrand/login',
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                body: {
                    'cobrand': {
                        'cobrandLogin': YODLEE.USERNAME,
                        'cobrandPassword': YODLEE.PASSWORD,
                        'locale': 'en_US'
                    }
                },
                json: true
            });
            return result;
        }
        catch (error) {
            LogHelper.logService.create(error);
        }
    }

    private static async getLoginToken(loginName: string, password: string): Promise<any> {
        let YODLEE = Config.PROJECT.YODLEE;
        const fnName = 'Login Yodlee';
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: `${YODLEE.API_BASE} + 'user/login'`, description: `loging On Yodlee With Login Name : ${loginName}`, status: 1});
        // LogHelper.logInfo(fileName, fnName, `loging On Yodlee With Login Name : ${loginName}`);
        let cobrandToken = await this.getAccessToken();
        let userToken = await request({
            uri: YODLEE.API_BASE + 'user/login',
            headers: {'Content-Type': 'application/json', 'Authorization': `{cobSession=${cobrandToken.session.cobSession}}`},
            method: 'POST',
            body: {
                'user': {
                    'loginName': loginName,
                    'password': password,
                }
            },
            json: true
        });

        return {
            cobrandToken: cobrandToken.session.cobSession,
            userToken: userToken.user.session.userSession
        };
    }

    static async createAccount(userId: string, email: string) {
        const fnName = 'create Account';
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: `${Config.PROJECT.YODLEE.API_BASE} + 'user/register'`, description: `Create Account With UserId: ${userId} - Email:${email}`, status: 1});
        // LogHelper.logInfo(fileName, fnName, `Create Account With UserId: ${userId} - Email:${email}`);
        let cobrandToken = await this.getAccessToken();
        const body = {
            'user': {
                'loginName': 'JustDone_Live_' + userId,
                'password': '@69n@mTech@hungLive!',
                'email': email,
                'preferences': {
                    'currency': 'USD',
                    'timeZone': 'PST',
                    'dateFormat': 'MM/dd/yyyy',
                    'locale': 'en_US'
                }
            }
        };
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: `${Config.PROJECT.YODLEE.API_BASE} + 'user/register'`, description: 'Request Yodlee With Url :' + Config.PROJECT.YODLEE.API_BASE + 'user/register', status: 1});

        // LogHelper.logInfo(fileName, fnName, 'Request Yodlee With Url :' + Config.PROJECT.YODLEE.API_BASE + 'user/register');
        let yodleeAccount = await request({
            uri: Config.PROJECT.YODLEE.API_BASE + 'user/register',
            headers: {'Content-Type': 'application/json', 'Authorization': `{cobSession=${cobrandToken.session.cobSession}}`},
            method: 'POST',
            body: body,
            json: true
        });

        if (yodleeAccount && yodleeAccount.user)
            return 1;
        else
            return 0;
    }

    static async removeBank(loginName: string, password: string, providerAccountId: string) {
        let userToken = await this.getLoginToken(loginName, password);

        return await request({
            uri: Config.PROJECT.YODLEE.API_BASE + 'providerAccounts/' + providerAccountId,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
            },
            method: 'DELETE',
            json: true
        });
    }

    static async addBank(loginName: string, password: string, providerId: string, loginForm: any) {
        let userToken = await this.getLoginToken(loginName, password);
        const fnName = 'Add Bank';
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: Config.PROJECT.YODLEE.API_BASE + 'providerAccounts?providerId=' + providerId, description: 'Add Bank', status: 1});
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: Config.PROJECT.YODLEE.API_BASE + 'providerAccounts?providerId=' + providerId, description: 'Request Yodlee With Url :' + Config.PROJECT.YODLEE.API_BASE + 'providerAccounts?providerId=' + providerId, status: 1});
        // LogHelper.logInfo(fileName, fnName, `Add Bank`);
        // LogHelper.logInfo(fileName, fnName, 'Request Yodlee With Url :' + Config.PROJECT.YODLEE.API_BASE + 'providerAccounts?providerId=' + providerId);
        return request({
            uri: Config.PROJECT.YODLEE.API_BASE + 'providerAccounts?providerId=' + providerId,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
            },
            method: 'POST',
            body: {
                'loginForm': loginForm
            },
            json: true
        });
    }

    static async getProviders(loginName: string, password: string) {
        let YODLEE = Config.PROJECT.YODLEE;
        let userToken = await this.getLoginToken(loginName, password);
        let query = '';
        const fnName = 'Get Provider';
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: YODLEE.API_BASE + 'providers?' + query, description: 'Add Bank', status: 1});

        // LogHelper.logInfo(fileName, fnName, `Get Provider`);

        // if (options) {
        //     query = (typeof options.top != 'undefined' && options.top ? 'top=' + options.top : '500');
        //     query = query + (typeof options.skip != 'undefined' && options.skip ? (query ? '&skip=' : 'skip=') + options.skip : '');
        //     query = query + (typeof options.name != 'undefined' && options.name ? (query ? '&name=' : 'name=') + options.name : '');
        //     query = query + (typeof options.name != 'undefined' && options.name ? (query ? '&id=' : 'id=') + options.id : '');
        // }
        // LogHelper.logInfo(fileName, fnName, 'Request Yodlee With Url :' + YODLEE.API_BASE + 'providers?' + query);
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: YODLEE.API_BASE + 'providers?' + query, description: 'Request Yodlee With Url :' + YODLEE.API_BASE + 'providers?' + query, status: 1});

        return await request({
            uri: YODLEE.API_BASE + 'providers?' + query,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
            },
            method: 'GET',
            json: true
        });
    }

    static async getListProvider(loginName: string, password: string, options) {
        let userToken = await this.getLoginToken(loginName, password);
        let YODLEE = Config.PROJECT.YODLEE;
        let query = '';
        if (options) {
            query = (typeof options.top !== 'undefined' && options.top ? 'top=' + options.top : '500');
            query = query + (typeof options.skip !== 'undefined' && options.skip ? (query ? '&skip=' : 'skip=') + options.skip : '');
            query = query + (typeof options.name !== 'undefined' && options.name ? (query ? '&name=' : 'name=') + options.name : '');
            query = query + (typeof options.name !== 'undefined' && options.name ? (query ? '&id=' : 'id=') + options.id : '');
        }
        return await request({
            uri: YODLEE.API_BASE + 'providers?' + query,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
            },
            method: 'GET',
            json: true
        });
    }

    static async getProviderById(loginName: string, password: string, providerId: string) {
        const fnName = 'Get Provider By Id';
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: Config.PROJECT.YODLEE.API_BASE + 'providers/' + providerId, description: `Get Provider:${providerId}`, status: 1});
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: Config.PROJECT.YODLEE.API_BASE + 'providers/' + providerId, description: 'Request Yodlee With Url :' + Config.PROJECT.YODLEE.API_BASE + 'providers/' + providerId, status: 1});

        // LogHelper.logInfo(fileName, fnName, `Get Provider:${providerId}`);
        // LogHelper.logInfo(fileName, fnName, 'Request Yodlee With Url :' + Config.PROJECT.YODLEE.API_BASE + 'providers/' + providerId);
        let userToken = await this.getLoginToken(loginName, password);
        return await request({
            uri: Config.PROJECT.YODLEE.API_BASE + 'providers/' + providerId,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
            },
            method: 'GET',
            json: true,
        });
    }

    static async getFormLoginBank(loginName: string, password: string, providerId: string) {
        let userToken = await this.getLoginToken(loginName, password);
        const fnName = 'Get Login Form Bank';
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: Config.PROJECT.YODLEE.API_BASE + 'providers/' + providerId, description: `Get Login Form Bank Provider:${providerId}`, status: 1});
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: Config.PROJECT.YODLEE.API_BASE + 'providers/' + providerId, description: 'Request Yodlee With Url :' + Config.PROJECT.YODLEE.API_BASE + 'providers/' + providerId, status: 1});

        // LogHelper.logInfo(fileName, fnName, `Get Login Form Bank Provider:${providerId}`);
        // LogHelper.logInfo(fileName, fnName, 'Request Yodlee With Url :' + Config.PROJECT.YODLEE.API_BASE + 'providers/' + providerId);
        return await request({
            uri: Config.PROJECT.YODLEE.API_BASE + 'providers/' + providerId,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
            },
            method: 'GET',
            json: true
        });
    }

    static async getStatusConnectingBank(loginName: string, password: string, providerAccountId: string) {
        let userToken = await this.getLoginToken(loginName, password);
        const fnName = 'Get Connected Bank Status';
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: Config.PROJECT.YODLEE.API_BASE + 'providerAccounts/' + providerAccountId, description: `Get Connected Bank Status With Account Id:${providerAccountId}`, status: 1});
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: Config.PROJECT.YODLEE.API_BASE + 'providerAccounts/' + providerAccountId, description: 'Request Yodlee With Url :' + Config.PROJECT.YODLEE.API_BASE + 'providerAccounts/' + providerAccountId, status: 1});

        // LogHelper.logInfo(fileName, fnName, `Get Connected Bank Status With Account Id:${providerAccountId}`);
        // LogHelper.logInfo(fileName, fnName, 'Request Yodlee With Url :' + Config.PROJECT.YODLEE.API_BASE + 'providerAccounts/' + providerAccountId);
        return await request({
            uri: Config.PROJECT.YODLEE.API_BASE + 'providerAccounts/' + providerAccountId,
            // proxy: 'http://localhost:3003',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
            },
            method: 'GET',
            json: true
        });
    }

    static async getStatement(loginName: string, password: string, fromDate: any, toDate: any, type: string, accountIdSelected: string, skip: number = 0, timeLoop: number = 0): Promise<any> {
        const fnName = 'Get Transaction';
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: '', description: `Get Transaction With Account Id:${accountIdSelected}`, status: 1});

        // LogHelper.logInfo(fileName, fnName, `Get Transaction With Account Id:${accountIdSelected}`);

        fromDate = moment(fromDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
        toDate = moment(toDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
        console.log('=============> params:', fromDate, toDate, type, accountIdSelected);
        if (fromDate === 'Invalid date' || toDate === 'Invalid date') {
            throw new Error('format day input not true');
        }
        let userToken = await this.getLoginToken(loginName, password);

        let options = {
            accountId: accountIdSelected,
            fromDate: fromDate,
            toDate: toDate,
            type: type,
            skip: skip
        };

        let query = '';
        query = (typeof options.accountId !== 'undefined' && options.accountId ? 'accountId=' + options.accountId : '');
        query = query + (options.fromDate ? (query ? '&fromDate=' : 'fromDate=') + options.fromDate : '');
        query = query + (options.toDate ? (query ? '&toDate=' : 'toDate=') + options.toDate : '');
        query = query + (options.type ? '&container=' + options.type : '');
        query = query + (options.skip ? '&skip=' + options.skip : '');

        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: Config.PROJECT.YODLEE.API_BASE + 'transactions' + (query ? '?' + query : ''), description: 'Request Yodlee With Url :' + Config.PROJECT.YODLEE.API_BASE + 'transactions' + (query ? '?' + query : ''), status: 1});

        // LogHelper.logInfo(fileName, fnName, 'Request Yodlee With Url :' + Config.PROJECT.YODLEE.API_BASE + 'transactions' + (query ? '?' + query : ''));
        let response: any;
        try {
            response = await request({
                uri: Config.PROJECT.YODLEE.API_BASE + 'transactions' + (query ? '?' + query : ''),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
                },
                method: 'GET',
                json: true,
            });
        }
        catch (error) {
            if (timeLoop === 2)
                throw error;

            return await YodleeHelper.getStatement(loginName, password, fromDate, toDate, type, accountIdSelected, skip, timeLoop + 1);
        }

        let transactions = response && response.transaction ? response.transaction : [];

        return transactions;
    }

    static async getPublicKey(timeLoop: number = 0) {
        const fnName = 'Get Public Key';
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: Config.PROJECT.YODLEE.API_BASE + 'cobrand/publicKey', description: `Function Is Geting  Public Key`, status: 1});
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: Config.PROJECT.YODLEE.API_BASE + 'cobrand/publicKey', description: 'Request Yodlee With Url :' + Config.PROJECT.YODLEE.API_BASE + 'cobrand/publicKey', status: 1});

        // LogHelper.logInfo(fileName, fnName, `Function Is Geting  Public Key`);
        // LogHelper.logInfo(fileName, fnName, 'Request Yodlee With Url :' + Config.PROJECT.YODLEE.API_BASE + 'cobrand/publicKey');
        let cobrandToken = await this.getAccessToken();
        let response: any;
        try {
            response = await request({
                uri: Config.PROJECT.YODLEE.API_BASE + 'cobrand/publicKey',
                headers: {'Content-Type': 'application/json', 'Authorization': `{cobSession=${cobrandToken.session.cobSession}}`},
                method: 'GET',
                json: true,
            });
        }
        catch (error) {
            if (timeLoop === 2)
                throw error;

            return await YodleeHelper.getPublicKey(timeLoop + 1);
        }
        return response;
    }

    static async getFormByProviderId(loginName: string, password: string, providerId: string) {
        let userToken = await this.getLoginToken(loginName, password);
        const fnName = 'Get Bank Account';
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: Config.PROJECT.YODLEE.API_BASE + `providerAccounts/${providerId}?include=credentials`, description: `Function Is Geting  Bank Account`, status: 1});

        // LogHelper.logInfo(fileName, fnName, `Function Is Geting  Bank Account`);
        return request({
            uri: Config.PROJECT.YODLEE.API_BASE + `providerAccounts/${providerId}?include=credentials`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
            },
            method: 'GET',
            json: true,
        });
    }

    static async updateBank(loginName: string, password: string, providerAccountId:string, loginForm:any) {
        let userToken = await this.getLoginToken(loginName, password);
        const fnName = 'Add Bank';
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: Config.PROJECT.YODLEE.API_BASE + 'providerAccounts?providerAccountIds=' + providerAccountId, description: `Update Bank`, status: 1});
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: Config.PROJECT.YODLEE.API_BASE + 'providerAccounts?providerAccountIds=' + providerAccountId, description: 'Request Yodlee Method PUT With Url :' + Config.PROJECT.YODLEE.API_BASE + 'providerAccounts?providerId=' + providerAccountId, status: 1});

        // LogHelper.logInfo(fileName, fnName, `Update Bank`);
        // LogHelper.logInfo(fileName, fnName, 'Request Yodlee Method PUT With Url :' + Config.PROJECT.YODLEE.API_BASE + 'providerAccounts?providerId=' + providerAccountId);
        return request({
            uri: Config.PROJECT.YODLEE.API_BASE + 'providerAccounts?providerAccountIds=' + providerAccountId,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
            },
            method: 'PUT',
            body: {
                'loginForm': loginForm
            },
            json: true
        });
    }
    static async getBankAccounts(loginName: string, password: string): Promise<any> {
        let userToken = await this.getLoginToken(loginName, password);
        const fnName = 'Get Bank Account';
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: Config.PROJECT.YODLEE.API_BASE + 'accounts', description: `Function Is Geting  Bank Account`, status: 1});
        LogHelper.logService.create({system: fileName, module: null, method: fnName, path: Config.PROJECT.YODLEE.API_BASE + 'accounts', description: 'Request Yodlee With Url :' + Config.PROJECT.YODLEE.API_BASE + 'accounts', status: 1});

        // LogHelper.logInfo(fileName, fnName, `Function Is Geting  Bank Account`);
        // LogHelper.logInfo(fileName, fnName, 'Request Yodlee With Url :' + Config.PROJECT.YODLEE.API_BASE + 'accounts');
        return request({
            uri: Config.PROJECT.YODLEE.API_BASE + 'accounts',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `{cobSession=${userToken.cobrandToken},userSession=${userToken.userToken}}`
            },
            method: 'GET',
            json: true,
        });
    }
}
