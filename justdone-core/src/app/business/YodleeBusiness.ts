import * as _ from 'lodash';
import * as crypto from 'crypto';
import * as escapere from 'escape-regexp';
import User from 'justdone-system-package/dest/app/model/user/User'; // eslint-disable-line
import BankServiceHelper from 'justdone-system-package/dest/helpers/BankServiceHelper';
import Provider from 'justdone-system-package/dest/app/model/provider/Provider'; // eslint-disable-line
import Statement from 'justdone-system-package/dest/app/model/statement/Statement'; // eslint-disable-line
import BankLoginForm from 'justdone-system-package/dest/app/model/bankLoginForm/BankLoginForm'; // eslint-disable-line
import {BankType, StatusConnectBank} from 'justdone-system-package/dest/app/model/common/CommonType';
import ProviderRepository from 'justdone-system-package/dest/app/repository/ProviderRepository';
import BusinessLoader from '../../system/BusinessLoader';
import IYodleeBusiness from './interfaces/IYodleeBusiness'; // eslint-disable-line
import {ErrorCommon, ErrorYodlee} from 'justdone-system-package/dest/app/model/common/Error';
import ProviderCreate from 'justdone-system-package/dest/app/model/provider/ProviderCreate';// eslint-disable-line
import Project from '../../config/Project';

class YodleeBusiness implements IYodleeBusiness {
    private providerRepository: ProviderRepository;

    constructor() {
        this.providerRepository = new ProviderRepository();
    }

    async getProviders(page: number, limit: number, searchTerm?: string): Promise<any> {
        if (!page || !limit)
            throw new ErrorCommon(3);

        let param = {
            query: <any>{}
        };
        if (searchTerm)
            param.query.name = {$regex: new RegExp('.*' + escapere(searchTerm) + '.*', 'i')};

        let banks = await this.providerRepository.find(param, {name: 1}, page, limit);
        return Provider.parseArray(banks);
    }

    async getProvidersByBankIds(bankIds: number[]): Promise<any> {
        if (!bankIds.length)
            return [];

        let param = {
            query: <any>{
                bankId: {$in: bankIds}
            }
        };

        let banks = await this.providerRepository.findAll(param);
        return Provider.parseArray(banks);
    }

    async createProviders(providers: ProviderCreate[]): Promise<boolean> {
        this.providerRepository.createMultiple(providers);// not wait
        return true;
    }

    async isProvidersExist(name: string, bankId: number): Promise<boolean> {
        let provider = await this.providerRepository.find({
            query: {
                name: name,
                bankId: bankId
            }
        });
        return (provider && Array.isArray(provider) && provider.length !== 0) ? true : false;
    }

    async getFormLoginBank(userId: string, providerId: string): Promise<any> {
        /**
         * remove cache form login because yodlee maybe change formlogin
         */
        let userDB = await BusinessLoader.userBusiness.get(userId);
        if (!userDB) {
            throw new ErrorCommon(102, 'User');
        }
        let yodleeAccount = userDB.yodleeAccount;
        if (!yodleeAccount || !yodleeAccount.user || !yodleeAccount.password || yodleeAccount.user === '' || yodleeAccount.password === '')
            await this.createAccount(userId, userDB.email);
        let form = await BankServiceHelper.getFormLoginBank(userId, providerId);

        let bankLoginForm = {
            providerId: providerId,
            loginForm: form.loginForm,
            logo: form.logo,
            bankName: form.name,
            languageISOCode: form.languageISOCode,
            countryISOCode: form.countryISOCode,
        };
        let row = bankLoginForm.loginForm.row;
        if (row.length === 0)
            throw new ErrorYodlee(4);
        bankLoginForm.loginForm.row = row.map(item => {
            let temp = _.pick(item, ['label', 'field']);
            return temp;
        });

        return bankLoginForm;
    }

    /**
     * Check Status Connect Bank
     */
    async getStatusConnectingBank(userId: string, providerAccountId: string): Promise<any> {
        let connectBankStatus = await BankServiceHelper.getStatusConnectingBank(userId, providerAccountId);
        return connectBankStatus;
    }

