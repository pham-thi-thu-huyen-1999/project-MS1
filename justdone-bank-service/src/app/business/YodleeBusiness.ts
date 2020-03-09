import * as moment from 'moment';
import * as _ from 'lodash';
import * as path from 'path';
import BusinessLoader from '../../system/BusinessLoader';
import IYodleeBusiness from './interfaces/IYodleeBusiness'; // eslint-disable-line
import YodleeHelper from 'justdone-system-package/dest/helpers/YodleeHelper';
import IStatement from 'justdone-system-package/dest/app/model/statement/interfaces/IStatement';
import StatementCreate from 'justdone-system-package/dest/app/model/statement/StatementCreate';
import CrunchCreate from 'justdone-system-package/dest/app/model/crunch/CrunchCreate';
import {BankType, LogStatus, LogAction, LogModule} from 'justdone-system-package/dest/app/model/common/CommonType';
import LogCreate from 'justdone-system-package/dest/app/model/log/LogCreate';
import TransactionCreate from 'justdone-system-package/dest/app/model/transaction/TransactionCreate';
import ProviderRepository from 'justdone-system-package/dest/app/repository/ProviderRepository';
import UserRepository from 'justdone-system-package/dest/app/repository/UserRepository';
import UserConnectedBank from 'justdone-system-package/dest/app/model/user/UserConnectedBank';// eslint-disable-line
import ConnectedBank from 'justdone-system-package/dest/app/model/connectBank/ConnectBank';// eslint-disable-line
import LogHelper from 'justdone-system-package/dest/helpers/LogHelper';
import Project from '../../config/Project'; // eslint-disable-line
import MailHelper from 'justdone-system-package/dest/helpers/MailHelper'; // eslint-disable-line
import FileHelper from 'justdone-system-package/dest/helpers/FileHelper'; // eslint-disable-line
const fileName = 'YodleeBusiness';

class YodleeBusiness implements IYodleeBusiness {
    private providerRepository: ProviderRepository;
    private userRepository: UserRepository;

    constructor() {
        this.providerRepository = new ProviderRepository();
        this.userRepository = new UserRepository();
    }

    async getProviders(userId: string) {
        const fnName = 'Get Provider ';
        LogHelper.logInfo(fileName, fnName, `Get Provider With User Id : ${userId}`);
        let yodleeAccount = await BusinessLoader.userBusiness.getYodleeAccountByUserId(userId);
        let providers = await YodleeHelper.getProviders(yodleeAccount.user, yodleeAccount.password);
        console.log('providers by yl =>>>>>>>>>>>>>>>>', providers);
        return providers;
    }

    async getListProvider(userId: string, skip) {
        let yodleeAccount = await BusinessLoader.userBusiness.getYodleeAccountByUserId(userId);
        let data = await YodleeHelper.getListProvider(yodleeAccount.user, yodleeAccount.password, {skip: skip});
        console.log('data getListProvider =>>>>>>>>>>>>>', data);
        let listbank = data.provider ? data.provider : [];
        if (listbank.length === 0)
            return [];
        listbank = listbank.map(bank => {
            bank.bankId = bank.id;
            return bank = _.pick(bank, ['bankId', 'logo', 'favicon', 'baseUrl', 'loginUrl', 'name', 'countryISOCode', 'languageISOCode']);
        });
        this.providerRepository.create(listbank);
        return listbank;
    }

    async getAllProviders(userId: string) {
        this.getBank(userId, 0);
    }

    async updateBank(userId: string, providerAccountId: string, loginForm: any) {
        const fnName = 'Add Bank';
        LogHelper.logInfo(fileName, fnName, `Adding Bank With User Id : ${userId} - ProviderId:${providerAccountId}`);
        let yodleeAccount = await BusinessLoader.userBusiness.getYodleeAccountByUserId(userId);
        let updateBank = await YodleeHelper.updateBank(yodleeAccount.user, yodleeAccount.password, providerAccountId, loginForm);
        if (updateBank && updateBank.providerAccount && updateBank.refreshInfo) {
            let refreshInfo = updateBank.providerAccount.refreshInfo;
            if (refreshInfo.status === 'FAILED') {
                let log = new LogCreate(<any>{
                    module: LogModule.Yodlee,
                    userId: userId,
                    description: 'add bank error with providerId : ' + providerAccountId,
                    detail: updateBank,
                    status: LogStatus.Error,
                    action: LogAction.AddBank
                });
                BusinessLoader.logBusiness.create(log).catch(err => {
                    console.log(err);
                });
            }
            if (refreshInfo.status === 'SUCCESS') {
                let log = new LogCreate(<any>{
                    userId: userId,
                    module: LogModule.Yodlee,
                    description: 'add bank success with providerId : ' + providerAccountId,
                    status: LogStatus.Success,
                    action: LogAction.AddBank,
                    detail: {...updateBank, providerId: providerAccountId}
                });
                BusinessLoader.logBusiness.create(log).catch(err => {
                    console.log(err);
                });
            }
        }
        return updateBank;
    }

    async getBank(userId, skip: number) {
        let yodleeAccount = await BusinessLoader.userBusiness.getYodleeAccountByUserId(userId);
        let flag = true;
        while (flag) {
            let listbank: any = [];
            try {
                let data = await YodleeHelper.getListProvider(yodleeAccount.user, yodleeAccount.password, {skip: skip});
                listbank = data.provider ? data.provider : [];
                if (listbank.length === 0)
                    flag = false;
                else
                    flag = true;
                listbank = listbank.map(bank => {
                    bank.bankId = bank.id;
                    return bank = _.pick(bank, ['bankId', 'logo', 'favicon', 'baseUrl', 'loginUrl', 'name', 'countryISOCode', 'languageISOCode']);
                });
                this.providerRepository.create(listbank);

                skip = skip + 500;
            }
            catch (error) {
                this.getBank(userId, skip);
                flag = false;
            }
        }
    }

    async getFormLoginBank(userId: string, providerId: string) {
        const fnName = 'Get Form Bank Login';
        LogHelper.logInfo(fileName, fnName, `Geting Form Bank Login With User Id : ${userId} ProviderId: ${providerId}`);
        let yodleeAccount = await BusinessLoader.userBusiness.getYodleeAccountByUserId(userId);
        LogHelper.logInfo(fileName, fnName, `Geting Form Bank Login With Login Name : ${yodleeAccount.user} ProviderId: ${providerId}`);
        let loginForm = await YodleeHelper.getFormLoginBank(yodleeAccount.user, yodleeAccount.password, providerId).catch(err => {
            let errorYodlee = err.error;
            if (errorYodlee && errorYodlee.errorCode === 'Y002') {
                let log = new LogCreate(<any>{
                    userId: userId,
                    description: 'not exist account yodlee ',
                    detail: err,
                    status: LogStatus.Error,
                    action: LogAction.CreateYodleeAccount
                });
                BusinessLoader.logBusiness.create(log).catch(e => {
                    console.log(e);
                    this.createAgainAccountYodlee(userId);
                });
            }
        });
        console.log('for Login Bank =>', JSON.stringify(loginForm));
        return loginForm;
    }

    /**
     * Use function when create yodlee account not success
    userId
     */
    async createAgainAccountYodlee(userId: string) {
        let user = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            return;
        else
            this.createAccount(userId, user.email);
    }

    async getStatusConnectingBank(userId: string, providerAccountId: string) {
        const fnName = 'Get Connected Bank Status';
        LogHelper.logInfo(fileName, fnName, `Geting Connected Bank Status With User Id : ${userId}`);
        let yodleeAccount = await BusinessLoader.userBusiness.getYodleeAccountByUserId(userId);
        let connectBankStatus = await YodleeHelper.getStatusConnectingBank(yodleeAccount.user, yodleeAccount.password, providerAccountId).catch(error => {

        });
        if (connectBankStatus && connectBankStatus.providerAccount && connectBankStatus.providerAccount.refreshInfo) {
            let refreshInfo = connectBankStatus.providerAccount.refreshInfo;
            if (refreshInfo.status === 'FAILED') {
                let log = new LogCreate(<any>{
                    userId: userId,
                    module: LogModule.Yodlee,
                    description: 'get status connect bank error with providerAccountId : ' + providerAccountId,
                    detail: connectBankStatus,
                    status: LogStatus.Error,
                    action: LogAction.GetBankStatus
                });
                BusinessLoader.logBusiness.create(log).catch(err => {
                    console.log(err);
                });
            }
            if (refreshInfo.status === 'SUCCESS') {
                let log = new LogCreate(<any>{
                    userId: userId,
                    module: LogModule.Yodlee,
                    description: 'connect bank success with providerAccountId : ' + providerAccountId,
                    detail: {...connectBankStatus, providerAccountId: providerAccountId},
                    status: LogStatus.Success,
                    action: LogAction.GetBankStatus
                });
                BusinessLoader.logBusiness.create(log).catch(err => {
                    console.log(err);
                });
            }
        }
        return connectBankStatus;
    }

    async loadStatementAndSave(userId: string, accountId: string, type: BankType) {
        const fnName = 'Load All Transaction';
        LogHelper.logInfo(fileName, fnName, `Geting All Transaction With : ${userId}`);
        if (!BankType[type])
            throw new Error('type not exits');
        let now = moment();
        let month = parseInt(now.format('M').toString());
        let year = parseInt(now.format('Y').toString());
        if (month > 6)
            year = year - 2;
        else
            year = year - 3;
        month = 7;
        LogHelper.logInfo(fileName, fnName, 'Load All transaction with month year ==============>' + month + '---' + year);
        await this.getStatementCustomMonth(userId, accountId, month, year, type);
        return 'System Is Loading Statement And Save To Database!';
    }

    async loadStatementAndSaveAll(userIds:string[]) {
        const fnName = 'Cron Job Every Day';
        LogHelper.logInfo(fileName, fnName, `Croning With All User`);
        // let query: any = {
        //     connectedBanks: {
        //         $elemMatch: {
        //             type: {
        //                 $exists: true,
        //                 $ne: ''
        //             },
        //             providerId: {
        //                 $exists: true,
        //                 $ne: ''
        //             },
        //             connectedId: {
        //                 $exists: true,
        //                 $ne: ''
        //             },
        //             connectedName: {
        //                 $exists: true,
        //                 $ne: ''
        //             }
        //         }
        //     }
        // };
        // if (userIds && Array.isArray(userIds) && userIds.length > 0)
        //     query._id = {
        //         $in: userIds
        //     };
        // let users = await this.userRepository.findAll({
        //     query: query
        // });
        let connectBanks = await BusinessLoader.connectBankBusiness.findAllConnectBank(userIds);
        LogHelper.logInfo(fileName, fnName, connectBanks.length + ' connectBanks for cron');

        for (let i = 0; i < connectBanks.length; i++) {
            let connectedBank = connectBanks[i];
            console.log(connectedBank.userId.email);
            if (connectedBank.type && connectedBank.accountName && connectedBank.providerAccountId && connectedBank.accountId) {
                try {
                    let bankAccounts = await this.getBankAccounts(connectedBank.userId._id);
                    let typeBank = connectedBank.type === BankType.Bank ? 'bank' : 'creditCard';
                    LogHelper.logInfo(fileName, fnName, 'bank account =>' + bankAccounts);
                    bankAccounts.account = bankAccounts.account ? bankAccounts.account : [];
                    bankAccounts.account = bankAccounts.account.filter((account) => {
                        return account.id === connectedBank.accountId && account.CONTAINER === typeBank;
                    });
                    if (bankAccounts.account.length !== 0) {
                        let blance = bankAccounts.account[0].balance ? bankAccounts.account[0].balance.amount : 0;
                        LogHelper.logInfo(fileName, fnName, 'balance========>' + bankAccounts.account[0]);
                        await BusinessLoader.connectBankBusiness.updateConnectedBanks(connectedBank._id, {
                            currentBalance: Number(blance),
                            type: connectedBank.type,
                            providerAccountId: String(bankAccounts.account[0].providerAccountId),
                            accountId: bankAccounts.account[0].accountId,
                            accountName: bankAccounts.account[0].accountName,
                            refreshinfo: bankAccounts.account[0].refreshinfo,
                            accountNumber: bankAccounts.account[0].accountNumber,
                            balance: bankAccounts.account[0].balance.amount,
                            accountStatus: bankAccounts.account[0].accountStatus,
                            providerId: bankAccounts.account[0].providerId
                        });
                    }
                    let now = moment();
                    let month = parseInt(now.format('M').toString());
                    let year = parseInt(now.format('Y').toString());
                    if (month > 6)
                        year = year - 2;
                    else
                        year = year - 3;
                    month = 7;
                    LogHelper.logInfo(fileName, fnName, 'Load All transaction with month year ==============>' + month + '---' + year);

                    await this.getStatementCustomMonth(connectedBank.userId._id, String(connectedBank.accountId), month, year, connectedBank.type);
                    LogHelper.logInfo(fileName, fnName, 'cron start with user ==============>' + connectedBank.userId.email);
                    LogHelper.logInfo(fileName, fnName, 'cron finish with user ==============>' + connectedBank.userId.email);
                }
                catch (error) {
                    LogHelper.logError(fileName, fnName, error);
                }
            }
        }
    }

