import * as fs from 'fs'; // eslint-disable-line
import * as _ from 'lodash';
import * as FlakeIdGen from 'flake-idgen'; // eslint-disable-line
import * as intformat from 'biguint-format'; // eslint-disable-line
import * as moment from 'moment';

// import * as moment from 'moment';
import {CrunchType, RoleCode ,BankType} from 'justdone-system-package/dest/app/model/common/CommonType'; // eslint-disable-line
import TransactionCreate from 'justdone-system-package/dest/app/model/transaction/TransactionCreate'; // eslint-disable-line
import Transaction from 'justdone-system-package/dest/app/model/transaction/Transaction'; // eslint-disable-line
import ChartAccount from 'justdone-system-package/dest/app/model/chartAccount/ChartAccount'; // eslint-disable-line
import TransactionRepository from 'justdone-system-package/dest/app/repository/TransactionRepository';
import ExtendFilterRepository from 'justdone-system-package/dest/app/repository/ExtendFilterRepository';
import ProviderRepository from 'justdone-system-package/dest/app/repository/ProviderRepository';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import BankServiceHelper from 'justdone-system-package/dest/helpers/BankServiceHelper'; // eslint-disable-line
import BusinessLoader from '../../system/BusinessLoader';
import ITransactionBusiness from './interfaces/ITransactionBusiness'; // eslint-disable-line
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import module from 'justdone-system-package/dest/resources/permission/module';
import AuthorizationHelper from 'justdone-system-package/dest/helpers/AuthorizationHelper';
import CrunchFilter from 'justdone-system-package/dest/app/model/crunchFilter/CrunchFilter';// eslint-disable-line
import ConnectBankRepository from 'justdone-system-package/dest/app/repository/ConnectBankRepository';
import StatementRepository from 'justdone-system-package/dest/app/repository/StatementRepository';

class TransactionBusiness implements ITransactionBusiness {
    private transactionRepository: TransactionRepository;
    private providerRepository: ProviderRepository;
    private extendFilterRepository: ExtendFilterRepository;
    private connectBankRepository: ConnectBankRepository;
    private statementRepository: StatementRepository;

    constructor() {
        this.transactionRepository = new TransactionRepository();
        this.providerRepository = new ProviderRepository();
        this.extendFilterRepository = new ExtendFilterRepository();
        this.connectBankRepository = new ConnectBankRepository();
        this.statementRepository = new StatementRepository();
    }

    async get(_id: string):Promise<Transaction | null> {
        const transaction = await this.transactionRepository.get(_id, {
            path: 'coaId',
            select: '_id name code'
        });
        return transaction && new Transaction(transaction);
    }

    async getByEmail(email: string): Promise<any> {
        let user = await BusinessLoader.userBusiness.getByEmail(email.trim().toLowerCase());
        if (user) {
            let params = {
                query: <any>{
                    userId: DataHelper.toObjectId(user._id)
                }
            };
            return await this.transactionRepository.findAll(params);
        }
        return [];
    }

    async getAllTransactionToCrunch(originId: string, userId: string, accountId: string, type: number, year: number, month: number, isAll?: boolean): Promise<Transaction[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];

        let targetUser: any = await AuthorizationHelper.userService.get(userId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return [];

        let param = {
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                type: type,
                year: year,
                month: month,
                accountId: accountId
            }
        };

        if (!isAll)
            param.query.$or = [{typeCrunch: {$exists: false}}, {typeCrunch: null}, {typeCrunch: undefined}];