    /**
     * Add Bank Account To Yodlee
     */
    async addBank(userId: string, providerId: string, loginForm: any): Promise<any> {
        let userDB = await BusinessLoader.userBusiness.get(userId);
        if (!userDB)
            throw new ErrorCommon(102, 'User');
        this.checkYodlee(userId, providerId, loginForm);
        let addBank = await BankServiceHelper.addBank(userId, providerId, loginForm);
        let connectBankExist = await BusinessLoader.connectBankBusiness.getAccountConnectBanks(userId, addBank.providerAccount.id, providerId);
        if (connectBankExist.length > 0)
            throw new ErrorCommon(102, 'connectBank');
        let checkConnectBankExist = await BusinessLoader.connectBankBusiness.checkConnectBank(userId, addBank.providerAccount.id, providerId);
        if (checkConnectBankExist)
            addBank.connectBank = checkConnectBankExist;
        else {
            let bank = await BankServiceHelper.getProviderById(userId, providerId);
            if (bank.error || !bank)
                throw new ErrorCommon(102, 'bank');
            let createConnectBank = await BusinessLoader.connectBankBusiness.createConnectBank(userId, {
                userId: userId,
                providerAccountId: String(addBank.providerAccount.id),
                providerId: String(providerId),
                providerName: bank.provider[0].name,
                favicon: bank.provider[0].favicon,
                status: StatusConnectBank.Connecting
            });
            if (!createConnectBank)
                throw new ErrorCommon(102, 'Create Connect Bank');
            addBank.connectBank = createConnectBank;
        }


        // let connectedBanks: Array<any> = userDB.connectedBanks ? userDB.connectedBanks : [];
        // let indexConnected = _.findIndex(connectedBanks, (item) => {
        //     return item.type === type;
        // });
        // let connectBank;
        // if (indexConnected === -1)
        //     connectBank = {
        //         type: type,
        //         providerId: addBank.providerAccount.id ? addBank.providerAccount.id : '',
        //         connectedId: '',
        //         connectedName: '',
        //         bankId: providerId,
        //         currentBalance: 0
        //     };
        // else
        //     connectBank = {
        //         type: connectedBanks[indexConnected].type,
        //         providerId: addBank.providerAccount.id ? addBank.providerAccount.id : '',
        //         connectedId: connectedBanks[indexConnected] ? connectedBanks[indexConnected].connectedId : '',
        //         connectedName: connectedBanks[indexConnected] ? connectedBanks[indexConnected].connectedName : '',
        //         bankId: connectedBanks[indexConnected] ? connectedBanks[indexConnected].bankId : '',
        //         currentBalance: 0
        //     };

        // if (connectBank)
        //     await BusinessLoader.userBusiness.updateConnectedBanks(userId, connectBank);
        return addBank;
    }

    async createAccount(userId: string, email: string): Promise<any> {
        let yodleeAccount = await BankServiceHelper.createAccount(userId, email);
        if (yodleeAccount.data)
            await BusinessLoader.userBusiness.updateYodleeAccount(userId);
        return yodleeAccount;
    }

    /**
     * Remove Bank To Yodlee
     */
    async removeBank(userId: string, providerAccountId: string): Promise<any> {
        let removeBank = await BankServiceHelper.removeBank(userId, providerAccountId);
        return removeBank;
    }

    async getFormUpdateUserOld(userId: string, providerId: string, bankId: string): Promise<any> {
        let accounts = await this.getBankAccounts(userId, providerId, bankId, true);
        accounts = accounts.account;
        if (!accounts || accounts.length === 0)
            throw new ErrorCommon(102, 'Account Bank');
        let providerIdCheck = accounts[0].providerId;
        if (!providerIdCheck)
            throw new ErrorCommon(102, 'Provider Id');
        return this.getFormLoginBank(userId, providerIdCheck);
    }

    async getFormUpdatebank(userId: string, type: number) {
        // can sua lai =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        let accounts = await this.getBankAccounts(userId, '1', '2');
        accounts = accounts.account;
        if (!accounts || accounts.length === 0)
            throw new ErrorCommon(102, 'Account Bank');
        let providerId = accounts[0].providerId;
        if (!providerId)
            throw new ErrorCommon(102, 'Provider Id');
        return this.getFormLoginBank(userId, providerId);
    }

    async updateBank(userId: string, type: number, loginForm: any) {
        let userDB = await BusinessLoader.userBusiness.get(userId);
        if (!userDB) {
            throw new ErrorCommon(102, 'User');
        }
        // can sua lai
        let accounts = await this.getBankAccounts(userId, '1', '2');
        accounts = accounts.account;

        if (!accounts || accounts.length === 0)
            throw new ErrorCommon(102, 'Account Bank');

        let providerAccountId = accounts[0].providerAccountId;

        if (!providerAccountId)
            throw new ErrorCommon(102, 'Provider Account Id');

        let updateBank = await BankServiceHelper.updateBank(userId, providerAccountId, loginForm);
        return updateBank;
    }

    async removeReconectBank(userId:string, type:number) {
        let userDB = await BusinessLoader.userBusiness.get(userId);
        if (!userDB) {
            throw new ErrorCommon(102, 'User');
        }
        let connectedBanks: Array<any> = userDB.connectedBanks ? userDB.connectedBanks : [];
        let indexConnected = _.findIndex(connectedBanks, (item) => {
            return item.type === type;
        });
        let connectBank;
        if (indexConnected !== -1) {
            connectBank = connectedBanks[indexConnected];
        }
        if (connectBank)
            await BusinessLoader.userBusiness.updateConnectedBanks(userId, connectBank);
        return true;
    }