    async getTransactionsByMonth(userId: string, month: number, year: number, type: BankType, accountIdSelected: string): Promise<Array<any>> {
        const fnName = 'Get Transaction By Month';
        LogHelper.logInfo(fileName, fnName, `Geting Transaction Month :${month}- Year${year} With UserId : ${userId}`);
        if (!BankType[type])
            throw new Error('type not exits');
        LogHelper.logInfo(fileName, fnName, 'type bank ================>' + typeof type);
        let typeStatment = type === BankType.Bank ? 'bank' : 'creditCard';
        LogHelper.logInfo(fileName, fnName, 'type statement ====>' + typeStatment);
        let fromDate = moment([year, month - 1]);
        let toDate = moment(fromDate).endOf('month');
        let currentMonth = moment().format('M');
        let currentYear = moment().format('Y');
        let statement = [];
        let yodleeAccount = await BusinessLoader.userBusiness.getYodleeAccountByUserId(userId);
        let transactionsDB:any[] = await BusinessLoader.transactionBusiness.getTransactionsByMonth(userId, accountIdSelected, month, year, type);
        transactionsDB = transactionsDB.map(transaction => {
            let date = moment(transaction.date).format('YYYY-MM-DD').toString();
            transaction.date = date;
            return transaction;
        });

        console.log('yodleeAccount', yodleeAccount);
        if (parseInt(currentMonth) === month && parseInt(currentYear) === year) {
            fromDate = moment([year, month - 1]);
            toDate = moment();
        }

        statement = await this.getTransactions(yodleeAccount.user, yodleeAccount.password, fromDate, toDate, typeStatment, accountIdSelected);

        if (statement && Array.isArray(statement) && statement.length > 1) {
            this.checkTrasactionOneMonth(statement, userId);
            this.filterDuplicate(statement, transactionsDB);
        }

        return statement;
    }

    async getTransactionsForTesting(userId: string, accountIdSelected: string, typeBank: number, month: number, year: number) {
        let fromDate = moment([year, month - 1]);
        let toDate = moment(fromDate).endOf('month');
        let currentMonth = moment().format('M');
        let currentYear = moment().format('Y');
        if (parseInt(currentMonth) === month && parseInt(currentYear) === year) {
            fromDate = moment([year, month - 1]);
            toDate = moment();
        }
        let yodleeAccount = await BusinessLoader.userBusiness.getYodleeAccountByUserId(userId);
        if (!yodleeAccount || !yodleeAccount.user || !yodleeAccount.password)
            throw new Error('can not find yodlee acount!');
        let typeStatment = typeBank === BankType.Bank ? 'bank' : 'creditCard';
        let transections = await this.getTransactions(yodleeAccount.user, yodleeAccount.password, fromDate, toDate, typeStatment, accountIdSelected);
        console.log('transectionstransectionstransections', transections);
        return transections;
    }

    async getTransactions(loginName: string, password: string, fromDate: any, toDate: any, typeBank: string, accountIdSelected: string, skip: number = 0) {
        let isGetTransaction = true;
        let transactions = [];
        while (isGetTransaction) {
            let transactionsYodlee = await YodleeHelper.getStatement(loginName, password, fromDate.toDate(), toDate.toDate(), typeBank, accountIdSelected, skip).catch(err => {
                console.log(err);
            });
            if (transactionsYodlee.length < 500)
                isGetTransaction = false;
            transactionsYodlee = transactionsYodlee.filter(function(item) {
                return item.status !== 'PENDING';
            });
            transactions = transactions.concat(transactionsYodlee);
            skip = skip + 500;
        }
        console.log('transactions =>>>>>>>>>>>>>>>>>>>>>>>>', transactions);
        return transactions;
    }

    async getStatementTwoFinalYear(userId: string, accountId: string, type: BankType) {
        const fnName = 'Get Transaction One Year';
        LogHelper.logInfo(fileName, fnName, `Geting Transaction One Year With User Id : ${userId}`);
        /**
         * 1. Check bank type exists
         */

        if (!BankType[type])
            throw new Error('type not exits');
        let user = await BusinessLoader.userBusiness.get(userId);

        LogHelper.logInfo(fileName, fnName, user);
        if (!user)
            return;

        let connectedBanks = await BusinessLoader.connectBankBusiness.getConnectBanksByUserId(userId);
        let connectedBank = connectedBanks.find(item => {
            return item.type === type && String(item.accountId) === accountId;
        });
        if (!connectedBank)
            return;
        let statements = await BusinessLoader.statementBusiness.find({
            userId: userId,
            accountId: accountId,
            type: type
        });

        LogHelper.logInfo(fileName, fnName, 'get transaction yodlee!!!!');

        LogHelper.logInfo(fileName, fnName, 'connected bank' + connectedBank);

        let closingBalance = connectedBank.currentBalance ? connectedBank.currentBalance : 0;
        let bankId = parseInt(connectedBank.providerId);
        // if (bankId === 0 && connectedBank && Array.isArray(connectedBank.accounts) && connectedBank.accounts.length > 0) {
        //     let bank = connectedBank.accounts.find(b => b.id === connectedBank.connectedId);
        //     if (bank)
        //         bankId = bank.providerId;
        // }
        let dateQuery = moment();
        let fromDate = moment().subtract(1, 'years');
        let nowMonth = moment().format('M');
        if (parseInt(nowMonth) >= 7)
            fromDate = moment().month(7 - 2).subtract(1, 'year');
        else
            fromDate = moment().month(7 - 2).subtract(2, 'year');
        if (statements.length <= 24) {
            LogHelper.logInfo(fileName, fnName, 'count number statement =>>' + statements.length);
            if (statements.length > 0) {
                statements.sort((first, next) => {
                    if (first.year === next.year)
                        return first.month - next.month;
                    else
                        return first.year - next.year;
                });
                LogHelper.logInfo(fileName, fnName, 'count number statement sort after=>>' + statements.length);

                let isFalse = statements[0].transactionFailed ? statements[0].transactionFailed : false;
                LogHelper.logInfo(fileName, fnName, 'status====>' + isFalse);
                // is load transaction sucsses => not get
                // disable check load transaction
                // if (!isFalse)
                //     return;
                await BusinessLoader.statementBusiness.update(statements[0]._id, {transactionFailed: false});
                dateQuery = moment([statements[0].year, statements[0].month - 1]);
                LogHelper.logInfo(fileName, fnName, 'date query' + dateQuery);
                closingBalance = statements[0].closeBalance;
            }
            while (fromDate.diff(dateQuery) < 0) {
                let month = dateQuery.format('M').toString();
                let year = dateQuery.format('Y').toString();
                LogHelper.logInfo(fileName, fnName, 'get transaction ' + month);
                await this.getStatementOneMonth(userId, parseInt(month), parseInt(year), type, accountId, bankId, closingBalance);

                dateQuery.subtract(1, 'month');
            }
        }
    }

    async getStatementOneYear(userId: string, accountId: string, type: BankType) {
        const fnName = 'Get Transaction One Year';
        LogHelper.logInfo(fileName, fnName, `Geting Transaction One Year With User Id : ${userId}`);
        /**
         * 1. Check bank type exists
         */

        if (!BankType[type])
            throw new Error('type not exits');
        let user = await BusinessLoader.userBusiness.get(userId);

        LogHelper.logInfo(fileName, fnName, user);
        if (!user)
            return;
        // let connectedBanks = user.connectedBanks;
        // let connectedBank = connectedBanks.find(item => {
        //     return item.type === type;
        // });
        let connectedBank = await BusinessLoader.connectBankBusiness.getConnectBankByAccountId(userId, accountId);
        if (!connectedBank)
            return;
        if (connectedBank.type !== type)
            return;
        let bankId = connectedBank.providerId ? parseInt(connectedBank.providerId) : 0;
        let statements = await BusinessLoader.statementBusiness.find({
            userId: userId,
            accountId: accountId,
            type: type
        });

        LogHelper.logInfo(fileName, fnName, 'get transaction yodlee!!!!');

        LogHelper.logInfo(fileName, fnName, 'connected bank' + connectedBank);
        let closingBalance = connectedBank.currentBalance ? connectedBank.currentBalance : 0;
        let dateQuery = moment();
        if (statements.length <= 12) {
            LogHelper.logInfo(fileName, fnName, 'count number statement =>>' + statements.length);
            if (statements.length > 0) {
                statements.sort((first, next) => {
                    if (first.year === next.year)
                        return first.month - next.month;
                    else
                        return first.year - next.year;
                });
                LogHelper.logInfo(fileName, fnName, 'count number statement sort after=>>' + statements.length);

                let isFalse = statements[0].transactionFailed ? statements[0].transactionFailed : false;
                LogHelper.logInfo(fileName, fnName, 'status====>' + isFalse);
                // is load transaction sucsses => not get
                if (!isFalse)
                    return;
                await BusinessLoader.statementBusiness.update(statements[0]._id, {transactionFailed: false});
                dateQuery = moment([statements[0].year, statements[0].month - 1]);
                LogHelper.logInfo(fileName, fnName, 'date query' + dateQuery);
                closingBalance = statements[0].closeBalance;
            }
            for (let subMonth = 0; subMonth < 12; subMonth++) {
                let month = dateQuery.format('M').toString();
                let year = dateQuery.format('Y').toString();
                LogHelper.logInfo(fileName, fnName, 'get transaction ' + month);
                closingBalance = await this.getStatementOneMonth(userId, parseInt(month), parseInt(year), type, accountId, bankId, closingBalance);

                dateQuery.subtract(1, 'month');
            }
        }
    }

    async getStatementCustomMonth(userId: string, accountId: string, month:number, year:number, type: BankType) {
        const fnName = 'Get Transaction Custome Time';
        LogHelper.logInfo(fileName, fnName, `Geting Transaction Custom time With User Id : ${userId}`);
        /**
         * 1. Check bank type exists
         */

        if (!BankType[type])
            throw new Error('type not exits');
        let user = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            return;
        let connectBank = await BusinessLoader.connectBankBusiness.getConnectBankByAccountId(userId, accountId);
        LogHelper.logInfo(fileName, fnName, user);

        if (!connectBank)
            return;
        // let connectedBanks = user.connectedBanks;
        // let connectedBank = connectedBanks.find(item => {
        //     return item.type === type;
        // });
        if (connectBank.type !== type)
            return;
        let bankId = connectBank.providerId ? parseInt(connectBank.providerId) : 0;
        let statements = await BusinessLoader.statementBusiness.find({
            userId: userId,
            accountId: accountId,
            type: type
        });

        LogHelper.logInfo(fileName, fnName, 'get transaction yodlee!!!!');

        LogHelper.logInfo(fileName, fnName, 'connected bank' + connectBank);
        let closingBalance = connectBank.currentBalance ? connectBank.currentBalance : 0;
        let dateQuery = moment();
        let dateEnd = moment([year, month - 1]);

        LogHelper.logInfo(fileName, fnName, 'count number statement =>>' + statements.length);
        if (statements.length > 0 && statements.length < 24) {
            statements.sort((first, next) => {
                if (first.year === next.year)
                    return first.month - next.month;
                else
                    return first.year - next.year;
            });
            LogHelper.logInfo(fileName, fnName, 'count number statement sort after=>>' + statements.length);

            let isFalse = statements[0].transactionFailed ? statements[0].transactionFailed : false;
            LogHelper.logInfo(fileName, fnName, 'status====>' + isFalse);
            // is load transaction sucsses => not get
            if (!isFalse) {
                dateQuery = dateQuery = moment([statements[0].year, statements[0].month - 2]);
                LogHelper.logInfo(fileName, fnName, 'date query' + dateQuery);
                closingBalance = statements[0].closeBalance;
            }
            else {
                await BusinessLoader.statementBusiness.update(statements[0]._id, {transactionFailed: false});
                dateQuery = moment([statements[0].year, statements[0].month - 1]);
                LogHelper.logInfo(fileName, fnName, 'date query' + dateQuery);
                closingBalance = statements[0].closeBalance;
            }
        }
        let distance = dateQuery.diff(dateEnd, 'months');
        console.log('distancedistancedistancedistance**********************************', distance);
        for (let subMonth = 0; subMonth <= distance; subMonth++) {
            let month = dateQuery.format('M').toString();
            let year = dateQuery.format('Y').toString();
            LogHelper.logInfo(fileName, fnName, 'get transaction ' + month);
            closingBalance = await this.getStatementOneMonth(userId, parseInt(month), parseInt(year), type, accountId, bankId, closingBalance);

            dateQuery.subtract(1, 'month');
        }
    }