        let transactions = await this.transactionRepository.findAll(param);
        return Transaction.parseArray(transactions);
    }

    async getTransactions(originId: string, userId: string, accountId: string, type: number, year: number, month: number, page: number, limit: number): Promise<Transaction[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        if (!accountId)
            throw new ErrorCommon(101, 'accountId');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];

        let targetUser: any = await AuthorizationHelper.userService.get(userId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return [];

        let params = {
            query: {
                userId: DataHelper.toObjectId(userId),
                type: type,
                year: year,
                month: month,
                accountId: accountId
            },
            populate: {
                path: 'coaId',
                select: '_id name code'
            }
        };

        let transactions = await this.transactionRepository.find(params, {date: -1, index: -1}, page, limit);
        return Transaction.parseArray(transactions);
    };

    async getTransactionsForGJ(originId: string, userId: string, search: string, year: number, month: number, page: number, limit: number): Promise<Transaction[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        // if (!accountId)
        //     throw new ErrorCommon(101, 'accountId');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];
        const regexText = new RegExp(search, 'i');
        let targetUser: any = await AuthorizationHelper.userService.get(userId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return [];
        let params:any = {
            query: {
                userId: DataHelper.toObjectId(userId),
                year: year,
                month: month,
                // coaId: {$ne: null},
                // accountId: accountId
            },
            populate: {
                path: 'coaId',
                select: '_id name code'
            }
        };
        if (search)
            params.query['description.original'] = regexText;

        let transactions = await this.transactionRepository.find(params, {date: -1, index: -1}, page, limit);
        return Transaction.parseArray(transactions);
    }

    async getCountTransactions(originId: string, userId: string, accountId: string, type: number, year: number, month: number): Promise<number> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        if (!accountId)
            throw new ErrorCommon(101, 'accountId');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return 0;

        let targetUser: any = await AuthorizationHelper.userService.get(userId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return 0;

        let params = {
            query: {
                userId: userId,
                type: type,
                year: year,
                month: month,
                accountId: accountId
            }
        };
        return await this.transactionRepository.getCount(params);
    };

    // async getCountTransactionsByCoaId(coaId: string): Promise<Transaction | null> {
    async getCruncherTransactions(originId: string, userId: string, accountId: string, type: number, year: number, month: number, crunchType: number, coaId: string, page: number, limit: number): Promise<Transaction[]> {
        if (!userId || !year || !month)
            return [];
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        if (!accountId)
            throw new ErrorCommon(101, 'accountId');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];

        let targetUser: any = await AuthorizationHelper.userService.get(userId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return [];

        let params = {
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                type: type,
                year: year,
                month: month,
                accountId: accountId
            },
            populate: {
                path: 'coaId',
                select: '_id name code'
            }
        };
        // kenry comment out
        // if (crunchType) {
        //     params.query.typeCrunch = crunchType;
        //     if (coaId)
        //         params.query.coaId = DataHelper.toObjectId(coaId);
        //     else
        //         params.query.$or = [{coaId: {$exists: false}}, {coaId: null}];
        // }
        // else
        //     params.query.$or = [{typeCrunch: {$exists: false}}, {typeCrunch: null}];

        let transactions = await this.transactionRepository.findAll(params);
        return Transaction.parseArray(transactions);
    }

    async getCountCruncherTransactions(originId: string, userId: string, accountId: string, type: number, year: number, month: number, crunchType: number, coaId: string): Promise<number> {
        if (!userId || !type || !year || !month)
            return 0;
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        if (!accountId)
            throw new ErrorCommon(101, 'accountId');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return 0;

        let targetUser: any = await AuthorizationHelper.userService.get(userId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return 0;
        let params = <any>{
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                type: type,
                year: year,
                month: month,
                accountId: accountId
            }
        };

        if (crunchType) {
            params.query.typeCrunch = crunchType;
            if (coaId)
                params.query.coaId = DataHelper.toObjectId(coaId);
            else
                params.query.$or = [{coaId: {$exists: false}}, {coaId: null}];
        }
        else
            params.query.$or = [{typeCrunch: {$exists: false}}, {typeCrunch: null}];

        return await this.transactionRepository.getCount(params);
    }

    async getChartAccountForExpenses(originId: string, userId: string, accountId: string, type: number, year: number, month: number, crunchType: number): Promise<ChartAccount[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        if (!accountId)
            throw new ErrorCommon(101, 'accountId');

        let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];

        let targetUser: any = await AuthorizationHelper.userService.get(userId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return [];

        let params = <any>{
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                type: type,
                year: year,
                month: month,
                accountId: accountId,
                typeCrunch: crunchType
            },
            select: 'coaId'
        };
        let coaIds = await this.transactionRepository.findAll(params);
        let uniqueCoa: string[] = [];
        for (let i = 0; i < coaIds.length; i++) {
            if (coaIds[i].coaId && uniqueCoa.indexOf(coaIds[i].coaId) < 0)
                uniqueCoa.push(coaIds[i].coaId);
        }
        let chartAccounts = await BusinessLoader.chartAccountBusiness.getById(originId, uniqueCoa);
        return chartAccounts;
    }

    async getTransactionByCoa(originId: string, coaId: string): Promise<Transaction | null> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return null;
        let params = {
            query: {
                coaId: DataHelper.toObjectId(coaId)
            }
        };
        let transaction = await this.transactionRepository.findOne(params);
        return transaction && new Transaction(transaction);
    }

    async getAllTransactionsByCoaId(originId: string, coaId: string): Promise<Transaction[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];
        let params = {
            query: {
                coaId: DataHelper.toObjectId(coaId)
            }
        };
        let transactions = await this.transactionRepository.findAll(params, {month: 1});
        return Transaction.parseArray(transactions);
    };

    async getAllTransactionByCrunchType(originId: string, userId: string, accountId: string, type: number, crunchType: number, year: number, month: number): Promise<Transaction[]> {
        if (!originId || !accountId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];

        let targetUser: any = await AuthorizationHelper.userService.get(userId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return [];
        let params = {
            query: {
                userId: DataHelper.toObjectId(userId),
                typeCrunch: crunchType,
                type: type,
                year: year,
                month: month,
                accountId: accountId
            },
            populate: {
                path: 'coaId',
                select: '_id name code'
            }
        };
        let transactions = await this.transactionRepository.findAll(params, {date: -1});
        return Transaction.parseArray(transactions);
    }

    async getAllTransactionByUserId(userId: string): Promise<Transaction[]> {
        if (!userId)
            throw new ErrorCommon(101, 'Request');

        let params = {
            query: {
                userId: DataHelper.toObjectId(userId)
            }
        };

        let transactions = await this.transactionRepository.findAll(params, {date: -1});
        return Transaction.parseArray(transactions);
    }

    async totalAmountTransactionCruch(originId: string, clientId: string, type: number, baseType: string, year: number, month: number): Promise<number> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return 0;

        let targetUser: any = await AuthorizationHelper.userService.get(clientId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return 0;

        let result: { totalAmount: number }[] = await this.transactionRepository.aggregate([{
            $match: {'userId': DataHelper.toObjectId(clientId)}
        }, {
            $match: {'type': {$eq: type}}
        }, {
            $match: {'month': {$eq: month}}
        }, {
            $match: {'year': {$eq: year}}
        }, {
            $match: {
                $and: [{
                    'typeCrunch': {$exists: true}
                }, {
                    'typeCrunch': {$ne: null}
                }]
            }
        }, {
            $match: {'baseType': {$eq: baseType}}
        }, {
            $group: {_id: null, totalAmount: {$sum: '$amount.amount'}}
        }, {
            $project: {_id: 0, totalAmount: 1}
        }]);
        return result.length ? result[0].totalAmount : 0;
    }

    async totalAmountTransactionChartAccount(originId: string, clientId: string, type: number, year: number, month: number): Promise<{ userId: string, coaId: string, baseType: string, amount: any }[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];

        let targetUser: any = await AuthorizationHelper.userService.get(clientId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return [];

        let result: { userId: string, coaId: string, baseType: string, amount: any }[] = await this.transactionRepository.aggregate([{
            $match: {'userId': DataHelper.toObjectId(clientId)}
        }, {
            $match: {'type': type}
        }, {
            $match: {'month': {$eq: month}}
        }, {
            $match: {'year': {$eq: year}}
        }, {
            $match: {
                $and: [{
                    'coaId': {$exists: true}
                }, {
                    'coaId': {$ne: null}
                }]
            }
        }, {
            $match: {
                $and: [{
                    'typeCrunch': {$exists: true}
                }, {
                    'typeCrunch': {$ne: null}
                }]
            }
        }, {
            $project: {'userId': 1, 'coaId': 1, 'baseType': 1, 'amount': 1}
        }]);
        return result.length ? result : [];
    }

    // Task Add Transactions

    async getTransactionsManual(originId: string, manualTransaction: any, userId: string, accountId: string, type: number, year: number, month: number): Promise<any> {
        if (!originId || !accountId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return null;

        let params = {
            query: {
                manualTransaction: manualTransaction,
                userId: userId,
                accountId: accountId,
                type: type,
                year: year,
                month: month
            }
        };
        let transactions = await this.transactionRepository.findAll(params, {date: -1});
        return transactions;
    }

    // Create Transaction and updateStatement
    async createTransactionWithoutId(originId: any, data: any): Promise<any> {
        if (!data)
            throw new ErrorCommon(101, 'data');
        // find bankId with accoundId

        if (!data[0].accountId)
            return {status: 400, message: "accountId is required!"}

        let params = {
            query: <any>{
                accountId: data[0].accountId
            }
        };

        let bankItem = await this.connectBankRepository.findOne(params);

        if (!bankItem)
            return {status: 400, message: "No bank contains provide accountId"}
        
        let bankId = bankItem.providerId;
        if (!bankId)
            return {status: 400, message: "providerId is not exist"}

        let arr: any = [];
        let arrTrans: any = [];
        let arrId: any = [];

        // for to create all transactions in array
        for (let i = 0; i < data.length; i++) {
            let generator = new FlakeIdGen();
            let id = generator.next();
            let hashedId = intformat(id, 'dec');
            let dateConvert = moment(String(data[i].date)).toISOString();

            data[i].transactionId = hashedId;
            data[i].bankId = bankId;
            data[i].date = dateConvert;
            data[i].postDate = dateConvert;
            data[i].baseType = data[i].baseType.toUpperCase();
            data[i].amount.amount = Number(data[i].amount.amount);
            data[i].runningBalance.amount = Number(data[i].runningBalance.amount);
            data[i].manualTransaction = true;
            let result = await this.transactionRepository.create(data[i]);
            if (!result) {
                throw new ErrorCommon(103, 'transaction detail');
            }
            arrTrans.push(data[0]);
            arr.push(result);
        }

        console.log('arrTrans =>>>>>>>>>>>>>.', arrTrans);

        let userId = arrTrans[0].userId;
        let type = arrTrans[0].type;
        let accountId = arrTrans[0].accountId;
        let month = arrTrans[0].month;
        let year = arrTrans[0].year;

        let statement;

        let user = await BusinessLoader.userBusiness.get(userId);

        if (!user)
            throw new ErrorCommon(112, "User");
        
        // console.log("user =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", user);

        // console.log('originId, userId, accountId, type, user.financialStart, 6, 0', originId, userId, accountId, type, user.financialStart, 6, 0);

        await this.createEmptyStatement(originId, userId, accountId, type, user.financialStart, 6, 0);

        // find statement fisrt one to check manualStatement and update with API calcStatementByClosingBalance
        let statementOneTime = await BusinessLoader.statementBusiness.getStatementOfClient(userId, originId, accountId, type, year, month);
        
        if (statementOneTime) {
            if (statementOneTime.manualStatement === true) {
                // call API update OpenBalance with CloseBalance
                let resultUpdate = await this.calcStatementByClosingBalance(originId, userId, accountId, type, year, month);
                if (resultUpdate)
                    statement = await BusinessLoader.statementBusiness.getStatementOfClient(userId, originId, accountId, type, year, month);
            }
            else {
                // else get truc tiep statment ma k can update lai tu closeBalance
                statement = await BusinessLoader.statementBusiness.getStatementOfClient(userId, originId, accountId, type, year, month);
            }
        }

        if (statement) {
            let dataUpdateStatement = {
                userId: userId,
                accountId: accountId,
                month: Number(month),
                year: Number(year),
                type: Number(type),
                openBalance: statement.openBalance
            };

            // Call API update all statement back and front to this statement
            if (dataUpdateStatement) {
                let done = await BankServiceHelper.updateOpenBalanceStatement(dataUpdateStatement);
                // if update fails
                if (!done) {
                    // push id trans vua dc create vao array
                    for (let i = 0; i < arr.length; i++) {
                        arrId.push(arr[i]._id);
                    }
                    // for to delete one by one transaction
                    if (arrId.length > 0) {
                        for (let i = 0; i < arrId.length; i++) {
                            await this.deleteTransaction(arrId[i], originId);
                        }
                        return false;
                    }
                }
            }
        }
        else {
            // push id trans vua dc create vao array
            for (let i = 0; i < arr.length; i++) {
                arrId.push(arr[i]._id);
            }
            // for to delete one by one transaction
            if (arrId.length > 0) {
                for (let i = 0; i < arrId.length; i++) {
                    await this.deleteTransaction(arrId[i], originId);
                }
                return false;
            }
        }

        if (!arr || arr.length < 0)
            throw new ErrorCommon(103, 'transactions');
        return arr;
    }

    async deleteAndUpdateStatement(originId: string, data: any): Promise<any> {
        if (!originId || !data)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return null;

        let deleteSuccess = await this.deleteTransaction(data.transactionId, originId);

        if (!deleteSuccess)
            throw new ErrorCommon(103, 'Cant delete');

        let userId = data.userId;
        let accountId = data.accountId;
        let type = Number(data.type);
        let year = Number(data.year);
        let month = Number(data.month);

        let update = await this.getStatementAndUpdate(userId, originId, accountId, type, year, month);

        if (!update)
            return false;

        return true;
    }

    async getStatementAndUpdate(userId: string, originId: string, accountId: string, type: number, year: number, month: number): Promise<any> {
        let statement;
        let statementOneTime = await BusinessLoader.statementBusiness.getStatementOfClient(userId, originId, accountId, type, year, month);

        if (statementOneTime) {
            if (statementOneTime.manualStatement === true) {
                let resultUpdate = await this.calcStatementByClosingBalance(originId, userId, accountId, type, year, month);
                if (resultUpdate)
                    statement = await BusinessLoader.statementBusiness.getStatementOfClient(userId, originId, accountId, type, year, month);
            }
            else {
                // thêm từ lần cuối push
                statement = await BusinessLoader.statementBusiness.getStatementOfClient(userId, originId, accountId, type, year, month);
            }
        }

        if (statement) {
            let dataUpdateStatement = {
                userId: userId,
                accountId: accountId,
                month: month,
                year: year,
                type: type,
                openBalance: statement.openBalance
            };

            if (dataUpdateStatement) {
                let done = await BankServiceHelper.updateOpenBalanceStatement(dataUpdateStatement);
                if (!done)
                    throw new ErrorCommon(103, 'cant update statement');
            }
        }
        else
            throw new ErrorCommon(101, 'Statement request');

        return true;
    }

    // Task Show All Statement
    // tìm statement và create statementEmpty luôn

    async findStartStatement(originId: string, userId: string, accountId: string, type: number, year: number, month: number): Promise<any> {
        if (!originId || !userId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        // if (!products || !products.length)
        //     return null;

        let statement = await BusinessLoader.statementBusiness.getStatementOfClient(userId, originId, accountId, type, year, month);
        let user = await BusinessLoader.userBusiness.get(userId);

        let financialStart = user ? user.financialStart : 2016;
        let openBalance = statement ? statement.openBalance : 0;
        
        let result = await this.createEmptyStatement(originId, userId, accountId, type, financialStart, 7, openBalance);

        if (!result)
            return false;
        return true;
    }

    async createEmptyStatement(originId: string, userId: string, accountId: string, type: number, year: number, month: number, openBalance: number): Promise<any> {
        if (!originId || !userId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return null;
        
        let currentMonth = new Date().getMonth() +1;
        let currentYear = new Date().getFullYear();

        for (let i = 0; i < 19; i++) {
            let statement = await BusinessLoader.statementBusiness.getStatementOfClient(userId, originId, accountId, type, year, month);
            if (month === currentMonth + 1 && year === currentYear)
                break;

            if (statement) {
                month += 1;
                if (month === 13) {
                    month = 1;
                    year = year + 1;
                    await this.createEmptyStatement(originId, userId, accountId, type, year, month, openBalance);
                    break;
                }
                await this.createEmptyStatement(originId, userId, accountId, type, year, month, openBalance);
                break;
            }

            let newStatement = {
                userId: userId,
                accountId: accountId,
                type: type,
                year: year,
                month: month,
                openBalance: openBalance,
                closeBalance: openBalance,
                manualStatement: true
            };

            let result = await this.statementRepository.create(newStatement);

            if (month === 12) {
                month = 1;
                year = year + 1;
                await this.createEmptyStatement(originId, userId, accountId, type, year, month, openBalance);
                break;
            }
            month += 1;
        }
        return true;
    }

    async calcStatementByClosingBalance(originId: string, userId: string, accountId: string, type: number, year: number, month: number): Promise<any> {
        let statement = await BusinessLoader.statementBusiness.getStatementOfClient(userId, originId, accountId, type, year, month);

        let closingBalance;

        if (statement)
            closingBalance = statement.closeBalance;

        let dataHelpFind = {
            userId: userId,
            month: month,
            year: year,
            type: type,
            accountId: accountId
        };
        console.log("Trc  getStransactionByMonth =>>>>>>>>>>>>>>>>>>>>>>>>");
        let transactions = await BankServiceHelper.getStransactionByMonth(dataHelpFind);
        console.log("sau getStransactionByMonth =>>>>>>>>>>>>>>>>>>>>>>>");
        let dataCalc = {
            transactions: transactions,
            closingBalance: closingBalance,
            statementId: statement ? statement._id : null
        };

        let result = await BankServiceHelper.calcTransactionByClosing(dataCalc);
        if (!result)
            return false;

        return true;
    }

    async checkStatementByMonth(originId: string, userId: string, accountId: string, type: number): Promise<any> {
        if (!originId || !userId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return null;

        let user = await BusinessLoader.userBusiness.get(userId);

        let year;

        if (user)
            year = user.financialStart;

        let statement = await BusinessLoader.statementBusiness.getStatementOfClient(userId, originId, accountId, type, year, 7);
        // console.log(statement);

        if (statement)
            return false;

        return true;
    }

    //

    async create(data: TransactionCreate): Promise<Transaction | null> {
        let transaction = await this.transactionRepository.create(data);
        if (!transaction) {
            throw new ErrorCommon(103, 'transaction');
        }
        return transaction && new Transaction(transaction);
    }

    async getTransactionByTransactionIds(transactionIds:string[]):Promise<Transaction[]> {
        const params = {query: {
            _id: {$in: transactionIds}
        }};
        const transactions = await this.transactionRepository.findAll(params);
        return Transaction.parseArray(transactions);
    }

    // async createCruncherPdfReport(targetId: string, originId: string, productCode: number, location: string, type: number, year: number, month: number): Promise<string> {
    //     if (!originId)
    //         throw new ErrorCommon(101, 'Request');

    //     let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, [productCode]);
    //     if (!products || !products.length)
    //         return '';
    //     let statement = await BusinessLoader.statementBusiness.getStatementOfClient(targetId, originId, type, year, month);
    //     if (!statement)
    //         throw new ErrorCommon(102, 'Statement');

    //     let date = moment(statement.month, 'MM').format('MMMM').toString() + ' ' + statement.year;
    //     let transactions = await this.getTransactions(originId, targetId, type, year, month, 0, 200000);
    //     let defaultTransaction = _.filter(transactions, transaction => !transaction.typeCrunch);
    //     if (defaultTransaction.length > 0)
    //         throw new ErrorCommon(106, 'Crunch');

    //     let user: any = await BusinessLoader.userBusiness.get(targetId);
    //     if (!user)
    //         throw new ErrorCommon(102, 'Client');

    //     let connectedBanks = user.connectedBanks;
    //     let connectedBank = connectedBanks.find(item => item.type === type);
    //     if (!connectedBank || !connectedBank.connectedId || !connectedBank.connectedName || !connectedBank.providerId)
    //         throw new ErrorCommon(107, 'Bank');
    //     let yodleeAccount;
    //     if (!connectedBank.accounts || connectedBank.accounts.length === 0) {
    //         console.log('account not in connect bank , get account from yodlee');
    //         let {account} = await BusinessLoader.yodleeBusiness.getBankAccounts(targetId, type);
    //         if (account.length === 0)
    //             throw new ErrorYodlee(1);
    //         yodleeAccount = account;
    //     }
    //     else
    //         yodleeAccount = connectedBank.accounts[0];

    //     let fullName = user.businessInfo ? (user.businessInfo.entityName ? user.businessInfo.entityName : user.fullName) : user.fullName;
    //     let expenses = _.filter(transactions, transaction => transaction.typeCrunch === CrunchType.Expenses);
    //     expenses.forEach(element => {
    //         if (!element.coaId || !element.coaId._id) {
    //             throw new ErrorYodlee(2);
    //         }
    //     });
    //     let other = _.filter(transactions, transaction => transaction.typeCrunch === CrunchType.Other);
    //     let income = _.filter(transactions, transaction => transaction.typeCrunch === CrunchType.Income);
    //     let drawings = _.filter(transactions, transaction => transaction.typeCrunch === CrunchType.Drawings);
    //     let crunch = {
    //         expenses: expenses,
    //         other: other,
    //         income: income,
    //         drawings: drawings,
    //         date: date,
    //         ...statement
    //     };
    //     let templateCrunch = new TemplateCrunch(crunch, yodleeAccount, fullName); // Template for Invoice pdf By HTML
    //     let localFile = 'tmp/' + 'crunch-' + crunch._id + '.pdf'; // Address and name for new pdf invoice fle
    //     let options = {
    //         format: 'A4', border: '0cm',
    //         footer: {
    //             height: '2cm',
    //             contents: {
    //                 default: '' +
    //                     '<div style="font-size: 6px;color:#BFBFBF;position: relative;bottom:0px">' +
    //                     '<div style="position: relative;bottom: -5px">CRUNCH REPORT</div>' +
    //                     '<div style="text-align: right;">PAGE {{page}}/{{pages}} </div>' +
    //                     '</div>',
    //             }
    //         },
    //         header: {
    //             height: '1cm',
    //         },
    //     };
    //     await PdfHelper.createPdf(templateCrunch, options, localFile);
    //     let typeCrunch = type === BankType.Bank ? 'bank' : 'credit card';
    //     let monthCrunch = moment(statement.month, 'MM').format('MM');
    //     let product = await BusinessLoader.productBusiness.get(user.permission.product);

    //     if (!product || !product.type)
    //         throw new ErrorCommon(102, 'Product');

    //     let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(user._id, productCode, year.toString(), typeCrunch);
    //     let fileName = `cruncher_${monthCrunch}.pdf`;

    //     let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, fileName, Project.GOOGLE_STORAGE.BUCKET_NAME);
    //     return urlDownload;
    // }

    // async createCruncherCsvReport(targetId: string, originId: string, productCode: number, location: string, type: number, year: number, month: number): Promise<string> {
    //     if (!originId)
    //         throw new ErrorCommon(101, 'Request');

    //     let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, [productCode]);
    //     if (!products || !products.length)
    //         return '';
    //     let statement = await BusinessLoader.statementBusiness.getStatementOfClient(targetId, originId, type, year, month);
    //     if (!statement)
    //         throw new ErrorCommon(102, 'Statement');

    //     let date = moment(statement.month, 'MM').format('MMMM').toString() + ' ' + statement.year;
    //     let transactions = await this.getTransactions(originId, targetId, type, year, month, 0, 200000);
    //     let defaultTransaction = _.filter(transactions, transaction => !transaction.typeCrunch);
    //     if (defaultTransaction.length > 0)
    //         throw new ErrorCommon(106, 'Crunch');

    //     let user: any = await BusinessLoader.userBusiness.get(targetId);
    //     if (!user)
    //         throw new ErrorCommon(102, 'Client');

    //     let connectedBanks = user.connectedBanks;
    //     let connectedBank = connectedBanks.find(item => item.type === type);
    //     if (!connectedBank || !connectedBank.connectedId || !connectedBank.connectedName || !connectedBank.providerId)
    //         throw new ErrorCommon(107, 'Bank');
    //     let yodleeAccount; // eslint-disable-line
    //     if (!connectedBank.accounts || connectedBank.accounts.length === 0) {
    //         console.log('account not in connect bank , get account from yodlee');
    //         let {account} = await BusinessLoader.yodleeBusiness.getBankAccounts(targetId, type);
    //         if (account.length === 0)
    //             throw new ErrorYodlee(1);
    //         yodleeAccount = account;
    //     }
    //     else
    //         yodleeAccount = connectedBank.accounts[0];

    //     let fullName = user.businessInfo ? (user.businessInfo.entityName ? user.businessInfo.entityName : user.fullName) : user.fullName;
    //     let expenses = _.filter(transactions, transaction => transaction.typeCrunch === CrunchType.Expenses);
    //     expenses.forEach(element => {
    //         if (!element.coaId || !element.coaId._id) {
    //             throw new ErrorYodlee(2);
    //         }
    //     });
    //     let other = _.filter(transactions, transaction => transaction.typeCrunch === CrunchType.Other);
    //     let income = _.filter(transactions, transaction => transaction.typeCrunch === CrunchType.Income);
    //     let drawings = _.filter(transactions, transaction => transaction.typeCrunch === CrunchType.Drawings);
    //     let crunch = {
    //         userName: fullName,
    //         expenses: expenses,
    //         other: other,
    //         income: income,
    //         drawings: drawings,
    //         date: date,
    //         ...statement
    //     };
    //     let csvData = CsvHelper.createCsvCrunch(crunch);

    //     let monthCrunch = moment(statement.month, 'MM').format('MM');
    //     let typeCrunch = type === BankType.Bank ? 'bank' : 'credit card';
    //     let product = await BusinessLoader.productBusiness.get(user.permission.product);
    //     let localFile = `tmp/cruncher_${monthCrunch}.csv`;

    //     if (!product || !product.type)
    //         throw new ErrorCommon(102, 'Product');
    //     let crunchPrefix = GoogleStorageHelper.getTransactionPrefix(user._id, productCode, year.toString(), typeCrunch);
    //     let fileName = `cruncher_${monthCrunch}.csv`;

    //     fs.writeFileSync(localFile, csvData);

    //     let urlDownload = await GoogleStorageHelper.uploadCrunch(localFile, crunchPrefix, fileName, Project.GOOGLE_STORAGE.BUCKET_NAME);
    //     // return Project.GOOGLE_STORAGE.BASE_URL + `/${Project.GOOGLE_STORAGE.BUCKET_NAME}` + crunchPathS3;
    //     return urlDownload;
    // }
    async update(_id: string, data: any): Promise<boolean> {
        if (!_id)
            return false;
        await this.transactionRepository.update(_id, data);
        return true;
    }

    async updateManualTrans(data: any): Promise<boolean> {
        const dataStatement = data.statement;
        const dataTransaction = data.transaction;

        const _id = dataTransaction._id;
        if (!_id)
            return false;

        let transaction = await this.get(_id);
        if (!transaction)
            throw new ErrorCommon(103, 'Transaction');

        let dataUpdate = {
            amount: {
                currency: 'AUD',
                amount: Number(dataTransaction.amount.amount)
            },
            description: {
                original: String(dataTransaction.description.original)
            },
            baseType: String(dataTransaction.baseType).toUpperCase(),
            date: dataTransaction.date,
            month: dataTransaction.month,
            year: dataTransaction.year
        }
        
        let result = await this.transactionRepository.update(_id, dataUpdate);
        if (!result)
            throw new ErrorCommon(103, 'result');
        
        let statement = await BusinessLoader.statementBusiness.getStatementOfClient(dataStatement.userId, dataStatement.originId, dataStatement.accountId, dataStatement.type, dataStatement.year, dataStatement.month);

        if (!statement)
            throw new ErrorCommon(103, 'statement');

        let dataUpdateStatement = {
            userId: statement.userId._id,
            accountId: statement.accountId,
            month: Number(statement.month),
            year: Number(statement.year),
            type: Number(statement.type),
            openBalance: statement.openBalance
        };

        let done = await BankServiceHelper.updateOpenBalanceStatement(dataUpdateStatement);

        if (!done)
            return false;

        return true; 
    }

    async removeWarningDuplicate(_id: string, originId: string): Promise<boolean> {
        if (!originId || !_id)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.UPDATE.code], originId, []);
        if (!products || !products.length)
            return false;

        let populate = {
            path: 'userId',
            select: 'permission.managers'
        };

        let transaction = await this.transactionRepository.get(_id, populate);
        if (!transaction || !transaction.userId || !transaction.userId.permission)
            throw new ErrorCommon(101, 'Request');
        return await this.update(_id, {isWarningDuplicate: null});
    }

    async deleteTransaction(_id: string, originId: string): Promise<boolean> {
        if (!originId || !_id)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.UPDATE.code], originId, []);
        if (!products || !products.length)
            return false;

        let populate = {
            path: 'userId',
            select: 'permission.managers'
        };

        let transaction = await this.transactionRepository.get(_id, populate);
        if (!transaction || !transaction.userId || !transaction.userId.permission)
            throw new ErrorCommon(101, 'Request');
        return await this.transactionRepository.delete(_id);
    }

    async updateCrunchType(_id: string, originId: string, crunchType: number): Promise<boolean> {
        if (!originId || !_id)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.UPDATE.code], originId, []);
        if (!products || !products.length)
            return false;

        let populate = {
            path: 'userId',
            select: 'permission.managers'
        };

        let transaction = await this.transactionRepository.get(_id, populate);
        if (!transaction || !transaction.userId || !transaction.userId.permission)
            throw new ErrorCommon(101, 'Request');

        let data = {
            typeCrunch: crunchType,
            coaId: null
        };

        let result = await this.transactionRepository.update(_id, data);
        if (result) {
            await BusinessLoader.crunchBusiness.unComplete(originId, transaction.userId._id, transaction.type, transaction.year, transaction.month);
            return result;
        }
        else
            return false;
    }

    async applyAdJustment(transactionId: string, typeCrunch: number, coaId: string):Promise<boolean> {
        if (!transactionId && !coaId) {
            throw new ErrorCommon(101, 'Request');
        }
        return await this.transactionRepository.update(transactionId, {coaId, typeCrunch: typeCrunch});
    }

    async updateCoaCode(_id: string, originId: string, coaId: string): Promise<boolean> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.UPDATE.code], originId, []);
        if (!products || !products.length)
            return false;

        let populate = {
            path: 'userId',
            select: 'permission.managers'
        };
        let transaction = await this.transactionRepository.get(_id, populate);
        if (!transaction || !transaction.userId || !transaction.userId.permission)
            throw new ErrorCommon(101, 'Request');
        // || !transaction.userId.permission.managers.includes(originId.toString())
        let data = {
            coaId: coaId
        };
        let result = await this.transactionRepository.update(_id, data);
        if (result) {
            await BusinessLoader.crunchBusiness.unComplete(originId, transaction.userId._id, transaction.type, transaction.year, transaction.month);
            return result;
        }
        else
            return false;
    }

    async updateCrunchByTransactionId(query: any, update: object): Promise<boolean> {
        if (!query && !query.userId && !query.transactionId && !query.year && !query.month && !query.type)
            return false;
        query = _.pick(query, ['userId', 'transactionId', 'year', 'moth', 'type']);
        let transaction = await this.transactionRepository.findOne({query});

        if (!transaction)
            return false;
        await this.transactionRepository.update(transaction._id, update);
        return true;
    }

    async deleteCrunchType(_id: string, originId: string): Promise<boolean> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.UPDATE.code], originId, []);
        if (!products || !products.length)
            return false;

        let populate = {
            path: 'userId',
            select: 'permission.managers'
        };
        let transaction = await this.transactionRepository.get(_id, populate);
        if (!transaction || !transaction.userId || !transaction.userId.permission)
            throw new ErrorCommon(101, 'Request');
        // !transaction.userId.permission.managers.includes(originId.toString())

        let data = {
            typeCrunch: null,
            coaId: null
        };
        let result = await this.transactionRepository.update(_id, data);
        if (result) {
            await BusinessLoader.crunchBusiness.unComplete(originId, transaction.userId._id, transaction.type, transaction.year, transaction.month);
            return result;
        }
        else
            return false;
    }

    async filterTransactions(crunchFilters: CrunchFilter[], transactions: Transaction[]): Promise<{filters: CrunchFilter[], transaction: Transaction}[]> {
        let results = <{filters: CrunchFilter[], transaction: Transaction}[]>[];

        if (transactions && transactions.length) {
            let specialLetters = ['*', '.', '$', '@'];

            for (let i = 0; i < transactions.length; i++) {
                let transaction = transactions[i];
                let data = {
                    filters: <CrunchFilter[]>[],
                    transaction: transaction
                };
                results.push(data);

                if (crunchFilters && crunchFilters.length) {
                    for (let j = 0; j < crunchFilters.length; j++) {
                        let crunchFilter = crunchFilters[j];
                        // if (transaction.bankId !== crunchFilter.bankId) continue;
                        if (crunchFilter.accountType && transaction.type !== crunchFilter.accountType) continue;
                        if (crunchFilter.baseType && transaction.baseType !== crunchFilter.baseType) continue;

                        if (crunchFilter.conditions && crunchFilter.conditions.length) {
                            for (let n = 0; n < crunchFilter.conditions.length; n++) {
                                let condition = crunchFilter.conditions[n];
                                let specialLetter = specialLetters.find(specialLetter => condition.description.includes(specialLetter));
                                if (specialLetter)
                                    condition.description = condition.description.toLowerCase().replace(new RegExp('\\' + specialLetter, 'g'), `\\${specialLetter}`);
                            }

                            if (crunchFilter.conditions.filter(condition =>
                                (condition.operation === 'contains' && transaction.description.original.toLowerCase().match(new RegExp(condition.description, 'i'))) ||
                                (condition.operation === 'notContains' && !transaction.description.original.toLowerCase().match(new RegExp(condition.description, 'i'))) ||
                                (condition.operation === 'startsWith' && transaction.description.original.toLowerCase().match(new RegExp('^' + condition.description, 'i'))) ||
                                (condition.operation === 'equal' && transaction.description.original.toLowerCase().match(new RegExp('^' + condition.description + '$', 'i')))
                            ).length !== crunchFilter.conditions.length)
                                continue;
                        }
                        data.filters.push(crunchFilter);
                    }
                }
            }
        }
        return results;
    }

    async crunchAutomation(originId: string, clientId: string, accountId: string, type: number, year: number, month: number): Promise<{filters: CrunchFilter[], transaction: Transaction}[]> {
        if (!originId || !clientId || !type || !year || !month || !accountId)
            throw new ErrorCommon(101, 'Request');
        let results = <any[]>[];

        let products = await Authenticator.filterProductsPermission([module.AUTOCRUNCHER.claim.CREATE.code], originId);
        if (!products || !products.length)
            return results;

        let client: any = await AuthorizationHelper.userService.get(clientId);
        if (!client || !client.permission || !client.permission.product || !client.permission.role || client.permission.role.code !== RoleCode.Client ||
            !products.find(item => item._id === client.permission.product._id) ||
            !client.permission.managers || !client.permission.managers.find(managerId => managerId.toString() === originId))
            return results;

        let transactions = await this.getAllTransactionToCrunch(originId, clientId, accountId, type, year, month, false);

        transactions = await this.extendFilter(transactions);

        if (transactions.length) {
            let crunchFilters = await BusinessLoader.crunchBusiness.getCrunchFilters(originId);
            let coaAssignments = await BusinessLoader.chartAccountAssignmentBusiness.getAllCoaByClient(originId, clientId);
            crunchFilters = crunchFilters.filter(crunchFilter => crunchFilter.groupId !== CrunchType.Expenses || coaAssignments.find(coaAssignment => coaAssignment.coa.toString() === crunchFilter.coaId.toString()));

            let isUncomplete = false;
            let usedFilters = <any[]>[];
            let filteredTransactions = await this.filterTransactions(crunchFilters, transactions);

            for (let i = 0; i < filteredTransactions.length; i++) {
                let filteredTransaction = filteredTransactions[i];
                let transaction = filteredTransaction.transaction;

                if (filteredTransaction.filters.length === 1) {
                    let data = {
                        typeCrunch: filteredTransaction.filters[0].groupId,
                        coaId: filteredTransaction.filters[0].coaId
                    };
                    transaction.typeCrunch = data.typeCrunch;
                    transaction.coaId = data.coaId;

                    if (await this.transactionRepository.update(transaction._id, data)) {
                        isUncomplete = true;
                        let usedFilter = usedFilters.find(usedFilter => usedFilter.filter._id.toString() === filteredTransaction.filters[0]._id.toString());
                        if (usedFilter)
                            usedFilter.count++;
                        else
                            usedFilters.push({filter: filteredTransaction.filters[0], count: 1});
                    }
                }
                // else { // If incorrect will move to Other type
                //     let data = {
                //         typeCrunch: CrunchType.Other
                //     };
                //     transaction.typeCrunch = data.typeCrunch;

                //     if (await this.transactionRepository.update(transaction._id, data))
                //         isUncomplete = true;
                // }
            }

            if (isUncomplete)
                BusinessLoader.crunchBusiness.unComplete(originId, clientId, type, year, month);

            for (let i = 0; i < usedFilters.length; i++) {
                BusinessLoader.crunchBusiness.updateUseCrunchFilter(originId, usedFilters[i].filter._id.toString(), usedFilters[i].count);
            }

            // else if (countCorrect > 1 && countCorrect <= 5) {
            //     let newTransactionItem = transaction;
            //     (newTransactionItem as any).conditions = correctFilters;
            //     (newTransactionItem as any).isHaveCoditions = true;
            //     data.push(newTransactionItem);
            // }
            return filteredTransactions;
        }
        return results;
    }

    async extendFilter(transactions:Transaction[]):Promise<any> {
        let transactionIds = transactions.map(item => {
            return item.transactionId;
        });
        let transactionsFilter = await this.extendFilterRepository.findAll({query: {transactionId: {$in: transactionIds}}});
        let task:any = [];
        transactionsFilter.forEach(async transaction => {
            let transactionUpdate = transactions.find(item => item.transactionId === transaction.transactionId);

            if (transaction.typeCrunch && transactionUpdate) {
                if (transaction.coaId)
                    task.push(this.transactionRepository.update(transactionUpdate._id, {typeCrunch: transaction.typeCrunch, coaId: transaction.coaId}));
                else
                    task.push(this.transactionRepository.update(transactionUpdate._id, {typeCrunch: transaction.typeCrunch}));
            }
        });
        await Promise.all(task);
        let transactionNotFilter = _.differenceBy(transactions, transactionsFilter, 'transactionId');
        return transactionNotFilter;
    }

    async previewCrunchAutomation(originId: string, clientId: string, accountId: string, type: number, year: number, month: number, crunchFilter: CrunchFilter): Promise<{correctList: Transaction[], incorrectList: Transaction[]}> {
        if (!originId || !clientId || !accountId)
            throw new ErrorCommon(101, 'Request');

        let result = {
            correctList: <Transaction[]>[],
            incorrectList: <Transaction[]>[]
        };

        let products = await Authenticator.filterProductsPermission([module.AUTOCRUNCHER.claim.CREATE.code], originId);
        if (!products || !products.length)
            return result;

        let client: any = await AuthorizationHelper.userService.get(clientId);
        if (!client || !client.permission || !client.permission.product || !client.permission.role || client.permission.role.code !== RoleCode.Client ||
            !products.find(item => item._id === client.permission.product._id) ||
            !client.permission.managers || !client.permission.managers.find(managerId => managerId.toString() === originId))
            return result;

        let transactions = await this.getAllTransactionToCrunch(originId, clientId, accountId, type, year, month, true);
        if (transactions.length) {
            if (crunchFilter.groupId === CrunchType.Expenses) {
                let coaAssignments = await BusinessLoader.chartAccountAssignmentBusiness.getAllCoaByClient(originId, clientId);
                if (!coaAssignments.find(coaAssignment => coaAssignment.coa.toString() === crunchFilter.coaId.toString())) {
                    result.incorrectList = transactions;
                    return result;
                }
            }

            let filteredTransactions = await this.filterTransactions([crunchFilter], transactions);
            filteredTransactions.forEach(filteredTransaction => {
                if (filteredTransaction.filters.length === 1)
                    result.correctList.push(filteredTransaction.transaction);
                else
                    result.incorrectList.push(filteredTransaction.transaction);
            });
        }
        return result;
    }

    async revertCruncherTransactions(userId: string, accountId: string, type: number, year: number, month: number): Promise<boolean> {
        if (!userId || !year || !month || !accountId)
            return false;

        let params = {
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                type: type,
                year: year,
                month: month,
                accountId: accountId,
            }
        };

        let transactions = await this.transactionRepository.findAll(params);
        if (transactions && transactions.length > 0) {
            for (let i = 0; i < transactions.length; i++) {
                await this.transactionRepository.update(transactions[i]._id, {
                    typeCrunch: undefined,
                    coaId: undefined
                });
            };
        }
        return true;
    }

    async deleteAllByUser(originId: string, clientId: string): Promise<boolean> {
        if (!originId)
            return false;

        let manager = await AuthorizationHelper.userService.get(originId);
        let roleSuperAdmin = await BusinessLoader.roleBusiness.getByCode(RoleCode.SuperAdmin);
        if (!manager || !manager.permission || !manager.permission.role || !roleSuperAdmin || manager.permission.role.toString() !== roleSuperAdmin._id)
            return false;

        let results = await this.transactionRepository.findAll({query: {userId: DataHelper.toObjectId(clientId)}});
        for (let i = 0; i < results.length; i++) {
            await this.transactionRepository.delete(results[i]._id, true);
        }
        return false;
    }
}

Object.seal(TransactionBusiness);
export default TransactionBusiness;