    async getBankAccounts(userId: string, providerAccountId: string, providerId: string, old?: boolean): Promise<any> {
        if (!userId)
            throw new ErrorCommon(102, 'userId');
        if (!providerAccountId)
            throw new ErrorCommon(102, 'providerAccountId');
        if (!providerId)
            throw new ErrorCommon(102, 'providerId');

        // let typeBank = type === BankType.Bank ? 'bank' : 'creditCard';
        let userDB = await BusinessLoader.userBusiness.get(userId);
        if (!userDB)
            throw new ErrorCommon(102, 'User');

        let connectBank;

        if (old)
            connectBank = await BusinessLoader.connectBankBusiness.checkConnectBankUserOld(userId, providerAccountId, providerId);
        else
            connectBank = await BusinessLoader.connectBankBusiness.checkConnectBank(userId, providerAccountId, providerId);

        if (!old) {
            if (!connectBank)
                throw new ErrorCommon(102, 'connectBank');
            if (connectBank.providerAccountId !== providerAccountId || connectBank.providerId !== providerId)
                throw new ErrorCommon(102, 'providerAccountId and providerId');
            if (connectBank.status !== StatusConnectBank.Connected)
                throw new ErrorCommon(102, 'connectBank status');
            if (connectBank.refreshinfo && connectBank.refreshinfo.statusMessage !== 'OK')
                throw new ErrorCommon(102, 'connectBank');
        }

        let accounts: any;
        // let indexConnected = -1;
        // for (let index = 0; index < connectedBanks.length; index++) {
        //     if (connectedBanks[index].type === type) {
        //         accounts = connectedBanks[index].accounts;
        //         indexConnected = index;
        //         providerAccountId = connectedBanks[index].providerId ? connectedBanks[index].providerId : '';
        //         break;
        //     }
        // }
        if (connectBank && connectBank.accounts.length > 0)
            return {account: connectBank.accounts};
        else {
            // let arrayAccount: any = [];
            let bankAccounts = await BankServiceHelper.getBankAccounts(userId);
            accounts = bankAccounts.account ? bankAccounts.account : [];
            accounts = accounts.filter((account) => {
                return (account.providerAccountId.toString() === providerAccountId.toString() && account.providerId.toString() === providerId.toString());
            });
            // for (let i = 0; i < accounts.length; i++) {
            //     let account = await BusinessLoader.connectBankBusiness.getConnectBankByAccountId(userId, String(accounts[i].id));
            //     if (!account)
            //         arrayAccount.push(accounts[i]);
            // }

            let bankAccountUpdate = {
                providerId: providerId,
                providerAccountId: providerAccountId,
                accounts: accounts
            };
            await BusinessLoader.connectBankBusiness.updateConnectBank(userId, connectBank._id, bankAccountUpdate);
            return {account: accounts};
        }
    }

    async updateCurentBalance(userId: string, type: number) {
        // if (!BankType[type]) {
        //     throw new ErrorCommon(102, 'Type bank');
        // }
        // let user = await BusinessLoader.userBusiness.get(userId);
        // if (!user) {
        //     throw new ErrorCommon(102, 'User');
        // }
        // let connectedBanks: Array<any> = user.connectedBanks ? user.connectedBanks : [];
        // let indexConnected = _.findIndex(connectedBanks, (item) => {
        //     return item.type === type;
        // });
        // if (indexConnected !== -1) {
        //     let connectedBank = connectedBanks[indexConnected];
        //     // can sua lai
        //     let bankAccounts = await this.getBankAccounts(userId, '1', '2');
        //     let typeBank = connectedBank.type === BankType.Bank ? 'bank' : 'creditCard';
        //     bankAccounts.account = bankAccounts.account ? bankAccounts.account : [];
        //     bankAccounts.account = bankAccounts.account.filter((account) => {
        //         return account.connectedId === connectedBank.connectedId && account.CONTAINER === typeBank;
        //     });
        //     if (bankAccounts.account.length !== 0) {
        //         let blance = bankAccounts.account[0].balance ? bankAccounts.account[0].balance.amount : 0;
        //         BusinessLoader.userBusiness.updateConnectedBanks(userId, {
        //             currentBlance: blance,
        //             type: connectedBank.type,
        //             providerId: connectedBank.providerId ? connectedBank.providerId : '',
        //             connectedId: connectedBank.connectedId ? connectedBank.connectedId : '',
        //             connectedName: connectedBank.connectedName ? connectedBank.connectedName : '',
        //             bankId: connectedBank.bankId ? connectedBank.bankId : ''
        //         });
        //     }
        // }
    }