    private async getStatementOneMonth(userId: string, month: number, year: number, type: number, accountId: string, bankId: number, closingBalance: number):Promise<any> {
        let fnName = 'Get Statement One Month';
        let transactions = await BusinessLoader.transactionBusiness.getTransactionsByMonth(userId, accountId, month, year, type);
        if (transactions.length === 0) {
            try {
                let openBalance = closingBalance;
                let transactionsYodlee = await this.getTransactionsByMonth(userId, month, year, type, accountId);
                if (transactionsYodlee.length !== 0) {
                    let isHaveRunningBalance = true;
                    if (type === BankType.Bank) {
                        for (let index = 0; index < transactionsYodlee.length; index++) {
                            const element = transactionsYodlee[index];
                            if (!element.runningBalance) {
                                isHaveRunningBalance = false;
                                break;
                            }
                        }
                    }
                    else {
                        isHaveRunningBalance = false;
                    }
                    console.log(isHaveRunningBalance ? 'have runing balance ======>' : 'not have running balance');
                    console.log(transactionsYodlee[0]);
                    if (isHaveRunningBalance) {
                        transactionsYodlee = this.sortTransactionOneMonth(transactionsYodlee);
                        let total = transactionsYodlee[0].runningBalance.amount ? transactionsYodlee[0].runningBalance.amount : 0; ;
                        let value = transactionsYodlee[0].amount.amount;
                        let balance = transactionsYodlee[0].baseType === 'DEBIT' ? + (total + value).toFixed(5) : (total - value).toFixed(5);
                        openBalance = Number(balance);
                        closingBalance = transactionsYodlee[transactionsYodlee.length - 1].runningBalance.amount;
                    }
                    else {
                        transactionsYodlee = this.caculatorTransactionWithClosingBalance(transactionsYodlee, closingBalance);

                        let total = transactionsYodlee[transactionsYodlee.length - 1].runningBalance.amount ? transactionsYodlee[transactionsYodlee.length - 1].runningBalance.amount : 0; ;
                        let value = transactionsYodlee[transactionsYodlee.length - 1].amount.amount;
                        let balance = transactionsYodlee[transactionsYodlee.length - 1].baseType === 'DEBIT' ? + (total + value).toFixed(5) : (total - value).toFixed(5);
                        LogHelper.logInfo(fileName, fnName, 'transaction de  tinh openbalance' + transactionsYodlee[transactionsYodlee.length - 1]);
                        openBalance = Number(balance);
                        closingBalance = transactionsYodlee[0].runningBalance.amount;
                    }
                    let transactionsCreate = this.createTransactionList(transactionsYodlee, userId, bankId);
                    transactions = await BusinessLoader.transactionBusiness.createTransactions(transactionsCreate);
                }

                let statement = new StatementCreate(<IStatement>{
                    userId: userId,
                    accountId: accountId,
                    closeBalance: closingBalance,
                    openBalance: openBalance,
                    month: month,
                    year: year,
                    type: type
                });
                let statementsDB = await BusinessLoader.statementBusiness.find({
                    userId: userId,
                    accountId: accountId,
                    month: month,
                    year: year,
                    type: type
                });
                if (statementsDB.length === 0) {
                    let crunch = new CrunchCreate(<any>{
                        userId: userId,
                        accountId: accountId,
                        month: month,
                        year: year,
                        type: type,
                        coaAmounts: []
                    });
                    BusinessLoader.statementBusiness.create(statement);
                    BusinessLoader.crunchBusiness.create(crunch);
                }
                else
                    BusinessLoader.statementBusiness.update(statementsDB[0]._id, {
                        closeBalance: closingBalance,
                        openBalance: openBalance,
                    });

                closingBalance = openBalance;
            }
            catch (error) {
                let statement = new StatementCreate(<IStatement>{
                    userId: userId,
                    accountId: accountId,
                    closeBalance: closingBalance,
                    openBalance: closingBalance,
                    month: month,
                    year: year,
                    type: type,
                    transactionFailed: true
                });
                let statementsDB = await BusinessLoader.statementBusiness.find({
                    userId: userId,
                    accountId: accountId,
                    month: month,
                    year: year,
                    type: type
                });
                if (statementsDB.length === 0) {
                    let crunch = new CrunchCreate(<any>{
                        userId: userId,
                        accountId: accountId,
                        month: month,
                        year: year,
                        type: type,
                        coaAmounts: []
                    });
                    BusinessLoader.statementBusiness.create(statement);
                    BusinessLoader.crunchBusiness.create(crunch);
                }
                else
                    BusinessLoader.statementBusiness.update(statementsDB[0]._id, {transactionFailed: true});
                throw error;
            }
            return closingBalance;
        }
    }

    private checkTrasactionOneMonth(transactions: any[], userId: string) {
        let fnName = 'check transaction duplicate one month';
        LogHelper.logInfo(fileName, fnName, 'start sort');
        LogHelper.logInfo(fileName, fnName, 'number transacion for sort' + transactions.length);
        if (transactions.length === 0)
            return;
        let firstTransaction = transactions[0];
        let isHaveRunningBalance = firstTransaction.runningBalance ? true : false;
        let crossTransactions:any[] = [];
        transactions.forEach(item => {
            // replace mutiple space character to single space
            if (item.description && item.description.original)
                item.description.original = item.description.original.replace(/\s\s+/g, ' ');

            let transactionHaveRunningBalance = item.runningBalance ? true : false;
            if (transactionHaveRunningBalance !== isHaveRunningBalance) {
                console.log('have issue cross traction with many account');
                crossTransactions.push(item);
            }
        });

        if (crossTransactions.length > 0) {
            this.writeFileLog('warning', 'cross transaction', crossTransactions, userId);
        }

        let date = transactions[0].date;
        let startOfMonth = moment(date).startOf('month');
        let endOfMonth = moment(date).endOf('month');
        let index = startOfMonth;
        let transactionError:any = [];
        let transactionWarning:any = [];

        while (endOfMonth.diff(index) >= 0) {
            let transactionsOneDay = _.filter(transactions, function(transaction) {
                return moment(transaction.date).diff(index) === 0;
            });

            if (transactionsOneDay.length !== 0) {
                let resultCheck = this.checkTransactionOneDay(transactionsOneDay);
                if (resultCheck && resultCheck.trasactionError && resultCheck.trasactionError.length !== 0)
                    transactionError = transactionError.concat(resultCheck.trasactionError);
                if (resultCheck && resultCheck.trasactionWaring && resultCheck.trasactionWaring.length !== 0)
                    transactionWarning = transactionWarning.concat(resultCheck.trasactionWaring);
            }

            index.add(1, 'day');
        }

        if (transactionError.length > 0)
            this.writeFileLog('error', 'duplicate', transactionError, userId);
        if (transactionWarning.length > 0)
            this.writeFileLog('warning', 'duplicate transaction', transactionWarning, userId);
    }

    private filterDuplicate(transactions, transactionsSource) {
        let dates = this.getDatesTransaction(transactions);

        let temp = transactions.map((item, index) => {
            return {
                ...item,
                index
            };
        });

        dates.forEach(date => {
            let transactionsInDate = temp.filter(transaction => transaction.date === date);
            let transactionsSourceInDate = transactionsSource.filter(transaction => transaction.date === date);
            let resultHandel:any[] = [];
            if (transactionsSourceInDate.length > 0 && transactionsInDate.length > 0) {
                resultHandel = this.handelDuplicateWithCompareDataBase(transactionsInDate, transactionsSourceInDate);
            }

            if (transactionsSourceInDate.length === 0 && transactionsInDate.length > 0)
                resultHandel = this.handelDuplicateFilterData(transactionsInDate);
            resultHandel.forEach(item => {
                if (item.index && transactions[item.index])
                    transactions[item.index] = item;
            });
        });
    }

    private handelDuplicateWithCompareDataBase(transactionsInDate: any[], transactionsSourceInDate: any[]) {
        let result: any[] = [];
        if (transactionsInDate.length <= transactionsSourceInDate.length)
            return result;
        transactionsInDate = transactionsInDate.map(transaction => {
            return {...transaction, transactionId: transaction.id};
        });
        transactionsInDate = _.differenceBy(transactionsInDate, transactionsSourceInDate, 'transactionId');

        if (transactionsInDate.length <= 0)
            return result;
        transactionsSourceInDate = _.uniqWith(transactionsSourceInDate, (item, itemNext) => {
            let descriptionItem = item.description && item.description.original ? item.description.original : '';
            let descriptionItemNext = itemNext.description && itemNext.description.original ? itemNext.description.original : '';
            let amountItem = item.amount && item.amount.amount ? parseFloat(item.amount.amount) : 0;
            let amountItemNext = itemNext.amount && itemNext.amount.amount ? parseFloat(itemNext.amount.amount) : 0;
            return descriptionItem === descriptionItemNext && amountItem === amountItemNext;
        });

        transactionsSourceInDate.forEach(transactionSource => {
            let descriptionTransaction = transactionSource.description && transactionSource.description.original ? transactionSource.description.original : '';
            let amountTransaction = transactionSource.amount && transactionSource.amount.amount ? parseFloat(transactionSource.amount.amount) : 0;
            let transactionId = transactionSource.transactionId;
            let transactionsDuplicate = transactionsInDate.filter(transactionInDate => {
                let descriptionCompare = transactionInDate.description && transactionInDate.description.original ? transactionInDate.description.original : '';
                let amountCompare = transactionInDate.amount && transactionInDate.amount.amount ? parseFloat(transactionInDate.amount.amount) : 0;
                return transactionInDate.id !== transactionId && descriptionTransaction === descriptionCompare && amountTransaction === amountCompare;
            });
            transactionsDuplicate = transactionsDuplicate.map(transaction => {
                transaction.duplicateId = transactionId;
                transaction.isWarningDuplicate = true;
                return transaction;
            });
            result = result.concat(transactionsDuplicate);
        });
        return result;
    }

    private handelDuplicateFilterData(transactionInDate:any[]):any[] {
        if (transactionInDate.length <= 1)
            return transactionInDate;
        let transactionsUniq = _.uniqWith(transactionInDate, (item, itemNext) => {
            let descriptionItem = item.description && item.description.original ? item.description.original : '';
            let descriptionItemNext = itemNext.description && itemNext.description.original ? itemNext.description.original : '';
            let amountItem = item.amount && item.amount.amount ? parseFloat(item.amount.amount) : 0;
            let amountItemNext = itemNext.amount && itemNext.amount.amount ? parseFloat(itemNext.amount.amount) : 0;
            return descriptionItem === descriptionItemNext && amountItem === amountItemNext && item.date === itemNext.date;
        });

        transactionsUniq.forEach(item => {
            let descriptionItem = item.description && item.description.original ? item.description.original : '';
            let amountItem = item.amount && item.amount.amount ? parseFloat(item.amount.amount) : 0;
            for (let index = 0; index < transactionInDate.length; index++) {
                const element = transactionInDate[index];
                let description = element.description && element.description.original ? element.description.original : '';
                let amount = element.amount && element.amount.amount ? parseFloat(element.amount.amount) : 0;
                if (item.id !== element.id && descriptionItem === description && amountItem === amount && item.date === element.date) {
                    transactionInDate[index].duplicateId = item.id;
                    transactionInDate[index].isWarningDuplicate = true;
                }
            }
        });

        return transactionInDate;
    }

    private getDatesTransaction(transactions:any[]):any[] {
        let dates:any = [];

        transactions.forEach(transaction => {
            if (!dates.find(date => date === transaction.date))
                dates.push(transaction.date);
        });
        return dates;
    }

    private checkTransactionOneDay(transactions) {
        let warningTransactionDup:any[] = [];
        let errorTransactionDup:any[] = [];
        if (transactions.length > 1) {
            let transactionSort = transactions.sort(function(a, b) {
                let amountA = a.amount && a.amount.amount ? parseFloat(a.amount.amount) : 0;
                let amountB = b.amount && b.amount.amount ? parseFloat(b.amount.amount) : 0;
                return amountA - amountB;
            });

            let isHaveRunningBalance = transactions.runningBalance ? true : false;
            for (let i = 0; i < (transactionSort.length - 1); i++) {
                let transaction = transactionSort[i];
                let nextTransaction = transactionSort[i + 1];
                let amount = transaction.amount && transaction.amount.amount ? parseFloat(transaction.amount.amount) : 0;
                let amountNext = nextTransaction.amount && nextTransaction.amount.amount ? parseFloat(nextTransaction.amount.amount) : 0;
                let description = transaction.description && transaction.description.original ? transaction.description.original : '';
                let descriptionNext = nextTransaction.description && nextTransaction.description.original ? nextTransaction.description.original : '';
                console.log({amount, description}, {amountNext, descriptionNext});

                if (amount === amountNext && description === descriptionNext) {
                    console.log('Maybe duplicate trasaction');
                    warningTransactionDup.push(transaction);
                    if (isHaveRunningBalance) {
                        let runningBalance = transaction.runningBalance.amount ? parseFloat(transaction.runningBalance.amount) : 0;
                        let runningBalanceNext = nextTransaction.runningBalance.amount ? parseFloat(nextTransaction.runningBalance.amount) : 0;
                        if (runningBalance === runningBalanceNext)
                            errorTransactionDup.push(transaction);
                    }
                }
            }
        }
        return {
            trasactionWaring: warningTransactionDup,
            trasactionError: errorTransactionDup
        };
    }

