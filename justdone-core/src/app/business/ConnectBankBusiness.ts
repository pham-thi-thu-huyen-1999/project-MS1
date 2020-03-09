import BusinessLoader from '../../system/BusinessLoader';
import IConnectBankBusiness from './interfaces/IConnectBankBusiness'; // eslint-disable-line
import ConnectBankRepository from 'justdone-system-package/dest/app/repository/ConnectBankRepository';
import BankServiceHelper from 'justdone-system-package/dest/helpers/BankServiceHelper';
import ConnectBank from 'justdone-system-package/dest/app/model/connectBank/ConnectBank'; // eslint-disable-line
import ConnectBankCreate from 'justdone-system-package/dest/app/model/connectBank/ConnectBankCreate'; // eslint-disable-line
import ConnectBankUpdate from 'justdone-system-package/dest/app/model/connectBank/ConnectBankUpdate'; // eslint-disable-line
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import {BankType, StatusConnectBank} from 'justdone-system-package/dest/app/model/common/CommonType';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import UserRepository from 'justdone-system-package/dest/app/repository/UserRepository';
// import Authenticator from 'justdone-system-package/dest/system/Authenticator';
// import module from 'justdone-system-package/dest/resources/permission/module';
import AuthorizationHelper from 'justdone-system-package/dest/helpers/AuthorizationHelper';
import * as FlakeIdGen from 'flake-idgen'; // eslint-disable-line
import * as intformat from 'biguint-format'; // eslint-disable-line
import { type } from 'os';
class ConnectBankBusiness implements IConnectBankBusiness {
    private connectBankRepository: ConnectBankRepository;
    private userRepository: UserRepository;

    constructor() {
        this.connectBankRepository = new ConnectBankRepository();
        this.userRepository = new UserRepository();
    }

    async find(userId: string, page: number, limit: number): Promise<ConnectBank[]> {
        if (!userId)
            throw new ErrorCommon(101, 'Request');
        // let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        // if (!products || !products.length)
        //     return [];

        let originUser = await AuthorizationHelper.userService.get(userId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');
        // let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        // if (!originUser || !originUser.permission ||
        //     !products.find(product => product.code === productCode))
        //     return [];

        console.log('params Id =>>>>>>>>>>>>>>.', userId);
        let params = {
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                status: {$ne: StatusConnectBank.NotConnected}
            }
        };
        let order = {createAt: 1};

        let connectBanks = await this.connectBankRepository.find(params, order, page, limit);

        console.log('connectBanks =>>>>>>>>>>>>.', connectBanks);
        if (!connectBanks || connectBanks.length <= 0)
            return [];

        return ConnectBank.parseArray(connectBanks);
    }

    async findAll(userId: string): Promise<ConnectBank[]> {
        if (!userId)
            throw new ErrorCommon(101, 'Request');
        // let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        // if (!products || !products.length)
        //     return [];

        let originUser = await AuthorizationHelper.userService.get(userId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');
        // let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        // if (!originUser || !originUser.permission ||
        //     !products.find(product => product.code === productCode))
        //     return [];
        let params = {
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                accountId: {$ne: null},
                status: {$ne: StatusConnectBank.Connecting},
            }
        };
        let order = {createAt: 1};

        let connectBanks = await this.connectBankRepository.find(params, order);

        if (!connectBanks || connectBanks.length <= 0)
            return [];

        return ConnectBank.parseArray(connectBanks);
    }