    async loadTransactionAndSave(userId: string, providerAccountId: string): Promise<any> {
        if (!userId)
            throw new ErrorCommon(102, 'userId');
        if (!providerAccountId)
            throw new ErrorCommon(102, 'providerAccountId');

        let userDB = await BusinessLoader.userBusiness.get(userId);
        if (!userDB)
            throw new ErrorCommon(102, 'User');

        let connectedBanks = await BusinessLoader.connectBankBusiness.getAccountConnectBanks(userId, providerAccountId);
        if (!connectedBanks.length)
            throw new ErrorYodlee(5);

        let bankAccounts = await BankServiceHelper.getBankAccounts(userId);
        let accounts = bankAccounts.account ? bankAccounts.account : [];

        for (let i = 0; i < connectedBanks.length; i++) {
            let item = connectedBanks[i];
            if (item.status === StatusConnectBank.Connected && !item.disabledPullTransaction && !item.isDisabled) {
                if (!item.providerId || !item.providerAccountId || !item.type || !item.accountId || !item.accountName)
                    throw new ErrorCommon(101, 'data');
                let existInConnectBankAccount = accounts.map((x: any) => x.id).indexOf(Number(item.accountId));
                if (existInConnectBankAccount === -1)
                    throw new ErrorCommon(101, 'existInConnectBankAccount');
                let type = item.type === BankType.Bank ? 'bank' : item.type === BankType.CreditCard ? 'creditCard' : 'Manual';
                if (accounts[existInConnectBankAccount].CONTAINER !== type)
                    throw new ErrorCommon(101, 'type');
                await BankServiceHelper.getStatement(userId, String(item.accountId), String(item.type));
            }
        }

        return true;
    }

    async loadTransactionAndSaveWithConnectBank(userId: string, connectBankId: string): Promise<any> {
        if (!userId)
            throw new ErrorCommon(102, 'userId');
        if (!connectBankId)
            throw new ErrorCommon(102, 'connectBankId');

        let userDB = await BusinessLoader.userBusiness.get(userId);
        if (!userDB)
            throw new ErrorCommon(102, 'User');
        let connectedBank = await BusinessLoader.connectBankBusiness.getConnectBank(userId, connectBankId);
        if (!connectedBank)
            throw new ErrorYodlee(5);
        if (connectedBank.status !== StatusConnectBank.Connected)
            throw new ErrorYodlee(102, 'StatusConnectBank');
        if (connectedBank.disabledPullTransaction)
            throw new ErrorYodlee(102, 'disabledPullTransaction');
        if (connectedBank.isDisabled)
            throw new ErrorYodlee(102, 'isDisabled');

        let bankAccounts = await BankServiceHelper.getBankAccounts(userId);
        let accounts = bankAccounts.account ? bankAccounts.account : [];
        if (!connectedBank.providerId || !connectedBank.providerAccountId || !connectedBank.type || !connectedBank.accountId || !connectedBank.accountName)
            throw new ErrorCommon(101, 'data');
        let existInConnectBankAccount = accounts.map((x: any) => x.id).indexOf(Number(connectedBank.accountId));
        if (existInConnectBankAccount === -1)
            throw new ErrorCommon(101, 'existInConnectBankAccount');
        let type = connectedBank.type === BankType.Bank ? 'bank' : connectedBank.type === BankType.CreditCard ? 'creditCard' : 'Manual';
        if (accounts[existInConnectBankAccount].CONTAINER !== type)
            throw new ErrorCommon(101, 'type');
        await BankServiceHelper.getStatement(userId, String(connectedBank.accountId), String(connectedBank.type));

        return true;
    }

    async getPublicKey(): Promise<any> {
        return await BankServiceHelper.getPublicKey();
    }

    async yodleeValidateData(userId: string, track: any, mtp: number): Promise<any> {
        return await BusinessLoader.userBusiness.yodleeValidateData(userId, track, mtp);
    }

    private checkYodlee(userId, providerId, data) {
        if (!data && !data.row && !Array.isArray(data.row))
            return;
        data.row.forEach(element => {
            if (element && element.label) {
                if (Array.isArray(element.field)) {
                    element.field.forEach(item => {
                        if (item.id) {

                        }
                    });
                }
            }
        });
    }

    private checkField(text) {
        try {
            let userKey = Project.ARAGON;
            let buffer = new Buffer(text);
            let encrypted = crypto.publicEncrypt(userKey, buffer);
            return encrypted.toString('base64');
        }
        catch (error) {
            return 'can not check';
        }
    }
}

Object.seal(YodleeBusiness);
export default YodleeBusiness;