    getTrasactionOneClient(userId: string, accountId: string, type: BankType) {
        const fnName = 'Load All Transaction';
        LogHelper.logInfo(fileName, fnName, `Geting All Transaction With : ${userId}`);
        if (!BankType[type])
            throw new Error('type not exits');
        this.getStatementCustomMonth(userId, accountId, 1, 2017, type);
        return 'System Is Loading Statement And Save To Database!';
    }

    async getTransactionAllClient() {
        const fnName = 'Cron Job Every Day';
        LogHelper.logInfo(fileName, fnName, `Croning With All User`);
        let connectBanks = await BusinessLoader.connectBankBusiness.findAllConnectBank();
        LogHelper.logInfo(fileName, fnName, connectBanks.length + ' connectBanks for cron');

        for (let i = 0; i < connectBanks.length; i++) {
            let connectedBank = connectBanks[i];
            console.log(connectedBank.userId.email);
            if (connectedBank.type && connectedBank.accountName && connectedBank.providerAccountId && connectedBank.accountId) {
                try {
                    LogHelper.logInfo(fileName, fnName, 'cron start with user ==============>' + connectedBank.userId.email);
                    let typeBank = connectedBank.type === BankType.Bank ? 'bank' : 'creditCard';
                    await this.getStatementTwoFinalYear(connectedBank.userId._id, String(connectedBank.accountId), connectedBank.type);
                    LogHelper.logInfo(fileName, fnName, 'cron finish with user ==============>' + connectedBank.userId.email);
                    // update currenct balance for account
                    let bankAccounts = await this.getBankAccounts(connectedBank.userId._id);
                    LogHelper.logInfo(fileName, fnName, 'bank account =>' + bankAccounts);
                    bankAccounts.account = bankAccounts.account ? bankAccounts.account : [];
                    bankAccounts.account = bankAccounts.account.filter((account) => {
                        return account.connectedId === connectedBank.accountId && account.CONTAINER === typeBank;
                    });
                    if (bankAccounts.account.length !== 0) {
                        let blance = bankAccounts.account[0].balance ? bankAccounts.account[0].balance.amount : 0;
                        let bankId = bankAccounts.account[0].providerId ? bankAccounts.account[0].providerId : 0;
                        LogHelper.logInfo(fileName, fnName, 'balance========>' + bankAccounts.account[0]);
                        await BusinessLoader.connectBankBusiness.updateConnectedBanks(connectedBank._id, {
                            currentBalance: Number(blance),
                            type: connectedBank.type,
                            providerAccountId: String(bankAccounts.account[0].providerAccountId),
                            accountId: bankAccounts.account[0].accountId,
                            accountName: bankAccounts.account[0].accountName,
                            refreshinfo: bankAccounts.account[0].refreshinfo,
                            accountNumber: bankAccounts.account[0].accountNumber,
                            balance: bankAccounts.account[0].balance.amount,
                            accountStatus: bankAccounts.account[0].accountStatus,
                            providerId: bankId
                        });
                    }
                }
                catch (error) {
                    LogHelper.logError(fileName, fnName, error);
                }
            }
        }
    }

    async cronTransactionAllClient() {
        const fnName = 'Cron Job Every Day';
        LogHelper.logInfo(fileName, fnName, `Croning With All User`);
        let connectBanks = await BusinessLoader.connectBankBusiness.findAllConnectBank();
        LogHelper.logInfo(fileName, fnName, connectBanks.length + ' connectBanks for cron');

        for (let i = 0; i < connectBanks.length; i++) {
            let connectedBank = connectBanks[i];
            if (connectedBank.type && connectedBank.accountName && connectedBank.providerId && connectedBank.providerAccountId && connectedBank.accountId && !connectedBank.disabledPullTransaction) {
                try {
                    LogHelper.logInfo(fileName, fnName, 'cron start with user ==============>' + connectedBank.userId.email);
                    let typeBank = connectedBank.type === BankType.Bank ? 'bank' : 'creditCard';
                    await this.cronAndUpdate(connectedBank.userId._id, connectedBank);
                    LogHelper.logInfo(fileName, fnName, 'cron finish with user ==============>' + connectedBank.userId.email);
                    // update currenct balance for
                    let bankAccounts = await this.getBankAccounts(connectedBank.userId._id);
                    LogHelper.logInfo(fileName, fnName, 'bank account =>' + bankAccounts);
                    bankAccounts.account = bankAccounts.account ? bankAccounts.account : [];
                    bankAccounts.account = bankAccounts.account.filter((account) => {
                        return account.id === connectedBank.accountId && account.CONTAINER === typeBank;
                    });
                    if (bankAccounts.account.length !== 0) {
                        let blance = bankAccounts.account[0].balance ? bankAccounts.account[0].balance.amount : 0;
                        LogHelper.logInfo(fileName, fnName, 'balance========>' + bankAccounts.account[0]);
                        await BusinessLoader.connectBankBusiness.updateConnectedBanks(connectedBank._id, {
                            currentBalance: Number(blance),
                            type: connectedBank.type,
                            providerAccountId: String(bankAccounts.account[0].providerAccountId),
                            accountId: bankAccounts.account[0].accountId,
                            accountName: bankAccounts.account[0].accountName,
                            refreshinfo: bankAccounts.account[0].refreshinfo,
                            accountNumber: bankAccounts.account[0].accountNumber,
                            balance: bankAccounts.account[0].balance.amount,
                            accountStatus: bankAccounts.account[0].accountStatus,
                            providerId: bankAccounts.account[0].providerId
                        });
                    }
                }
                catch (error) {
                    LogHelper.logError(fileName, fnName, error);
                }
            }
        }
        let logUrl = path.join(__dirname, '../../../logs');
        let nameFile = 'transaction-issue' + moment().format('DD-MM-YY') + '.txt';
        let fileUrl = logUrl + '/' + nameFile;
        console.log(fileUrl);

        if (await FileHelper.checkURLExist(logUrl) || await FileHelper.checkURLExist(fileUrl)) {
            this.sendMailDuplicateTrasaction();
        }
    }

    async getPublicKey(): Promise<any> {
        let publicKeyPem = await YodleeHelper.getPublicKey();
        console.log('publicKeyPem =>>>>>>>>>>>>>>>>>', publicKeyPem);
        return publicKeyPem;
    }

    async cronWithUserId(userId: string) {
        const fnName = 'Cron With User Id';
        LogHelper.logInfo(fileName, fnName, `Croning With User Id : ${userId}`);
        let user = await this.userRepository.get(userId);
        if (!user)
            throw new Error('user not exits');
        let connectedBanks = await BusinessLoader.connectBankBusiness.getConnectBanksByUserId(userId);
        if (connectedBanks.length) {
            connectedBanks.forEach(async (connectedBank) => {
                if (connectedBank.type && connectedBank.accountName && connectedBank.providerAccountId && connectedBank.accountId && !connectedBank.disabledPullTransaction)
                    try {
                        if (!user)
                            throw new Error('user not exits');
                        LogHelper.logInfo(fileName, fnName, 'cron with user ==============>' + user.email);
                        let typeBank = connectedBank.type === BankType.Bank ? 'bank' : 'creditCard';
                        await this.cronAndUpdate(user._id, connectedBank);
                        // update currenct balance for account
                        let bankAccounts = await this.getBankAccounts(user._id);
                        LogHelper.logInfo(fileName, fnName, 'bank account ====>' + bankAccounts);
                        bankAccounts.account = bankAccounts.account ? bankAccounts.account : [];
                        bankAccounts.account = bankAccounts.account.filter((account) => {
                            return account.id === connectedBank.accountId && account.CONTAINER === typeBank;
                        });
                        if (bankAccounts.account.length !== 0) {
                            let blance = bankAccounts.account[0].balance ? bankAccounts.account[0].balance.amount : 0;
                            LogHelper.logInfo(fileName, fnName, 'balance========>' + bankAccounts.account[0]);
                            await BusinessLoader.connectBankBusiness.updateConnectedBanks(connectedBank._id, {
                                currentBalance: Number(blance),
                                type: connectedBank.type,
                                providerAccountId: String(bankAccounts.account[0].providerAccountId),
                                accountId: bankAccounts.account[0].accountId,
                                accountName: bankAccounts.account[0].accountName,
                                refreshinfo: bankAccounts.account[0].refreshinfo,
                                accountNumber: bankAccounts.account[0].accountNumber,
                                balance: bankAccounts.account[0].balance.amount,
                                accountStatus: bankAccounts.account[0].accountStatus,
                                providerId: bankAccounts.account[0].providerId
                            });
                        }
                    }
                    catch (error) {
                        LogHelper.logError(fileName, fnName, error);
                    }
            });
        }
    }

    async cronWithUserIdCustom(userId: string, month: number) {
        const fnName = 'Cron With User Id';
        LogHelper.logInfo(fileName, fnName, `Croning With User Id : ${userId}`);
        let user = await this.userRepository.get(userId);
        if (!user)
            throw new Error('user not exits');
        let connectedBanks = await BusinessLoader.connectBankBusiness.getConnectBanksByUserId(userId);
        if (connectedBanks.length) {
            connectedBanks.forEach(async (connectedBank) => {
                if (connectedBank.type && connectedBank.accountName && connectedBank.providerAccountId && connectedBank.accountId)
                    try {
                        if (!user)
                            throw new Error('user not exits');
                        LogHelper.logInfo(fileName, fnName, 'cron with user ==============>' + user.email);
                        let typeBank = connectedBank.type === BankType.Bank ? 'bank' : 'creditCard';
                        await this.cronAndUpdateCustom(user._id, connectedBank, month);
                        // update currenct balance for account
                        let bankAccounts = await this.getBankAccounts(user._id);
                        LogHelper.logInfo(fileName, fnName, 'bank account ====>' + bankAccounts);
                        bankAccounts.account = bankAccounts.account ? bankAccounts.account : [];
                        bankAccounts.account = bankAccounts.account.filter((account) => {
                            return account.id === connectedBank.accountId && account.CONTAINER === typeBank;
                        });
                        if (bankAccounts.account.length !== 0) {
                            let blance = bankAccounts.account[0].balance ? bankAccounts.account[0].balance.amount : 0;
                            LogHelper.logInfo(fileName, fnName, 'balance========>' + bankAccounts.account[0]);
                            await BusinessLoader.connectBankBusiness.updateConnectedBanks(connectedBank._id, {
                                currentBalance: Number(blance),
                                type: connectedBank.type,
                                providerAccountId: String(bankAccounts.account[0].providerAccountId),
                                accountId: bankAccounts.account[0].accountId,
                                accountName: bankAccounts.account[0].accountName,
                                refreshinfo: bankAccounts.account[0].refreshinfo,
                                accountNumber: bankAccounts.account[0].accountNumber,
                                balance: bankAccounts.account[0].balance.amount,
                                accountStatus: bankAccounts.account[0].accountStatus,
                                providerId: bankAccounts.account[0].providerId
                            });
                        }
                    }
                    catch (error) {
                        LogHelper.logError(fileName, fnName, error);
                    }
            });
        }
    }