    async countConnectBank(userId: string): Promise<number> {
        if (!userId)
            throw new ErrorCommon(101, 'Request');
        // let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        // if (!products || !products.length)
        //     return [];

        let originUser = await AuthorizationHelper.userService.get(userId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');
        // let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        // if (!originUser || !originUser.permission ||
        //     !products.find(product => product.code === productCode))
        //     return [];
        let params = {
            query: <any>{
                userId: DataHelper.toObjectId(userId),
            }
        };

        let count = await this.connectBankRepository.getCount(params);

        return count;
    }

    async get(_id: string): Promise<ConnectBank | null> {
        if (!_id)
            throw new ErrorCommon(101, 'id');
        // let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        // if (!products || !products.length)
        //     return [];

        let connectBank = await this.connectBankRepository.get(_id);

        return connectBank && new ConnectBank(connectBank);
    }

    async getAccountConnectBanks(userId: string, providerAccountId: string, providerId?: string): Promise<ConnectBank[]> {
        if (!userId)
            throw new ErrorCommon(101, 'id');
        if (!providerAccountId)
            throw new ErrorCommon(101, 'providerAccountId');
        // let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        // if (!products || !products.length)
        //     return [];

        let originUser = await AuthorizationHelper.userService.get(userId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');

        // let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        // if (!originUser || !originUser.permission ||
        //     !products.find(product => product.code === productCode))
        //     return [];

        let params = {
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                providerAccountId: providerAccountId,
                accountId: {$ne: null},
            }
        };
        if (providerId)
            params.query.providerId = providerId;

        let connectBank = await this.connectBankRepository.findAll(params);

        return ConnectBank.parseArray(connectBank);
    }

    async checkConnectBank(userId: string, providerAccountId: string, providerId?: string): Promise<ConnectBank | null> {
        if (!userId)
            throw new ErrorCommon(101, 'id');
        if (!providerAccountId)
            throw new ErrorCommon(101, 'providerAccountId');
        // let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        // if (!products || !products.length)
        //     return [];

        let originUser = await AuthorizationHelper.userService.get(userId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');

        // let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        // if (!originUser || !originUser.permission ||
        //     !products.find(product => product.code === productCode))
        //     return [];

        let params = {
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                providerAccountId: providerAccountId,
                accountId: null,
            }
        };
        if (providerId)
            params.query.providerId = providerId;

        let connectBank = await this.connectBankRepository.findOne(params);

        return connectBank && new ConnectBank(connectBank);
    }

    async checkConnectBankUserOld(userId: string, providerAccountId: string, providerId?: string): Promise<any> {
        if (!userId)
            throw new ErrorCommon(101, 'id');
        if (!providerAccountId)
            throw new ErrorCommon(101, 'providerAccountId');

        let originUser = await AuthorizationHelper.userService.get(userId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');

        let connectBank = originUser.connectedBanks.filter((bank) => {
            return (Number(bank.providerId) === Number(providerAccountId) && Number(bank.bankId) === Number(providerId))
        })

        return connectBank[0];
    }

    async getConnectBank(userId: string, _id: string): Promise<ConnectBank | null> {
        if (!userId)
            throw new ErrorCommon(101, 'Request');
        if (!_id)
            throw new ErrorCommon(101, 'id');
        // let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        // if (!products || !products.length)
        //     return [];

        let originUser = await AuthorizationHelper.userService.get(userId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');
        // let productCode = originUser && originUser.permission && originUser.permission.prleaoduct && originUser.permission.product.code;
        // if (!originUser || !originUser.permission ||
        //     !products.find(product => product.code === productCode))
        //     return [];
        let params = {
            query: <any>{
                _id: DataHelper.toObjectId(_id),
                userId: DataHelper.toObjectId(userId),
            }
        };

        let connectBank = await this.connectBankRepository.findOne(params);

        return connectBank && new ConnectBank(connectBank);
    }

    async getConnectBankByAccountId(userId: string, accountId: string, excludeId?: string): Promise<ConnectBank | null> {
        if (!userId)
            throw new ErrorCommon(101, 'Request');
        if (!accountId)
            throw new ErrorCommon(101, 'id');
        // let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        // if (!products || !products.length)
        //     return [];

        let originUser = await AuthorizationHelper.userService.get(userId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');
        // let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        // if (!originUser || !originUser.permission ||
        //     !products.find(product => product.code === productCode))
        //     return [];
        let params = {
            query: <any>{
                accountId: accountId,
                userId: DataHelper.toObjectId(userId),
            }
        };
        if (excludeId)
            params.query._id = {$ne: DataHelper.toObjectId(excludeId)};
        let connectBank = await this.connectBankRepository.findOne(params);

        return connectBank && new ConnectBank(connectBank);
    }

    async checkConnectBankByAccountIds(userId: string, accountIds: string[]): Promise<ConnectBank[]> {
        if (!userId)
            throw new ErrorCommon(101, 'userId');
        if (!accountIds.length)
            throw new ErrorCommon(101, 'accountIds');
        // let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        // if (!products || !products.length)
        //     return [];

        let originUser = await AuthorizationHelper.userService.get(userId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');
        // let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        // if (!originUser || !originUser.permission ||
        //     !products.find(product => product.code === productCode))
        //     return [];
        let params = {
            query: <any>{
                accountId: {$in: accountIds},
                userId: DataHelper.toObjectId(userId),
            }
        };

        let connectBank = await this.connectBankRepository.find(params);

        return ConnectBank.parseArray(connectBank);
    }

    async getConnectBankByUserIds(originId: string, userIds: string[]): Promise<ConnectBank[]> {
        if (!userIds.length)
            throw new ErrorCommon(101, 'accountIds');
        if (!originId)
            throw new ErrorCommon(101, 'originId');
        // let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        // if (!products || !products.length)
        //     return [];

        let originUser = await AuthorizationHelper.userService.get(originId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');

        // let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        // if (!originUser || !originUser.permission ||
        //     !products.find(product => product.code === productCode))s
        //     return [];
        let params = {
            query: <any>{
                userId: {$in: userIds.map(item => {
                    DataHelper.toObjectId(item);
                })},
                status: StatusConnectBank.Connected
            }
        };

        let connectBank = await this.connectBankRepository.find(params);

        return ConnectBank.parseArray(connectBank);
    }

    async getConnectBankByProviderAccountId(userId: string, providerAccountId: string): Promise<ConnectBank | null> {
        if (!userId)
            throw new ErrorCommon(101, 'Request');
        if (!providerAccountId)
            throw new ErrorCommon(101, 'Provider Account Id');
        // let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        // if (!products || !products.length)
        //     return [];

        let originUser = await AuthorizationHelper.userService.get(userId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');

        // let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        // if (!originUser || !originUser.permission ||
        //     !products.find(product => product.code === productCode))
        //     return [];
        let params = {
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                providerAccountId: providerAccountId
            }
        };

        let connectBank = await this.connectBankRepository.findOne(params);

        return connectBank && new ConnectBank(connectBank);
    }

    async createConnectBank(originId: string, data: ConnectBankCreate): Promise<ConnectBank> {
        if (!originId)
            throw new ErrorCommon(101, 'originId');
        if (!data)
            throw new ErrorCommon(101, 'data');
        if (!data.userId)
            throw new ErrorCommon(105, "UserId")

        // let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        // if (!products || !products.length)
        //     return [];

        let originUser = await AuthorizationHelper.userService.get(originId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');
        // data.userId = userId;

        // let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        // if (!originUser || !originUser.permission ||
        //     !products.find(product => product.code === productCode))
        //     return [];
        let connectBankByAccount = await this.getConnectBankByAccountId(data.userId, String(data.accountId));
        if (connectBankByAccount)
            throw new ErrorCommon(101, 'connectBankByAccount');

        let connectBank = await this.connectBankRepository.create(data);
        let accountId;
        let type;
        if (connectBank) {
            accountId = connectBank.accountId;
            type = connectBank.type;
        }
        else {
            throw new ErrorCommon(113, "Create connect bank");
        }
        
        await BusinessLoader.transactionBusiness.createEmptyStatement(originId, data.userId, accountId, type, 2016, 6, 0);

        return connectBank && new ConnectBank(connectBank);
    }

    async createConnectBankMultiple(data: any[]): Promise<any> {
        if(!data.length)
            throw new ErrorCommon(101, 'data length');
        await this.connectBankRepository.createMultiple(data);
        return true;
    }

    async addAcountsConnectBank(userId: string, connectBankId: string, body: any): Promise<any> {
        if (!userId)
            throw new ErrorCommon(101, 'userId');
        if (!connectBankId)
            throw new ErrorCommon(101, 'connectBankId');
        if (!body)
            throw new ErrorCommon(101, 'data');
        if (!body.accounts.length)
            throw new ErrorCommon(101, 'data length');
        
        let data;
        // slice account number if have > 24
        let dataAll = body.accounts;
        let dataAccount;
        let dataSlice;
        if (dataAll.length > 24) {
            dataAccount = dataAll.slice(0,24);
            dataSlice = dataAll.slice(24);
            data = dataAccount;
        }
        else {
            data = dataAll;
        }
        
        // let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        // if (!products || !products.length)
        //     return [];

        let originUser = await AuthorizationHelper.userService.get(userId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');
        // let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        // if (!originUser || !originUser.permission ||
        //     !products.find(product => product.code === productCode))
        //     return [];

        let connectBank = await this.getConnectBank(userId, connectBankId);
        if (!connectBank || !connectBank.providerAccountId || !connectBank.providerId)
            throw new ErrorCommon(101, 'connectBank');
        if (connectBank.refreshinfo && connectBank.refreshinfo.statusMessage !== 'OK')
            throw new ErrorCommon(102, 'connectBank');
        if (connectBank.status !== StatusConnectBank.Connected)
            throw new ErrorCommon(102, 'StatusConnectBank');
        if (!connectBank.accounts || !connectBank.accounts.length)
            throw new ErrorCommon(102, 'connectBank.accounts.length');

        for (let j = 0; j < data.length; j++) {
            let item = data[j];

            if (Number(item.providerId) !== Number(connectBank.providerId) || Number(item.providerAccountId) !== Number(connectBank.providerAccountId))
                throw new ErrorCommon(101, 'providerAccountId and providerId');

            if (item.refreshinfo && item.refreshinfo.statusMessage !== 'OK')
                throw new ErrorCommon(102, 'connectBank');

            let existInConnectBankAccount = connectBank.accounts.map(x => x.id).indexOf(item.id);
            if (existInConnectBankAccount === -1)
                throw new ErrorCommon(101, 'existInConnectBankAccount');

            let existConnectBank = await this.getConnectBankByAccountId(userId, String(item.id));
            if (existConnectBank)
                throw new ErrorCommon(101, 'exist AccountId');
        }

        for (let x = 0; x < data.length; x++) {
            let item = data[x];
            if (x === 0) {
                let updateConnectBank = await this.updateConnectBank(userId, connectBankId, {
                    providerAccountId: item.providerAccountId,
                    providerId: item.providerId,
                    refreshinfo: {
                        lastRefreshed: item.refreshinfo.lastRefreshed,
                        nextRefreshScheduled: item.refreshinfo.nextRefreshScheduled,
                        lastRefreshAttempt: item.refreshinfo.lastRefreshAttempt,
                        statusMessage: item.refreshinfo.statusMessage,
                        statusCode: item.refreshinfo.statusCode
                    },
                    type: item.CONTAINER === 'bank' ? BankType.Bank : BankType.CreditCard,
                    accountId: item.id,
                    accountStatus: item.accountStatus,
                    accountNumber: item.accountNumber ? item.accountNumber : '',
                    accountName: item.accountName,
                    currentBalance: item.balance && item.balance.amount ? item.balance.amount : 0,
                    // balance: item.balance && item.balance.amount,
                    getTransactionAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
                    accounts: [],
                    status: StatusConnectBank.Connected
                });
                if (updateConnectBank.error)
                    throw new ErrorCommon(101, 'update connect bank');
                
            }
            else {
                let createConnectBank = await this.createConnectBank(userId, {
                    userId: userId,
                    providerAccountId: item.providerAccountId,
                    providerId: item.providerId,
                    providerName: item.providerName,
                    refreshinfo: {
                        lastRefreshed: item.refreshinfo.lastRefreshed,
                        nextRefreshScheduled: item.refreshinfo.nextRefreshScheduled,
                        lastRefreshAttempt: item.refreshinfo.lastRefreshAttempt,
                        statusMessage: item.refreshinfo.statusMessage,
                        statusCode: item.refreshinfo.statusCode
                    },
                    type: item.CONTAINER === 'bank' ? BankType.Bank : BankType.CreditCard,
                    accountId: item.id,
                    accountStatus: item.accountStatus,
                    accountNumber: item.accountNumber ? item.accountNumber : '',
                    accountName: item.accountName,
                    currentBalance: item.balance && item.balance.amount ? item.balance.amount : 0,
                    // balance: item.balance.amount,
                    favicon: connectBank.favicon,
                    status: StatusConnectBank.Connected,
                    getTransactionAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                });
                let accountId;
                let type;
                if (createConnectBank) {
                    accountId = createConnectBank.accountId ? createConnectBank.accountId.toString() : '';
                    type = Number(createConnectBank.type);
                }
                if (!createConnectBank)
                    throw new ErrorCommon(101, 'create connect bank');
                await BusinessLoader.transactionBusiness.createEmptyStatement(originUser._id,createConnectBank.userId, accountId, type, 2016, 7, 0);
            }
        }

        let accountNotConnect = connectBank.accounts.filter((item: any) => {
            return !data.find((element: any) => {
                return element.id === item.id;
            });
        });
        if (accountNotConnect.length > 0) {
            let accounts = accountNotConnect.map((item: any) => item.id);
            let checkConnectBank = await this.checkConnectBankByAccountIds(userId, accounts);
            if (checkConnectBank.length > 0)
                throw new ErrorCommon(101, 'connect bank');
            for (let i = 0; i < accountNotConnect.length; i++) {
                let item = accountNotConnect[i];
                let createConnectBank = await this.createConnectBank(userId, {
                    userId: userId,
                    providerAccountId: item.providerAccountId,
                    providerId: item.providerId,
                    providerName: item.providerName,
                    refreshinfo: {
                        lastRefreshed: item.refreshinfo.lastRefreshed,
                        nextRefreshScheduled: item.refreshinfo.nextRefreshScheduled,
                        lastRefreshAttempt: item.refreshinfo.lastRefreshAttempt,
                        statusMessage: item.refreshinfo.statusMessage,
                        statusCode: Number(item.refreshinfo.statusCode)
                    },
                    type: item.CONTAINER === 'bank' ? BankType.Bank : BankType.CreditCard,
                    accountId: item.id,
                    accountStatus: item.accountStatus,
                    accountNumber: item.accountNumber ? item.accountNumber : '',
                    accountName: item.accountName,
                    currentBalance: item.balance && item.balance.amount ? item.balance.amount : 0,
                    // balance: item.balance.amount,
                    favicon: connectBank.favicon,
                    status: StatusConnectBank.NotConnected
                });
                let accountId;
                let type;
                if (createConnectBank) {
                    accountId = createConnectBank.accountId ? createConnectBank.accountId.toString() : '';
                    type = Number(createConnectBank.type);
                }
                if (!createConnectBank)
                    throw new ErrorCommon(101, 'create connect bank');

                await BusinessLoader.transactionBusiness.createEmptyStatement(originUser._id,createConnectBank.userId, accountId, type, 2016, 7, 0);
            }
        }

        let loadTrans = await BusinessLoader.yodleeBusiness.loadTransactionAndSave(userId, connectBank.providerAccountId);
        if (!loadTrans)
            throw new ErrorCommon(102, 'Load trans');
        
        if (dataSlice.length > 0) {
            body.accounts = dataSlice;
            await this.addAcountsConnectBank(userId, connectBankId, body);
        }
        return true;
    }

    async create(data: ConnectBankCreate): Promise<ConnectBank> {
        if (!data)
            throw new ErrorCommon(101, 'data');

        let connectBank = await this.connectBankRepository.create(data);

        return connectBank && new ConnectBank(connectBank);
    }

    async createConnectBankByUserEmail(email: string): Promise<boolean> {
        let user = await BusinessLoader.userBusiness.getByEmail(email);
        if (!user)
            throw new ErrorCommon(101, 'user');
        let arrConnect = user.connectedBanks;
        let resultCreate = await this.helperCreateByEmail(user._id, arrConnect);
        if (!resultCreate)
            return false;
        return true;
    }

    async createManualNumberAccount(originId:string, data: any): Promise<any> {
        if (!data)
            throw new ErrorCommon(105, "data");
        if (!originId)
            throw new ErrorCommon(101, 'originId');

        let originUser = await AuthorizationHelper.userService.get(originId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');

        console.log(data);

        let generator = new FlakeIdGen();
        let id = generator.next();
        let hashedId = intformat(id, 'dec', {padstr:'0', size:6}).slice(10);
        let providerIdFake = hashedId + Math.floor(Math.random() * 10) - Math.floor(Math.random() * 5) + Math.floor(Math.random() * 6);

        let dataCreate = {
            refreshinfo: {
                statusMessage: "OK",
                statusCode: 0
            },
            status: 2,
            type: data.account.type,
            accountId: hashedId.toString(),
            accountStatus: "ACTIVE",
            accountNumber: data.account.accountNumber.toString(),
            accountName: data.account.accountName,
            favicon: data.provider.favicon,
            userId: data.userId,
            providerAccountId: providerIdFake.toString(),
            providerId: data.provider.bankId.toString(),
            providerName: data.provider.name,
            isManual: true
        }

        let result = await this.createConnectBank(originId, dataCreate);

        if (!result)
            throw new ErrorCommon(113, "Create connect bank");

        return result;
    }

    async helperCreateByEmail(userId: string, data: any): Promise<boolean> {
        for (let i = 0; i < data.length; i++) {
            let connectBank = await this.getConnectBankByAccountId(userId, data[i].accounts[0].id);
            if (!connectBank) {
                if (!data[i].accounts || !data[i].accounts.length)
                    throw new ErrorCommon(103, 'accounts');
                let dataCreate = {
                    userId: userId,
                    type: data[i].type,
                    providerId: data[i].providerId,
                    providerName: data[i].accounts[0].providerName,
                    providerAccountId: data[i].accounts[0].providerAccountId,
                    refreshinfo: data[i].accounts[0].refreshinfo,
                    accountId: data[i].accounts[0].id,
                    accountStatus: data[i].accounts[0].accountStatus,
                    accountNumber: data[i].accounts[0].accountNumber,
                    accountName: data[i].accounts[0].accountName,
                    currentBalance: data[i].currentBalance,
                    balance: data[i].accounts[0].balance.amount,
                    accounts: data[i].accounts,
                    status: 2,
                    isDisabled: false,
                    favicon: 'https://i.imgur.com/GP3JSk1.png',
                    getTransactionAt: data[i].accounts[0].createdDate
                }
                let newConnectBank = await this.create(dataCreate);
                if (!newConnectBank)
                    throw new ErrorCommon(103, 'connectBank');
            }
        }
        return true;
    }

    async refreshAccounts(userId: string, providerAccountId: string, providerId: string): Promise<any> {
        if (userId)
            throw new ErrorCommon(101, 'userId');
        if (providerAccountId)
            throw new ErrorCommon(101, 'providerAccountId');
        if (providerId)
            throw new ErrorCommon(101, 'providerId');

        let bankAccounts = await BankServiceHelper.getBankAccounts(userId);
        let accounts = bankAccounts.account ? bankAccounts.account : [];

        accounts = accounts.filter((account: any) => {
            return (account.providerAccountId.toString() === providerAccountId.toString() && account.providerId.toString() === providerId.toString());
        });

        let accountConnectBank = await this.getAccountConnectBanks(userId, providerAccountId, providerId);
        let accountNotConnect = accounts.filter((data: any) => {
            return !accountConnectBank.find(element => {
                return element.accountId === data.id;
            });
        });

        let bank = await BankServiceHelper.getProviderById(userId, providerId);
        if (bank.error || !bank)
            throw new ErrorCommon(102, 'bank');

        for (let i = 0; i < accountNotConnect.length; i++) {
            let item = accountNotConnect[i];
            let createConnectBank = await this.createConnectBank(userId, {
                userId: userId,
                providerAccountId: providerAccountId,
                providerId: providerId,
                providerName: bank.provider[0].name,
                refreshinfo: {
                    lastRefreshed: item.refreshinfo.lastRefreshed,
                    nextRefreshScheduled: item.refreshinfo.nextRefreshScheduled,
                    lastRefreshAttempt: item.refreshinfo.lastRefreshAttempt,
                    statusMessage: item.refreshinfo.statusMessage,
                    statusCode: item.refreshinfo.statusCode
                },
                type: item.CONTAINER === 'bank' ? BankType.Bank : BankType.CreditCard,
                accountId: item.id,
                accountStatus: item.accountStatus,
                accountNumber: item.accountNumber ? item.accountNumber : '',
                accountName: item.accountName,
                currentBalance: item.balance.amount,
                // balance: item.balance.amount,
                favicon: bank.provider[0].favicon,
                status: StatusConnectBank.NotConnected
            });
            if (!createConnectBank)
                throw new ErrorCommon(101, 'create connect bank');
        }

        return true;
    }

    async activeConnectBank(userId: string, connectBankId: string): Promise<any> {
        if (!userId)
            throw new ErrorCommon(101, 'userId');
        if (!connectBankId)
            throw new ErrorCommon(101, 'connectBankId');

        let connectBank = await BusinessLoader.connectBankBusiness.get(connectBankId);

        if (!connectBank)
            throw new ErrorCommon(101, 'connectBank');

        let updateConnectBank = await this.updateConnectBank(connectBank.userId, connectBank._id, {
            status: StatusConnectBank.Connected,
            providerId: connectBank.providerId,
            providerAccountId: connectBank.providerAccountId,
            getTransactionAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        });
        if (!updateConnectBank)
            throw new ErrorCommon(101, 'update ConnectBank');

        BusinessLoader.yodleeBusiness.loadTransactionAndSaveWithConnectBank(connectBank.userId, connectBankId);

        return true;
    }

    async updateConnectBank(userId: string, _id: string, data: ConnectBankUpdate): Promise<any | null> {
        if (!userId)
            throw new ErrorCommon(101, 'userId');
        if (!_id)
            throw new ErrorCommon(101, '_id');
        if (!data)
            throw new ErrorCommon(101, 'data');

        // let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        // if (!products || !products.length)
        //     return [];

        let originUser = await AuthorizationHelper.userService.get(userId);
        if (!originUser)
            throw new ErrorCommon(101, 'originUser');
        // let productCode = origstatusinUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        // if (!originUser || !orstatusiginUser.permission ||
        //     !products.find(prostatusduct => product.code === productCode))
        //     return [];

        let connectBank = await this.getConnectBank(userId, _id);
        if (!connectBank)
            throw new ErrorCommon(101, 'connectBank');
        if (Number(connectBank.providerId) !== Number(data.providerId))
            throw new ErrorCommon(101, 'providerId');
        if (Number(connectBank.providerAccountId) !== Number(data.providerAccountId))
            throw new ErrorCommon(101, 'providerAccountId');

        if (data.type)
            connectBank.type = data.type;

        if (data.refreshinfo && connectBank.refreshinfo) {
            connectBank.refreshinfo.lastRefreshed = data.refreshinfo.lastRefreshed;
            connectBank.refreshinfo.nextRefreshScheduled = data.refreshinfo.nextRefreshScheduled;
            connectBank.refreshinfo.lastRefreshAttempt = data.refreshinfo.lastRefreshAttempt;
            connectBank.refreshinfo.statusMessage = data.refreshinfo.statusMessage;
            connectBank.refreshinfo.statusCode = data.refreshinfo.statusCode;
        }

        if (data.accountId) {
            let connectBankByAccount = await this.getConnectBankByAccountId(userId, String(data.accountId), _id);
            if (connectBankByAccount)
                throw new ErrorCommon(101, 'connectBankByAccount');
            connectBank.accountId = data.accountId;
        }

        if (data.accountStatus)
            connectBank.accountStatus = data.accountStatus;
        if (data.accountNumber)
            connectBank.accountNumber = data.accountNumber;
        if (data.accountName)
            connectBank.accountName = data.accountName;
        if (data.currentBalance)
            connectBank.currentBalance = Number(data.currentBalance);
        if (data.balance)
            connectBank.balance = Number(data.balance);
        if (data.status)
            connectBank.status = data.status;
        if (data.accounts)
            connectBank.accounts = data.accounts;
        if (data.disabledPullTransaction)
            connectBank.disabledPullTransaction = data.disabledPullTransaction;
        if (data.isDisabled)
            connectBank.isDisabled = data.isDisabled;
        if (data.getTransactionAt)
            connectBank.getTransactionAt = data.getTransactionAt;

        await this.connectBankRepository.update(_id, connectBank);

        return true;
    }

    async update(_id: string, data: any): Promise<any | null> {
        await this.connectBankRepository.update(_id, data);
        return true;
    }

    async deleteAccountManual(_id: string): Promise<any> {
        if (!_id)
            throw new ErrorCommon(101, '_id');

        let connectBank = await this.connectBankRepository.get(_id);
        if (!connectBank)
            throw new ErrorCommon(101, 'connectBank');

        return await this.connectBankRepository.delete(_id, true);
    }

    async delete(_id: string): Promise<boolean> {
        if (!_id)
            throw new ErrorCommon(101, '_id');
        let connectBank = await this.connectBankRepository.get(_id);
        if (!connectBank)
            throw new ErrorCommon(101, 'connectBank');

        return await this.connectBankRepository.delete(_id, true);
    }
}

Object.seal(ConnectBankBusiness);
export default ConnectBankBusiness;