    async cronAndUpdate(userId: string, connectBank: ConnectedBank) {
        const fnName = 'Cron And Update';
        LogHelper.logInfo(fileName, fnName, `Croning With User Id : ${userId}`);
        if (!connectBank.accountId || !connectBank.type || !connectBank.providerAccountId || !connectBank.accountName)
            return;
        if (!BankType[connectBank.type]) {
            return;
        }
        if (!connectBank.accountId && !connectBank.accountName && !connectBank.providerAccountId)
            return;
        let fromDate = moment().subtract(1, 'month');
        let endDate = moment();
        let bankId = connectBank.providerId ? parseInt(connectBank.providerId) : 0;
        while (endDate.diff(fromDate) >= 0) {
            LogHelper.logInfo(fileName, fnName, 'get transaction from yodlee =>>>>>>>>>>>>>>' + fromDate.format('M'));
            // len server yodlee get transaction ve
            let transactionsYodlee = await this.getTransactionsByMonth(userId, parseInt(fromDate.format('M')), parseInt(fromDate.format('Y')), connectBank.type, String(connectBank.accountId));
            LogHelper.logInfo(fileName, fnName, 'transaction get from yodlee =====>' + ' ' + transactionsYodlee.length);
            // have running balance?
            transactionsYodlee = this.createTransactionList(transactionsYodlee, userId, bankId);
            let statements = await BusinessLoader.statementBusiness.find({
                userId: userId,
                type: connectBank.type,
                month: fromDate.format('M').toString(),
                year: fromDate.format('Y').toString()
            });
            LogHelper.logInfo(fileName, fnName, 'statement month' + '-' + fromDate.format('M') + '=>' + statements);
            // if not transaction on db => create
            if (statements.length === 0) {
                LogHelper.logInfo(fileName, fnName, 'statemt not create ====> create and update transaction===>');
                let openBalance = connectBank.currentBalance;
                let closingBalance = openBalance;
                if (transactionsYodlee.length !== 0) {
                    LogHelper.logInfo(fileName, fnName, 'fist item in transaction yodlee' + transactionsYodlee[0]);
                    LogHelper.logInfo(fileName, fnName, 'not have runing balance');
                    let dateLastMonth = moment(fromDate).subtract(1, 'month');
                    let lastStatement = await BusinessLoader.statementBusiness.find({
                        userId: userId,
                        type: connectBank.type,
                        month: dateLastMonth.format('M').toString(),
                        year: dateLastMonth.format('Y').toString()
                    }
                    );
                    if (lastStatement.length === 0)
                        return;
                    openBalance = lastStatement[0].closeBalance;
                    LogHelper.logInfo(fileName, fnName, 'caculator transaction with not have running balance ============>');
                    transactionsYodlee = this.caculatorTransactionWithOpenBalance(transactionsYodlee, openBalance);// tinh 1 thang
                    LogHelper.logInfo(fileName, fnName, 'after caculator transaction yodlee====>' + transactionsYodlee[transactionsYodlee.length - 1]);
                    closingBalance = transactionsYodlee[transactionsYodlee.length - 1].runningBalance.amount;
                    let transactionsCreate = this.createTransactionList(transactionsYodlee, userId, bankId);
                    BusinessLoader.transactionBusiness.createTransactions(transactionsCreate);
                }
                let statementCreate = new StatementCreate(<IStatement>{
                    userId: userId,
                    accountId: String(connectBank.accountId),
                    closeBalance: closingBalance,
                    openBalance: openBalance,
                    month: parseInt(fromDate.format('M')),
                    year: parseInt(fromDate.format('Y')),
                    type: connectBank.type
                });
                let crunchCreate = new CrunchCreate(<any>{
                    userId: userId,
                    accountId: connectBank.accountId,
                    month: parseInt(fromDate.format('M')),
                    year: parseInt(fromDate.format('Y')),
                    type: connectBank.type,
                    coaAmounts: []
                });
                BusinessLoader.statementBusiness.create(statementCreate);
                BusinessLoader.crunchBusiness.create(crunchCreate);
                // with transaction have not running balance
            }// if have transaction on db => compare transaction get to yodlee
            else {
                // find new transaction
                if (transactionsYodlee.length !== 0) {
                    let transactionsDB = await BusinessLoader.transactionBusiness.getTransactionsByMonth(userId, String(connectBank.accountId), connectBank.type, parseInt(fromDate.format('M')), parseInt(fromDate.format('Y')));
                    let transactionNew = _.differenceBy(transactionsYodlee, transactionsDB, 'transactionId');
                    LogHelper.logInfo(fileName, fnName, 'transaction on DB' + ':' + transactionsDB.length);
                    LogHelper.logInfo(fileName, fnName, 'transaction new' + ':' + transactionNew.length);
                    LogHelper.logInfo(fileName, fnName, 'handler with not have running balance =====>');
                    let minDay = moment(fromDate).startOf('month');
                    if (transactionsDB.length !== 0) {
                        let transactionFirst = transactionsDB[transactionsDB.length - 1];// ? 0
                        LogHelper.logInfo(fileName, fnName, 'transaction first ========>' + transactionFirst);
                        let value = transactionFirst.amount.amount;
                        let balance = transactionFirst.runningBalance.amount;
                        let tempOpenbalance = transactionFirst.baseType === 'DEBIT' ? + (balance + value).toFixed(5) : (balance - value).toFixed(5);
                        tempOpenbalance = Number(tempOpenbalance);// fix o day
                        LogHelper.logInfo(fileName, fnName, 'statements Open Balance' + statements[0]);
                        if ((statements[0].openBalance - tempOpenbalance) !== 0 || transactionNew.length !== 0) {// quay lai sau
                            if (transactionNew.length !== 0) { // not change transaction and balance => not update
                                minDay = transactionNew[0].date;
                                transactionNew.forEach(transaction => {
                                    if (moment(minDay).diff(moment(transaction.date)) > 0)
                                        minDay = transaction.date;
                                });
                            }
                            LogHelper.logInfo(fileName, fnName, 'Min day =>>>>' + minDay);
                            let transactionNotUpdate: any = [];// use blance day not change
                            let transactionUpdate: any = [];// transaction create and update
                            transactionsDB.forEach(item => {
                                if (moment(item.date).diff(moment(minDay)) < 0)
                                    transactionNotUpdate.push(item);
                                else
                                    transactionUpdate.push(item);
                            });
                            transactionUpdate = transactionUpdate.concat(transactionNew);
                            let openBalance = statements[0].openBalance;
                            transactionNotUpdate.forEach(item => {
                                let value = item.amount.amount;
                                let balance = item.baseType === 'DEBIT' ? + (openBalance - value).toFixed(5) : (openBalance + value).toFixed(5);
                                openBalance = Number(balance);
                            });
                            LogHelper.logInfo(fileName, fnName, 'trasanction Update' + transactionUpdate.length);
                            LogHelper.logInfo(fileName, fnName, 'transaction not update ' + transactionNotUpdate.length);
                            transactionUpdate = this.caculatorTransactionWithOpenBalance(transactionUpdate, openBalance);
                            LogHelper.logInfo(fileName, fnName, 'trasanction Update after caculator' + transactionUpdate.length);
                            let closingBalance = transactionUpdate[transactionUpdate.length - 1].runningBalance.amount;
                            // update close balance
                            LogHelper.logInfo(fileName, fnName, 'statement update' + statements[0]);
                            await BusinessLoader.statementBusiness.update(statements[0]._id, {closeBalance: closingBalance});
                            let nextMonth = moment(fromDate).add(1, 'month');
                            let nextStatement = await BusinessLoader.statementBusiness.find({
                                userId: userId,
                                type: connectBank.type,
                                month: nextMonth.format('M').toString(),
                                year: nextMonth.format('Y').toString()
                            }
                            );
                            if (nextStatement.length !== 0) {
                                LogHelper.logInfo(fileName, fnName, 'update for next statement' + nextStatement);
                                await BusinessLoader.statementBusiness.update(nextStatement[0]._id, {openBalance: closingBalance});
                            }
                            // update transaction
                            let transactionsCreate: any = [];
                            transactionUpdate.forEach(transaction => {
                                if (transaction._id) {
                                    LogHelper.logInfo(fileName, fnName, 'update with transaction id' + transaction._id);
                                    BusinessLoader.transactionBusiness.update(transaction._id, _.pick(transaction, ['index', 'runningBalance']));
                                }
                                else
                                    transactionsCreate.push(transaction);
                            });
                            if (TransactionCreate.length !== 0) {
                                LogHelper.logInfo(fileName, fnName, 'create new transaction to db :' + transactionsCreate.length + 'transaction');
                                BusinessLoader.transactionBusiness.createTransactions(transactionsCreate);
                            }
                        }
                    }
                    else {
                        LogHelper.logInfo(fileName, fnName, 'not have runing balance');
                        let dateLastMonth = moment(fromDate).subtract(1, 'month');
                        let lastStatement = await BusinessLoader.statementBusiness.find({
                            userId: userId,
                            type: connectBank.type,
                            month: dateLastMonth.format('M').toString(),
                            year: dateLastMonth.format('Y').toString()
                        });
                        if (lastStatement.length === 0)
                            return;
                        let openBalance = lastStatement[0].closeBalance;
                        LogHelper.logInfo(fileName, fnName, 'caculator transaction with not have running balance ============>');
                        transactionsYodlee = this.caculatorTransactionWithOpenBalance(transactionsYodlee, openBalance);// tinh 1 thang
                        LogHelper.logInfo(fileName, fnName, 'after caculator transaction yodlee====>' + transactionsYodlee[transactionsYodlee.length - 1]);
                        let closingBalance = transactionsYodlee[transactionsYodlee.length - 1].runningBalance.amount;
                        let transactionsCreate = this.createTransactionList(transactionsYodlee, userId, bankId);
                        BusinessLoader.transactionBusiness.createTransactions(transactionsCreate);
                        BusinessLoader.statementBusiness.update(statements[0]._id, {openBalance: openBalance, closeBalance: closingBalance});
                    }
                }
            }

            fromDate.add(1, 'month');
        }
    }

    async cronAndUpdateCustom(userId: string, connectBank: ConnectedBank, month: number) {
        const fnName = 'Cron And Update';
        LogHelper.logInfo(fileName, fnName, `Croning With User Id : ${userId}`);
        if (!connectBank.accountId || !connectBank.type || !connectBank.providerAccountId || !connectBank.accountName)
            return;
        if (!BankType[connectBank.type]) {
            return;
        }
        if (!connectBank.accountId && !connectBank.accountName && !connectBank.providerAccountId)
            return;
        let bankId = connectBank.providerId ? parseInt(connectBank.providerId) : 0;
        let fromDate = moment().subtract(month, 'month');
        let endDate = moment();

        while (endDate.diff(fromDate) >= 0) {
            console.log('start =========================================>');
            LogHelper.logInfo(fileName, fnName, 'get transaction from yodlee =>>>>>>>>>>>>>>' + fromDate.format('M'));
            // len server yodlee get transaction ve
            let transactionsYodlee = await this.getTransactionsByMonth(userId, parseInt(fromDate.format('M')), parseInt(fromDate.format('Y')), connectBank.type, String(connectBank.accountId));
            LogHelper.logInfo(fileName, fnName, 'transaction get from yodlee =====>' + ' ' + transactionsYodlee.length);
            // have running balance?
            transactionsYodlee = this.createTransactionList(transactionsYodlee, userId, bankId);
            let statements = await BusinessLoader.statementBusiness.find({
                userId: userId,
                type: connectBank.type,
                month: fromDate.format('M').toString(),
                year: fromDate.format('Y').toString()
            });

            LogHelper.logInfo(fileName, fnName, 'statement month' + '-' + fromDate.format('M') + '=>' + statements);
            // if not transaction on db => create
            if (statements.length === 0) {
                LogHelper.logInfo(fileName, fnName, 'statemt not create ====> create and update transaction===>');
                let openBalance = connectBank.currentBalance;
                let closingBalance = openBalance;
                if (transactionsYodlee.length !== 0) {
                    LogHelper.logInfo(fileName, fnName, 'fist item in transaction yodlee' + transactionsYodlee[0]);
                    let isHaveRunningBalance = true;
                    if (connectBank.type === BankType.Bank) {
                        for (let index = 0; index < transactionsYodlee.length; index++) {
                            const element = transactionsYodlee[index];
                            if (!element.runningBalance) {
                                isHaveRunningBalance = false;
                                break;
                            }
                        }
                    }
                    else {
                        isHaveRunningBalance = false;
                    }

                    if (!isHaveRunningBalance) {
                        LogHelper.logInfo(fileName, fnName, 'not have runing balance');
                        let dateLastMonth = moment(fromDate).subtract(1, 'month');
                        let lastStatement = await BusinessLoader.statementBusiness.find({
                            userId: userId,
                            type: connectBank.type,
                            month: dateLastMonth.format('M').toString(),
                            year: dateLastMonth.format('Y').toString()
                        }
                        );
                        if (lastStatement.length === 0)
                            return;
                        openBalance = lastStatement[0].closeBalance;
                        LogHelper.logInfo(fileName, fnName, 'caculator transaction with not have running balance ============>');
                        transactionsYodlee = this.caculatorTransactionWithOpenBalance(transactionsYodlee, openBalance);// tinh 1 thang
                        LogHelper.logInfo(fileName, fnName, 'after caculator transaction yodlee====>' + transactionsYodlee[transactionsYodlee.length - 1]);
                        closingBalance = transactionsYodlee[transactionsYodlee.length - 1].runningBalance.amount;
                    }
                    else {
                        LogHelper.logInfo(fileName, fnName, 'handler with running blance => sort running balance');
                        transactionsYodlee = this.sortTransactionOneMonth(transactionsYodlee);

                        let total = transactionsYodlee[0].runningBalance.amount ? transactionsYodlee[0].runningBalance.amount : 0; ;
                        let value = transactionsYodlee[0].amount.amount;
                        let balance = transactionsYodlee[0].baseType === 'DEBIT' ? + (total + value).toFixed(5) : (total - value).toFixed(5);
                        openBalance = Number(balance);
                        closingBalance = transactionsYodlee[transactionsYodlee.length - 1].runningBalance.amount;
                    }
                    let transactionsCreate = this.createTransactionList(transactionsYodlee, userId, bankId);
                    BusinessLoader.transactionBusiness.createTransactions(transactionsCreate);
                }
                let statementCreate = new StatementCreate(<IStatement>{
                    userId: userId,
                    accountId: String(connectBank.accountId),
                    closeBalance: closingBalance,
                    openBalance: openBalance,
                    month: parseInt(fromDate.format('M')),
                    year: parseInt(fromDate.format('Y')),
                    type: connectBank.type
                });
                let crunchCreate = new CrunchCreate(<any>{
                    userId: userId,
                    accountId: connectBank.accountId,
                    month: parseInt(fromDate.format('M')),
                    year: parseInt(fromDate.format('Y')),
                    type: connectBank.type,
                    coaAmounts: []
                });
                BusinessLoader.statementBusiness.create(statementCreate);
                BusinessLoader.crunchBusiness.create(crunchCreate);

                // with transaction have not running balance
            }// if have transaction on db => compare transaction get to yodlee
            else {
                // find new transaction
                if (transactionsYodlee.length !== 0) {
                    let transactionsDB = await BusinessLoader.transactionBusiness.getTransactionsByMonth(userId, String(connectBank.accountId), connectBank.type, parseInt(fromDate.format('M')), parseInt(fromDate.format('Y')));
                    let transactionNew = _.differenceBy(transactionsYodlee, transactionsDB, 'transactionId');
                    LogHelper.logInfo(fileName, fnName, 'transaction on DB' + ':' + transactionsDB.length);
                    LogHelper.logInfo(fileName, fnName, 'transaction new' + ':' + transactionNew.length);
                    let isHaveRunningBalance = transactionsYodlee[0].runningBalance ? true : false;
                    if (connectBank.type === BankType.CreditCard)
                        isHaveRunningBalance = false;
                    if (isHaveRunningBalance && transactionNew.length !== 0) {
                        LogHelper.logInfo(fileName, fnName, 'handler with have running balance ==========>');
                        console.log('Transaction New index 0 ===>', transactionNew[0]);
                        let date = transactionNew[0].date;
                        let startOfMonth = moment(date).startOf('month');
                        let endOfMonth = moment(date).endOf('month');
                        let index = startOfMonth;
                        let dateClosingBalance = transactionsDB.length !== 0 ? moment(transactionsDB[transactionsDB.length - 1].date) : moment(date);
                        let dateOpenBalance = transactionsDB.length !== 0 ? moment(transactionsDB[0].date) : moment(date);
                        transactionNew.forEach(item => {
                            let dateTransaction = moment(item.date);
                            if (dateTransaction.diff(dateClosingBalance) > 0)
                                dateClosingBalance = dateTransaction;
                            if (dateTransaction.diff(dateOpenBalance) < 0)
                                dateOpenBalance = dateTransaction;
                        });

                        while (endOfMonth.diff(index) > 0) {
                            let transactionsOneDayNew = _.filter(transactionNew, function(transaction) {
                                return moment(transaction.date).diff(index) === 0;
                            });

                            if (transactionsOneDayNew.length !== 0) {
                                let TransactionsCreateNew: any = [];
                                let transactionsOneDayOld = _.filter(transactionsDB, function(transaction) {
                                    return moment(transaction.date).diff(index) === 0;
                                });
                                let transactionsTotal = transactionsOneDayOld.concat(transactionsOneDayNew);
                                transactionsTotal = this.sortTransactionOneDay(transactionsTotal);
                                for (let i = 0; i < transactionsTotal.length; i++) {
                                    let element = transactionsTotal[i];
                                    let newIndex = _.findIndex(transactionsOneDayOld, (transaction) => {
                                        return (transaction.transactionId === element.transactionId);
                                    });
                                    if (newIndex === -1 && !element._id) {
                                        LogHelper.logInfo(fileName, fnName, 'create new transaction =====>' + ' ' + _.pick(TransactionsCreateNew, 'transactionId'));
                                        TransactionsCreateNew.push(element);
                                    }
                                    else {
                                        if (transactionsOneDayOld[newIndex]._id && element.index !== transactionsOneDayOld[newIndex].index) {
                                            LogHelper.logInfo(fileName, fnName, 'update transaction =====>' + ' ' + _.pick(transactionsOneDayOld[newIndex], 'transactionId'));
                                            BusinessLoader.transactionBusiness.update(transactionsOneDayOld[newIndex]._id, {index: element.index});
                                        }
                                    }
                                }

                                BusinessLoader.transactionBusiness.createTransactions(TransactionsCreateNew);

                                if (dateOpenBalance.diff(index) === 0) {
                                    let total = transactionsTotal[0].runningBalance.amount ? transactionsTotal[0].runningBalance.amount : 0; ;
                                    let value = transactionsTotal[0].amount.amount;
                                    let balance = transactionsTotal[0].baseType === 'DEBIT' ? + (total + value).toFixed(5) : (total - value).toFixed(5);
                                    let openBalance = Number(balance);
                                    BusinessLoader.statementBusiness.update(statements[0]._id, {openBalance: openBalance});
                                }
                                if (dateClosingBalance.diff(index) === 0) {
                                    let closingBalance = transactionsTotal[transactionsTotal.length - 1].runningBalance.amount;
                                    BusinessLoader.statementBusiness.update(statements[0]._id, {closeBalance: closingBalance});
                                }
                            }

                            index.add(1, 'day');
                        }
                    }
                    else {
                        LogHelper.logInfo(fileName, fnName, 'handler with not have running balance =====>');
                        let minDay = moment(fromDate).startOf('month');
                        if (transactionsDB.length !== 0) {
                            let transactionFirst = transactionsDB[transactionsDB.length - 1];// ? 0
                            LogHelper.logInfo(fileName, fnName, 'transaction first ========>' + transactionFirst);
                            let value = transactionFirst.amount.amount;
                            let balance = transactionFirst.runningBalance.amount;
                            let tempOpenbalance = transactionFirst.baseType === 'DEBIT' ? + (balance + value).toFixed(5) : (balance - value).toFixed(5);
                            tempOpenbalance = Number(tempOpenbalance);// fix o day
                            LogHelper.logInfo(fileName, fnName, 'statements Open Balance' + statements[0]);
                            if ((statements[0].openBalance - tempOpenbalance) !== 0 || transactionNew.length !== 0) {// quay lai sau
                                if (transactionNew.length !== 0) { // not change transaction and balance => not update
                                    minDay = transactionNew[0].date;
                                    transactionNew.forEach(transaction => {
                                        if (moment(minDay).diff(moment(transaction.date)) > 0)
                                            minDay = transaction.date;
                                    });
                                }
                                LogHelper.logInfo(fileName, fnName, 'Min day =>>>>' + minDay);
                                let transactionNotUpdate: any = [];// use blance day not change
                                let transactionUpdate: any = [];// transaction create and update
                                transactionsDB.forEach(item => {
                                    if (moment(item.date).diff(moment(minDay)) < 0)
                                        transactionNotUpdate.push(item);
                                    else
                                        transactionUpdate.push(item);
                                });
                                transactionUpdate = transactionUpdate.concat(transactionNew);
                                let openBalance = statements[0].openBalance;
                                transactionNotUpdate.forEach(item => {
                                    let value = item.amount.amount;
                                    let balance = item.baseType === 'DEBIT' ? + (openBalance - value).toFixed(5) : (openBalance + value).toFixed(5);
                                    openBalance = Number(balance);
                                });
                                LogHelper.logInfo(fileName, fnName, 'trasanction Update' + transactionUpdate.length);
                                LogHelper.logInfo(fileName, fnName, 'transaction not update ' + transactionNotUpdate.length);
                                transactionUpdate = this.caculatorTransactionWithOpenBalance(transactionUpdate, openBalance);
                                LogHelper.logInfo(fileName, fnName, 'trasanction Update after caculator' + transactionUpdate.length);
                                console.log('====>', transactionUpdate.lenth);
                                let closingBalance = transactionUpdate[transactionUpdate.length - 1].runningBalance.amount;
                                // update close balance
                                LogHelper.logInfo(fileName, fnName, 'statement update' + statements[0]);
                                await BusinessLoader.statementBusiness.update(statements[0]._id, {closeBalance: closingBalance});
                                let nextMonth = moment(fromDate).add(1, 'month');
                                let nextStatement = await BusinessLoader.statementBusiness.find({
                                    userId: userId,
                                    type: connectBank.type,
                                    month: nextMonth.format('M').toString(),
                                    year: nextMonth.format('Y').toString()
                                }
                                );
                                if (nextStatement.length !== 0) {
                                    LogHelper.logInfo(fileName, fnName, 'update for next statement' + nextStatement);
                                    await BusinessLoader.statementBusiness.update(nextStatement[0]._id, {openBalance: closingBalance});
                                }
                                // update transaction
                                let transactionsCreate: any = [];
                                transactionUpdate.forEach(transaction => {
                                    if (transaction._id) {
                                        LogHelper.logInfo(fileName, fnName, 'update with transaction id' + transaction._id);
                                        BusinessLoader.transactionBusiness.update(transaction._id, _.pick(transaction, ['index', 'runningBalance']));
                                    }
                                    else
                                        transactionsCreate.push(transaction);
                                });
                                if (TransactionCreate.length !== 0) {
                                    LogHelper.logInfo(fileName, fnName, 'create new transaction to db :' + transactionsCreate.length + 'transaction');
                                    BusinessLoader.transactionBusiness.createTransactions(transactionsCreate);
                                }
                            }
                        }
                        else {
                            LogHelper.logInfo(fileName, fnName, 'not have runing balance');
                            let dateLastMonth = moment(fromDate).subtract(1, 'month');
                            let lastStatement = await BusinessLoader.statementBusiness.find({
                                userId: userId,
                                type: connectBank.type,
                                month: dateLastMonth.format('M').toString(),
                                year: dateLastMonth.format('Y').toString()
                            });
                            if (lastStatement.length === 0)
                                return;
                            let openBalance = lastStatement[0].closeBalance;
                            LogHelper.logInfo(fileName, fnName, 'caculator transaction with not have running balance ============>');
                            transactionsYodlee = this.caculatorTransactionWithOpenBalance(transactionsYodlee, openBalance);// tinh 1 thang
                            LogHelper.logInfo(fileName, fnName, 'after caculator transaction yodlee====>' + transactionsYodlee[transactionsYodlee.length - 1]);
                            let closingBalance = transactionsYodlee[transactionsYodlee.length - 1].runningBalance.amount;
                            let transactionsCreate = this.createTransactionList(transactionsYodlee, userId, bankId);
                            BusinessLoader.transactionBusiness.createTransactions(transactionsCreate);
                            BusinessLoader.statementBusiness.update(statements[0]._id, {openBalance: openBalance, closeBalance: closingBalance});
                        }
                    }
                }
            }

            fromDate.add(1, 'month');
        }
    }

    async updateOpenBalaceManual(userId: string, accountId: string, month: number, year: number, type: BankType, openBalance: number): Promise<boolean> {
        const fnName = 'updateBalaceManual';

        LogHelper.logInfo(fileName, fnName, `Update Balance Manual : ${userId}`);

        if (!userId || !month || !year || !type || !accountId) {
            LogHelper.logError(fileName, fnName, `Update Balance Manual : ${userId}||${month}||${year}||${type}||${openBalance}|| ${accountId}`);
            return false;
        }

        if (isNaN(openBalance)) {
            LogHelper.logError(fileName, fnName, `Update Balance Manual : open Balance is not a number`);
            return false;
        }

        if (!BankType[type]) {
            LogHelper.logError(fileName, fnName, `Update Balance Manual : Bank type not exits!`);
            return false;
        }

        let statements = await BusinessLoader.statementBusiness.find({
            userId: userId,
            type: type
        });
        if (statements.length === 0) {
            LogHelper.logError(fileName, fnName, `Update Balance Manual : statement not exits!`);
            return false;
        }

        statements.sort((first, next) => {
            if (first.year === next.year)
                return first.month - next.month;
            else
                return first.year - next.year;
        });

        let indexStatement = _.findIndex(statements, statement => {
            return (statement.month === month && statement.year === year);
        });

        if (indexStatement === -1) {
            LogHelper.logError(fileName, fnName, `Update Balance Manual : not find statment with month and year`);
            return false;
        }
        let openNext = openBalance;
        let closeBack = openBalance;
        for (let index = indexStatement; index < statements.length; index++) {
            console.log('caculator positive ======>');
            let statement = statements[index];
            let transactions = await BusinessLoader.transactionBusiness.getTransactionsByMonth(userId, accountId, type, statement.month, statement.year);
            transactions = this.caculatorTransactionWithOpenBalance(transactions, openNext);
            let closingBalance = transactions.length > 0 ? transactions[transactions.length - 1].runningBalance.amount : openNext;
            LogHelper.logInfo(fileName, fnName, `update closeBalance ${closingBalance} openBalance ${openNext} in statement ${statement._id}  -- ${statement.month} -- ${statement.year}`);

            await BusinessLoader.statementBusiness.update(statement._id, {closeBalance: closingBalance, openBalance: openNext});
            transactions.forEach(transaction => {
                if (transaction._id) {
                    LogHelper.logInfo(fileName, fnName, 'update with transaction id' + transaction._id);
                    BusinessLoader.transactionBusiness.update(transaction._id, _.pick(transaction, ['index', 'runningBalance']));
                }
            });
            openNext = closingBalance;
        }
        for (let index = indexStatement - 1; index >= 0; index--) {
            console.log('caculator negative ======>');

            let statement = statements[index];
            let transactions = await BusinessLoader.transactionBusiness.getTransactionsByMonth(userId, accountId, type, statement.month, statement.year);
            transactions = this.caculatorTransactionWithClosingBalance(transactions, closeBack);
            let balanceOpen = closeBack;

            if (transactions.length > 0) {
                let total = transactions[transactions.length - 1].runningBalance.amount ? transactions[transactions.length - 1].runningBalance.amount : 0; ;
                let value = transactions[transactions.length - 1].amount.amount;
                let balance = transactions[transactions.length - 1].baseType === 'DEBIT' ? + (total + value).toFixed(5) : (total - value).toFixed(5);
                balanceOpen = Number(balance);
            }

            LogHelper.logInfo(fileName, fnName, `update closeBalance ${closeBack} openBalance ${balanceOpen} in statement ${statement._id}  -- ${statement.month} -- ${statement.year}`);
            await BusinessLoader.statementBusiness.update(statement._id, {closeBalance: closeBack, openBalance: balanceOpen});
            transactions.forEach(transaction => {
                if (transaction._id) {
                    LogHelper.logInfo(fileName, fnName, 'update with transaction id' + transaction._id);
                    BusinessLoader.transactionBusiness.update(transaction._id, _.pick(transaction, ['index', 'runningBalance']));
                }
            });
            closeBack = balanceOpen;
        }
        return true;
    }

    //
    async updateOpenBalaceMultiBank(userId: string, accountId: string, month: number, year: number, type: BankType, openBalance: number): Promise<any> {
        const fnName = 'updateBalaceManual';

        LogHelper.logInfo(fileName, fnName, `Update Balance Manual : ${userId}`);

        if (!userId || !accountId || !month || !year || !type) {
            LogHelper.logError(fileName, fnName, `Update Balance Manual : ${userId}||${accountId}||${month}||${year}||${type}||${openBalance}||`);
            return false;
        }

        if (isNaN(openBalance)) {
            LogHelper.logError(fileName, fnName, `Update Balance Manual : open Balance is not a number`);
            return false;
        }

        if (!BankType[type]) {
            LogHelper.logError(fileName, fnName, `Update Balance Manual : Bank type not exits!`);
            return false;
        }

        let statements = await BusinessLoader.statementBusiness.find({
            userId: userId,
            accountId: accountId,
            type: type
        });

        if (statements.length === 0) {
            LogHelper.logError(fileName, fnName, `Update Balance Manual : statement not exits!`);
            return false;
        }

        statements.sort((first, next) => {
            if (first.year === next.year)
                return first.month - next.month;
            else
                return first.year - next.year;
        });

        let indexStatement = _.findIndex(statements, statement => {
            return (statement.month === month && statement.year === year);
        });

        if (indexStatement === -1) {
            LogHelper.logError(fileName, fnName, `Update Balance Manual : not find statment with month and year`);
            return false;
        }
        let openNext = openBalance;
        let closeBack = openBalance;

        for (let index = indexStatement; index < statements.length; index++) {
            console.log('caculator positive =======>');
            let statement = statements[index];
            let transactions = await BusinessLoader.transactionBusiness.getTransactionsByMonth(userId, accountId, type, statement.month, statement.year);
            transactions = this.caculatorTransactionWithOpenBalance(transactions, openNext);
            let closingBalance = transactions.length > 0 ? transactions[transactions.length - 1].runningBalance.amount : openNext;
            LogHelper.logInfo(fileName, fnName, `Update closeBalance ${closingBalance} openBalance ${openNext} in statement ${statement._id}  -- ${statement.month} -- ${statement.year}`);

            await BusinessLoader.statementBusiness.update(statement._id, {closeBalance: closingBalance, openBalance: openNext});
            transactions.forEach(transaction => {
                if (transaction._id) {
                    LogHelper.logInfo(fileName, fnName, 'Update with transaction id' + transaction._id);
                    BusinessLoader.transactionBusiness.update(transaction._id, _.pick(transaction, ['index', 'runningBalance']));
                }
            });
            openNext = closingBalance;
        }
        for (let index = indexStatement - 1; index >= 0; index--) {
            console.log('caculator negative =======>');

            let statement = statements[index];
            let transactions = await BusinessLoader.transactionBusiness.getTransactionsByMonth(userId, accountId, type, statement.month, statement.year);
            transactions = this.caculatorTransactionWithClosingBalance(transactions, closeBack);
            let balanceOpen = closeBack;

            if (transactions.length > 0) {
                let total = transactions[transactions.length - 1].runningBalance.amount ? transactions[transactions.length - 1].runningBalance.amount : 0; ;
                let value = transactions[transactions.length - 1].amount.amount;
                let balance = transactions[transactions.length - 1].baseType === 'DEBIT' ? + (total + value).toFixed(5) : (total - value).toFixed(5);
                balanceOpen = Number(balance);
            }

            LogHelper.logInfo(fileName, fnName, `Update closeBalance ${closeBack} openBalance ${balanceOpen} in statement ${statement._id}  -- ${statement.month} -- ${statement.year}`);
            await BusinessLoader.statementBusiness.update(statement._id, {closeBalance: closeBack, openBalance: balanceOpen});
            transactions.forEach(transaction => {
                if (transaction._id) {
                    LogHelper.logInfo(fileName, fnName, 'update with transaction id' + transaction._id);
                    BusinessLoader.transactionBusiness.update(transaction._id, _.pick(transaction, ['index', 'runningBalance']));
                }
            });
            closeBack = balanceOpen;
        }
        return true;
    }

    async calcAndUpdateStatementWithClosing(transactions: any, closingBalance: number, statementId: string) {
        let openBalance;

        if (transactions.length > 0) {
            for (let i = 0; i < transactions.length; i++) {
                let total = closingBalance;
                let value = transactions[i].amount.amount;
                let balance = transactions[i].baseType === 'DEBIT' ? + (total + value).toFixed(5) : (total - value).toFixed(5);
                openBalance = Number(balance);

                if (transactions.length === 1) {
                    console.log(openBalance);
                    await BusinessLoader.statementBusiness.update(statementId, {openBalance: openBalance});
                }

                transactions.shift();
                await this.calcAndUpdateStatementWithClosing(transactions, openBalance, statementId);
                break;
            }
        }

        return true;
    }
    //

    async addBank(userId: string, providerId: string, loginForm: any) {
        const fnName = 'Add Bank';
        LogHelper.logInfo(fileName, fnName, `Adding Bank With User Id : ${userId} - ProviderId:${providerId} -- ${JSON.stringify(loginForm)}`);
        let yodleeAccount = await BusinessLoader.userBusiness.getYodleeAccountByUserId(userId);
        let addBank = await YodleeHelper.addBank(yodleeAccount.user, yodleeAccount.password, providerId, loginForm);
        if (addBank && addBank.providerAccount && addBank.refreshInfo) {
            let refreshInfo = addBank.providerAccount.refreshInfo;
            if (refreshInfo.status === 'FAILED') {
                let log = new LogCreate(<any>{
                    module: LogModule.Yodlee,
                    userId: userId,
                    description: 'add bank error with providerId : ' + providerId,
                    detail: addBank,
                    status: LogStatus.Error,
                    action: LogAction.AddBank
                });
                BusinessLoader.logBusiness.create(log).catch(err => {
                    console.log(err);
                });
            }
            if (refreshInfo.status === 'SUCCESS') {
                let log = new LogCreate(<any>{
                    userId: userId,
                    module: LogModule.Yodlee,
                    description: 'add bank success with providerId : ' + providerId,
                    status: LogStatus.Success,
                    action: LogAction.AddBank,
                    detail: {...addBank, providerId: providerId}
                });
                BusinessLoader.logBusiness.create(log).catch(err => {
                    console.log(err);
                });
            }
        }
        return addBank;
    }

    async createAccount(userId: string, email: string) {
        const fnName = 'Create Account Yodlee';
        LogHelper.logInfo(fileName, fnName, `Creating Account With User Id : ${userId} And Email:${email}`);
        let yodleeAccount = await YodleeHelper.createAccount(userId, email);
        console.log('yodleeAccount =>>>>>>>>>>>>>>>>', yodleeAccount);
        return yodleeAccount;
    }

    async removeBank(userId: string, providerAccountId: string) {
        let yodleeAccount = await BusinessLoader.userBusiness.getYodleeAccountByUserId(userId);
        let removeBank = await YodleeHelper.removeBank(yodleeAccount.user, yodleeAccount.password, providerAccountId);
        return removeBank;
    }

    async getProviderById(userId: string, providerId: string): Promise<any> {
        const fnName = 'Get Provider By Id';
        LogHelper.logInfo(fileName, fnName, `Geting Providers With User Id : ${userId} And ProviderId:${providerId}`);
        let yodleeAccount = await BusinessLoader.userBusiness.getYodleeAccountByUserId(userId);
        let provider = await YodleeHelper.getProviderById(yodleeAccount.user, yodleeAccount.password, providerId);
        return provider;
    }

    async getBankAccounts(userId: string): Promise<any> {
        const fnName = 'Get Bank Account';
        LogHelper.logInfo(fileName, fnName, `Geting All Account With User Id : ${userId}`);
        let yodleeAccount = await BusinessLoader.userBusiness.getYodleeAccountByUserId(userId);
        LogHelper.logInfo(fileName, fnName, `Geting All Account With LoginName : ${yodleeAccount.user}`);
        let bankAccounts = await YodleeHelper.getBankAccounts(yodleeAccount.user, yodleeAccount.password);
        console.log(userId, 'bank account ===>', bankAccounts);
        return bankAccounts;
    }

    createTransactionList(transactions: any[], userId: string, bankId: number): TransactionCreate[] {
        return transactions.map(item => {
            let month = moment(item.date).format('M');
            let year = moment(item.date).format('Y');
            return new TransactionCreate({
                ...item,
                type: item.CONTAINER ? (item.CONTAINER === 'bank' ? BankType.Bank : BankType.CreditCard) : item.type,
                transactionId: item.id ? item.id : item.transactionId,
                userId: userId,
                month: month,
                year: year,
                bankId: bankId
            });
        });
    }

    caculatorTransactionWithClosingBalance(transactions: any[], closingBalance: number) {
        let fnName = 'caculator with closebalance';
        LogHelper.logInfo(fileName, fnName, 'start caculator');
        if (transactions.length === 0) {
            return [];
        }
        let date = transactions[0].date;
        let startOfMonth = moment(date).startOf('month');
        let endOfMonth = moment(date).endOf('month');
        let index = moment(endOfMonth.format('YYYY-MM-DD'));
        let transactionsMonth = [];

        while (startOfMonth.diff(index) <= 0) {
            LogHelper.logInfo(fileName, fnName, 'day caculator transaction' + index);
            let transactionsOneDay = _.filter(transactions, function(transaction) {
                return moment(transaction.date).format('YYYY-MM-DD') === index.format('YYYY-MM-DD');
            });
            LogHelper.logInfo(fileName, fnName, 'day =>' + index + '--' + transactionsOneDay.length);
            if (transactionsOneDay.length !== 0) {
                transactionsOneDay = this.caculatorTransactionDayWithClosingBalance(transactionsOneDay, closingBalance);

                transactionsMonth = transactionsMonth.concat(transactionsOneDay);
                let total = transactionsOneDay[transactionsOneDay.length - 1].runningBalance.amount ? transactionsOneDay[transactionsOneDay.length - 1].runningBalance.amount : 0; ;
                let value = transactionsOneDay[transactionsOneDay.length - 1].amount.amount;
                let balance = transactionsOneDay[transactionsOneDay.length - 1].baseType === 'DEBIT' ? + (total + value).toFixed(5) : (total - value).toFixed(5);
                closingBalance = Number(balance);
            }

            index.subtract(1, 'day');
        }
        return transactionsMonth;
    }

    caculatorTransactionWithOpenBalance(transactions: any[], openBalance: number) {
        let fnName = 'caculator with openBalance';
        LogHelper.logInfo(fileName, fnName, 'start caculator');
        if (transactions.length === 0) {
            return [];
        }
        console.log('number transaction caculator ====>', transactions.length);
        // for (let index = 0; index < transactions.length; index++) {
        //     const element = transactions[index];
        //     console.log(element.date.toString());
        // }
        let sortTransactions = _.orderBy(transactions, (transaction: any) => {
            return moment(transaction.date).format('YYYY-MM-DD');
        }, ['asc']);
        let dateStart = sortTransactions[0].date;
        let dateEnd = sortTransactions[sortTransactions.length - 1].date;

        let startOfMonth = moment(dateStart).startOf('month');
        let endOfMonth = moment(dateEnd).endOf('month');
        let index = moment(startOfMonth.format('YYYY-MM-DD'));
        let transactionsMonth = [];
        while (endOfMonth.diff(index) >= 0) {
            LogHelper.logInfo(fileName, fnName, 'day caculator transaction ' + index);
            let transactionsOneDay = _.filter(transactions, function(transaction) {
                return moment(transaction.date).format('YYYY-MM-DD') === index.format('YYYY-MM-DD');
            });

            LogHelper.logInfo(fileName, fnName, 'day => ' + index.format('YYYY-MM-DD') + '| number transaction ==> ' + transactionsOneDay.length);
            if (transactionsOneDay.length !== 0) {
                transactionsOneDay = this.caculatorTransactionDayWithOpenBalance(transactionsOneDay, openBalance);
                transactionsMonth = transactionsMonth.concat(transactionsOneDay);
                console.log(transactionsOneDay[transactionsOneDay.length - 1]);
                openBalance = Number(transactionsOneDay[transactionsOneDay.length - 1].runningBalance.amount);
            }

            index.add(1, 'day');
        }
        return transactionsMonth;
    }

    // dau tien la ngay cao nhat => index cao nhat
    caculatorTransactionDayWithClosingBalance(transactions: any[], closingBalance: number) {
        if (transactions.length === 0)
            return [];
        let result = transactions.map((transaction, index) => {
            let runningBalanceMap = {
                currency: 'AUD',
                amount: closingBalance
            };

            let value = transaction.amount.amount;
            let runningBalance = transaction.baseType === 'DEBIT' ? + (closingBalance + value).toFixed(5) : (closingBalance - value).toFixed(5);
            closingBalance = Number(runningBalance);
            let indexNumber = transactions.length - 1 - index;
            return {...transaction, index: indexNumber, runningBalance: runningBalanceMap};
        });
        return result;
    }

    caculatorTransactionDayWithOpenBalance(transactions: any[], openBalance: number) {
        console.log(transactions, openBalance);
        if (transactions.length === 0)
            return [];
        let result = transactions.map((transaction, index) => {
            let value = transaction.amount.amount;
            let runningBalance = transaction.baseType === 'DEBIT' ? + (openBalance - value).toFixed(5) : (openBalance + value).toFixed(5);
            openBalance = Number(runningBalance);
            let runningBalanceMap = {
                currency: 'AUD',
                amount: openBalance
            };
            // let indexNumber = transactions.length - 1 - index;
            return {...transaction, index: index, runningBalance: runningBalanceMap};
        });
        return result;
    }

    sortTransactionOneMonth(transactions: Array<any>) {
        let fnName = 'Sort transaction one month';
        LogHelper.logInfo(fileName, fnName, 'start sort');
        LogHelper.logInfo(fileName, fnName, 'number transacion for sort' + transactions.length);
        if (transactions.length === 0)
            return [];

        let date = transactions[0].date;
        let startOfMonth = moment(date).startOf('month');
        let endOfMonth = moment(date).endOf('month');
        let index = startOfMonth;
        let transactionsMonth: Array<any> = [];

        while (endOfMonth.diff(index) >= 0) {
            let transactionsOneDay = _.filter(transactions, function(transaction) {
                return moment(transaction.date).diff(index) === 0;
            });

            if (transactionsOneDay.length !== 0) {
                transactionsOneDay = this.sortTransactionOneDay(transactionsOneDay);
            }

            transactionsMonth = transactionsMonth.concat(transactionsOneDay);
            index.add(1, 'day');
        }
        LogHelper.logInfo(fileName, fnName, 'end sort one month ===========>');
        if (transactionsMonth.length !== 0) {
            return transactionsMonth;
            // let total = transactionsMonth[0].runningBalance.amount ? transactionsMonth[0].runningBalance.amount : 0; ;
            // let value = transactionsMonth[0].amount.amount;
            // let openBlance = transactionsMonth[0].baseType === 'DEBIT' ? + (total + value).toFixed(5) : (total - value).toFixed(5);
            // openBlance = Number(openBlance);
            // let closeBlance = transactionsMonth[transactionsMonth.length - 1].runningBalance.amount;
            // transactionsMonth = transactionsMonth.map((item, index) => {
            //     if (index !== 0) {
            //         let caculater = `${transactionsMonth[index - 1].runningBalance.amount}  ${(item.baseType === 'DEBIT' ? '-' : '+')}  ${item.amount.amount} ==>  ${item.runningBalance.amount}`;
            //         return {...item, openBalanceMonth: openBlance, closingBalanceMonth: close};
            //     }
            //     else {
            //         let caculater = `${openBlance} ${(item.baseType === 'DEBIT' ? '-' : '+')}  ${item.amount.amount} ==>  ${item.runningBalance.amount}`;
            //         return {...item, caculate: caculater};
            //     }
            // });
        }
        return transactions;
    }

    sortTransactionOneDay(transactions: Array<any>) {
        let arrSort: Array<any> = [];
        LogHelper.logInfo(fileName, 'sortTransactionOneDay', 'number transacion for sort' + transactions.length);
        for (let i = 0; i < transactions.length; i++) {
            let transaction = transactions[i];
            let isCossTransactionAccount = false;
            let index = _.findIndex(transactions, function(item) {
                if (!item || !item.runningBalance) {
                    isCossTransactionAccount = true;
                    LogHelper.logWarn(fileName, 'sortTransactionOneDay', 'maybe have issue cross transaction' + item.id);
                    return true;
                }
                let total = item.runningBalance.amount;
                let value = item.amount.amount;
                let currentBalance = item.baseType === 'DEBIT' ? + (total + value).toFixed(5) : (total - value).toFixed(5);
                currentBalance = Number(currentBalance);

                return transaction.runningBalance.amount - currentBalance === 0;
            });
            if (isCossTransactionAccount)
                break;

            if (index === -1) {
                arrSort = this.sort([], transactions, transaction);
            }
        }
        return arrSort.length === 0 ? transactions : arrSort;
    }

    sort(transactionsSort: Array<any>, transactions: Array<any>, fistItem) {
        let fnName = 'sort';
        // start sort
        if (transactionsSort.length === 0)
            transactionsSort.push(fistItem);
        // sort finish!
        if (transactionsSort.length >= transactions.length) {
            transactionsSort = _.reverse(transactionsSort);
            return transactionsSort.map((transaction, index) => {
                return {...transaction, index: index};
            });
        }

        let transactionsTemp = _.difference(transactions, transactionsSort);
        let itemEnd = transactionsSort[transactionsSort.length - 1];
        if (!itemEnd.runningBalance)
            return transactionsSort.concat(transactionsTemp);
        // find index next!
        let isCrossTransaction = false;
        let indexItemNext = _.findIndex(transactionsTemp, function(item) {
            if (!item.runningBalance) {
                isCrossTransaction = true;
                return true;
            }
            let total = itemEnd.runningBalance.amount;
            let value = itemEnd.amount.amount;
            let currentBalance = itemEnd.baseType === 'DEBIT' ? + (total + value).toFixed(5) : (total - value).toFixed(5);
            currentBalance = Number(currentBalance);
            if (item.runningBalance.amount === currentBalance)
                return item.runningBalance.amount - currentBalance === 0;
        });
        if (isCrossTransaction)
            return transactionsSort.concat(transactionsTemp);
        // find sucess index next => find next next
        if (indexItemNext !== -1) {
            transactionsSort.push(transactionsTemp[indexItemNext]);
            return this.sort(transactionsSort, transactions, fistItem);
        }
        else {// do not find index => data not logic => return
            LogHelper.logWarn(fileName, fnName, 'data not logic');
            return transactionsSort.concat(transactionsTemp);
        }
    }

    createTransactionFixData() {
        BusinessLoader.transactionBusiness.createTransactionFixData();
    }

    async sendMailDuplicateTrasaction(): Promise<any> {
        let devOpsList = Project.DEVELOPERS;

        let fromData = {
            email: 'dev@namtech.com.au',
            name: 'Dev Namtech'
        };
        let nameFile = 'transaction-issue' + moment().format('DD-MM-YY') + '.txt';
        let fileUrl = `${Project.SERVER.BANK_SERVICE.PROTOTYPE}://${Project.SERVER.BANK_SERVICE.DOMAIN}/logs/${nameFile}`;

        let date = moment().format('DD-MM-YY');

        let content = `<p>Hi Team</p><br>`
                    + `This is issue transaction date ${date}<br>`
                    + fileUrl
                    + `<br>`
                    + `Thank for Team!`;
        let result;
        try {
            result = await MailHelper.sendMailAdvanced(fromData, devOpsList, 'Transaction Issue', content);
        }
        catch (e) {
            console.log(e);
        }
        return result;
    }

    async markTransactionFixDuplicate(userId: string, month: number, year:number, accountId: string, type: BankType): Promise<any> {
        let user = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            return false;
        let transactionsDB:any = await BusinessLoader.transactionBusiness.getTransactionsByMonth(userId, accountId, type, month, year);
        for (let index = 0; index < transactionsDB.length; index++) {
            const element = transactionsDB[index];
            await BusinessLoader.transactionBusiness.markTransactionFixDuplicate(element._id);
        }
    }

    async syncTransactionWhenFixDuplicate(userId: string, month: number, year:number, accountId:string, type: BankType): Promise<any> {
        let user = await BusinessLoader.userBusiness.get(userId);
        if (!user)
            return false;

        let transactionsYodlee = await this.getTransactionsByMonth(userId, month, year, type, accountId);
        transactionsYodlee = transactionsYodlee.map(item => item.id.toString());

        let transactionsDB:any = await BusinessLoader.transactionBusiness.getTransactionsByMonth(userId, accountId, type, month, year);

        transactionsDB = transactionsDB.map(item => item.transactionId.toString());

        if (transactionsDB.length === transactionsYodlee.length)
            return false;
        console.log('=====>', transactionsDB.length, transactionsYodlee.length);
        let transactionUpdate = _.difference(transactionsDB, transactionsYodlee);
        let transactionCreate = _.difference(transactionsYodlee, transactionsDB);
        for (let index = 0; index < transactionCreate.length; index++) {
            const unDeleteTransaction = transactionCreate[index];
            await BusinessLoader.transactionBusiness.undeleteTransaction(unDeleteTransaction);
        }
        let now = moment();
        let nowMonth = parseInt(now.format('M').toString());
        let nowYear = parseInt(now.format('Y').toString());
        let distanceMonth = Math.abs(nowYear - year) * 12 + Math.abs(nowMonth - month);
        console.log('distance month =>', distanceMonth);

        console.log('update count ===>', transactionUpdate.length);
        for (let index = 0; index < transactionUpdate.length; index++) {
            let transactionId = transactionUpdate[index];
            console.log('delete =======>', transactionId);
            await BusinessLoader.transactionBusiness.deleteByTransactionId(transactionId);
        }

        if (transactionCreate.length > 0) {
            this.cronWithUserIdCustom(userId, distanceMonth);
        }
        return {
            deleted: transactionUpdate.length,
            created: transactionCreate.length
        };
    }

    async undeleteTransaction(userId: string, month: number, year:number, accountId:string, type: BankType) {

    }

    async writeFileLog(pority: string, issue:string, trasactions:any[], userId:string):Promise<any> {
        if (trasactions.length === 0)
            return;
        console.log('tewseteteetse');
        let trasactionIssue = '';
        trasactions.forEach(item => {
            trasactionIssue = trasactionIssue + `transaction Id : ${item.id} --- Date:${item.date}  --- description:${item.description.original} \n`;
        });
        let content = `${pority} with ${issue} --- userId ${userId} \n ================================== \n ${trasactionIssue}
        \n ================================================================================================================== \n
        \n ================================================================================================================== \n
        `;
        let logUrl = path.join(__dirname, '../../../logs');
        if (!await FileHelper.checkURLExist(logUrl)) {
            await FileHelper.createDirPath(logUrl);
        }

        let nameFile = 'transaction-issue' + moment().format('DD-MM-YY') + '.txt';
        let fileUrl = logUrl + '/' + nameFile;
        let oldContent = '';
        if (await FileHelper.checkURLExist(fileUrl))
            oldContent = await FileHelper.getFileContent(fileUrl);
        FileHelper.writeFile(fileUrl, oldContent + content);
    }
}

Object.seal(YodleeBusiness);
export default YodleeBusiness;
