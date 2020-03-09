import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import ITransactionBusiness from '../app/business/interfaces/ITransactionBusiness';
import {CrunchType} from 'justdone-system-package/dest/app/model/common/CommonType';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import UserAuthentication from 'justdone-system-package/dest/app/model/user/UserAuthentication'; // eslint-disable-line

class TransactionController extends BaseController {
    private transactionBusiness: ITransactionBusiness = BusinessLoader.transactionBusiness;

    constructor() {
        super();

        let validateCrunch = [{field: 'year', type: 'Y'}, {field: 'month', type: 'M'}, {field: 'crunchType', type: 'NUM'}, {field: 'type', type: 'NUM'}];
        // TODO: check this api
        this.get('/', Authenticator.isAuthenticated, this.validateData({field: 'type', type: 'NUM'}, {field: 'year', type: 'Y'}, {field: 'month', type: 'M'}), this.validatePagination(1000), this.getTransactions.bind(this));
        this.get('/search', Authenticator.isAuthenticated, this.validateData({field: 'type', type: 'NUM'}, {field: 'year', type: 'Y'}, {field: 'month', type: 'M'}), this.validatePagination(500), this.getTransactions.bind(this));
        this.get('/gj', Authenticator.isAuthenticated, this.validateData({field: 'year', type: 'Y'}, {field: 'month', type: 'M'}), this.validatePagination(1000), this.getTransactionsForGJ.bind(this));
        this.get('/count-search', Authenticator.isAuthenticated, this.validateData({field: 'type', type: 'NUM'}, {field: 'year', type: 'Y'}, {field: 'month', type: 'M'}), this.getCountTransactions.bind(this));
        this.get('/crunch/:userId', Authenticator.isAuthenticated, this.validateData({field: 'type', type: 'NUM'}, {field: 'year', type: 'Y'}, {field: 'month', type: 'M'}), this.validatePagination(-1), this.getCrunchTransactions.bind(this));
        this.get('/transaction-to-crunch', Authenticator.isAuthenticated, this.validateData(...validateCrunch), this.validatePagination(1000), this.getTransactionsToCrunch.bind(this));
        this.get('/count-transaction-to-crunch', Authenticator.isAuthenticated, this.validateData(...validateCrunch), this.getCountTransactionsToCrunch.bind(this));
        this.get('/expenses', Authenticator.isAuthenticated, this.validateData(...validateCrunch), this.validatePagination(1000), this.getTransactionsToExpenses.bind(this));
        this.get('/count-expenses', Authenticator.isAuthenticated, this.validateData(...validateCrunch), this.getCountTransactionsToExpenses.bind(this));
        this.get('/chart-account-for-expenses', Authenticator.isAuthenticated, this.validateData(...validateCrunch), this.getChartAccountForExpenses.bind(this));
        this.get('/expenses/chart-account', Authenticator.isAuthenticated, this.validatePagination(1000), this.getTransactionsToExpensesAndChartAccount.bind(this));
        this.get('/expenses/count-chart-account', Authenticator.isAuthenticated, this.getCountTransactionsToExpensesAndChartAccount.bind(this));
        this.get('/drawings', Authenticator.isAuthenticated, this.validateData(...validateCrunch), this.validatePagination(1000), this.getTransactionsToDrawings.bind(this));
        this.get('/count-drawings', Authenticator.isAuthenticated, this.validateData(...validateCrunch), this.getCountTransactionsToDrawings.bind(this));
        this.get('/income', Authenticator.isAuthenticated, this.validateData(...validateCrunch), this.validatePagination(1000), this.getTransactionsToIncome.bind(this));
        this.get('/count-income', Authenticator.isAuthenticated, this.validateData(...validateCrunch), this.getCountTransactionsToIncome.bind(this));
        this.get('/other', Authenticator.isAuthenticated, this.validateData(...validateCrunch), this.validatePagination(1000), this.getTransactionsToOther.bind(this));
        this.get('/count-other', Authenticator.isAuthenticated, this.validateData(...validateCrunch), this.getCountTransactionsToOther.bind(this));
        this.get('/crunch-automation', Authenticator.isAuthenticated, this.validateData({field: 'type', type: 'NUM'}, {field: 'year', type: 'Y'}, {field: 'month', type: 'M'}), this.crunchAutomation.bind(this));
        this.get('/manual-transaction', Authenticator.isAuthenticated, this.validateData(...validateCrunch), this.getTransactionsManual.bind(this));
        this.post('/preview-crunch-automation', Authenticator.isAuthenticated, this.validateData({field: 'type', type: 'NUM', target: 'query'}, {field: 'year', type: 'Y', target: 'query'}, {field: 'month', type: 'M', target: 'query'}), this.previewCrunchAutomation.bind(this));
        this.post('/createTransaction', Authenticator.isAuthenticated, this.createTransactionWithoutId.bind(this));
        this.post('/delete-and-update-statement', Authenticator.isAuthenticated, this.deleteAndUpdateStatement.bind(this));
        this.post('/find-start-statement', this.findStartStatement.bind(this));
        this.post('/calc-statement-by-closing', this.calcStatementByClosingBalance.bind(this));
        this.post('/check-statement-by-month', Authenticator.isAuthenticated, this.checkStatementByMonth.bind(this));
        this.put('/crunch-type/:_id', Authenticator.isAuthenticated, this.validateData({field: 'crunchType', type: 'NUM'}), this.updateCrunchType.bind(this));
        this.put('/chart-account/:_id', Authenticator.isAuthenticated, this.updateCoaCode.bind(this));
        this.put('/remove-transaction/:_id', Authenticator.isAuthenticated, this.deleteTransaction.bind(this));
        this.put('/remove-warning/:_id', Authenticator.isAuthenticated, this.removeWarningDuplicate.bind(this));
        this.put('/update-manual-trans', Authenticator.isAuthenticated, this.updateManualTrans.bind(this));
        this.delete('/crunch-type/:_id', Authenticator.isAuthenticated, this.deleteCrunchType.bind(this));
    }

    async checkStatementByMonth(req): Promise<any> {
        let userLogin: UserAuthentication = req[Authenticator.userKey];
        return await this.transactionBusiness.checkStatementByMonth(userLogin._id, req.body.userId, req.body.accountId, req.body.type);
    }

    async calcStatementByClosingBalance(req): Promise<any> {
        // let userLogin: UserAuthentication = req[Authenticator.userKey];
        return await this.transactionBusiness.calcStatementByClosingBalance(req.body.originId, req.body.userId, req.body.accountId, req.body.type, req.body.year, req.body.month);
    }

    // tìm startStatement và kết hợp createEmptyStatement luôn
    async findStartStatement(req): Promise<any> {
        let userLogin: UserAuthentication = req[Authenticator.userKey];
        return await this.transactionBusiness.findStartStatement(userLogin && userLogin._id ? userLogin._id : req.body.originId, req.body.userId, req.body.accountId, req.body.type, req.body.year, req.body.month);
    }

    async deleteAndUpdateStatement(req): Promise<any> {
        let userLogin: UserAuthentication = req[Authenticator.userKey];
        return await this.transactionBusiness.deleteAndUpdateStatement(userLogin._id, req.body);
    }

    async getTransactionsManual(req): Promise<any> {
        let userLogin: UserAuthentication = req[Authenticator.userKey];
        return await this.transactionBusiness.getTransactionsManual(userLogin._id, req.query.manualTransaction, req.query.userId, req.query.accountId, Number(req.query.type), Number(req.query.year), Number(req.query.month));
    }

    async createTransactionWithoutId(req): Promise<any> {
        let userLogin: UserAuthentication = req[Authenticator.userKey];
        return await this.transactionBusiness.createTransactionWithoutId(userLogin._id, req.body);
    }

    async getTransactions(req): Promise<any> {
        return await this.transactionBusiness.getTransactions(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, req.query.type, req.query.year, req.query.month, req.query.page, req.query.limit);
    }

    async getCountTransactions(req): Promise<any> {
        return await this.transactionBusiness.getCountTransactions(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, req.query.type, req.query.year, req.query.month);
    }

    async getTransactionsForGJ(req): Promise<any> {
        return await this.transactionBusiness.getTransactionsForGJ(req[Authenticator.userKey]._id, req.query.userId, req.query.search, req.query.year, req.query.month, req.query.page, req.query.limit);
    }

    async getCrunchTransactions(req): Promise<any> {
        return await this.transactionBusiness.getTransactions(req[Authenticator.userKey]._id, req.params.userId, req.query.accountId, req.query.type, req.query.year, req.query.month, req.query.page, req.query.limit);
    }

    async getTransactionsToCrunch(req): Promise<any> {
        return await this.transactionBusiness.getCruncherTransactions(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, Number(req.query.type), Number(req.query.year), Number(req.query.month), Number(req.query.crunchType), req.query.coaId, (req.query.page), (req.query.limit));
    }

    async getCountTransactionsToCrunch(req): Promise<any> {
        return await this.transactionBusiness.getCountCruncherTransactions(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, Number(req.query.type), Number(req.query.year), Number(req.query.month), Number(req.query.crunchType), req.query.coaId);
    }

    async getTransactionsToExpenses(req): Promise<any> {
        return await this.transactionBusiness.getCruncherTransactions(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, Number(req.query.type), Number(req.query.year), Number(req.query.month), CrunchType.Expenses, req.query.coaId, Number(req.query.page), Number(req.query.limit));
    }

    async getCountTransactionsToExpenses(req): Promise<any> {
        return await this.transactionBusiness.getCountCruncherTransactions(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, Number(req.query.type), Number(req.query.year), Number(req.query.month), CrunchType.Expenses, req.query.coaId);
    }

    async getChartAccountForExpenses(req): Promise<any> {
        return await this.transactionBusiness.getChartAccountForExpenses(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, Number(req.query.type), req.query.year, req.query.month, CrunchType.Expenses);
    }

    async getTransactionsToExpensesAndChartAccount(req): Promise<any> {
        return await this.transactionBusiness.getCruncherTransactions(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, Number(req.query.type), Number(req.query.year), Number(req.query.month), CrunchType.Expenses, req.query.coaId, Number(req.query.page), Number(req.query.limit));
    }

    async getCountTransactionsToExpensesAndChartAccount(req): Promise<any> {
        return await this.transactionBusiness.getCountCruncherTransactions(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, Number(req.query.type), Number(req.query.year), Number(req.query.month), CrunchType.Expenses, req.query.coaId);
    }

    async getTransactionsToDrawings(req): Promise<any> {
        return await this.transactionBusiness.getCruncherTransactions(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, Number(req.query.type), Number(req.query.year), Number(req.query.month), CrunchType.Drawings, req.query.coaId, Number(req.query.page), Number(req.query.limit));
    }

    async getCountTransactionsToDrawings(req): Promise<any> {
        return await this.transactionBusiness.getCountCruncherTransactions(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, Number(req.query.type), Number(req.query.year), Number(req.query.month), CrunchType.Drawings, req.query.coaId);
    }

    async getTransactionsToIncome(req): Promise<any> {
        return await this.transactionBusiness.getCruncherTransactions(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, Number(req.query.type), Number(req.query.year), Number(req.query.month), CrunchType.Income, req.query.coaId, Number(req.query.page), Number(req.query.limit));
    }

    async getCountTransactionsToIncome(req): Promise<any> {
        return await this.transactionBusiness.getCountCruncherTransactions(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, Number(req.query.type), Number(req.query.year), Number(req.query.month), CrunchType.Income, req.query.coaId);
    }

    async getTransactionsToOther(req): Promise<any> {
        return await this.transactionBusiness.getCruncherTransactions(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, Number(req.query.type), Number(req.query.year), Number(req.query.month), CrunchType.Other, req.query.coaId, Number(req.query.page), Number(req.query.limit));
    }

    async getCountTransactionsToOther(req): Promise<any> {
        return await this.transactionBusiness.getCountCruncherTransactions(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, Number(req.query.type), Number(req.query.year), Number(req.query.month), CrunchType.Other, req.query.coaId);
    }

    async crunchAutomation(req): Promise<any> {
        return await this.transactionBusiness.crunchAutomation(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, req.query.type, req.query.year, req.query.month);
    }

    async previewCrunchAutomation(req): Promise<any> {
        return await this.transactionBusiness.previewCrunchAutomation(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, req.query.type, req.query.year, req.query.month, req.body);
    }

    async updateCrunchType(req): Promise<any> {
        return await this.transactionBusiness.updateCrunchType(req.params._id, req[Authenticator.userKey]._id, req.body.crunchType);
    }

    async updateCoaCode(req): Promise<any> {
        return await this.transactionBusiness.updateCoaCode(req.params._id, req[Authenticator.userKey]._id, req.body.coaId);
    }

    async updateManualTrans(req): Promise<any> {
        return await this.transactionBusiness.updateManualTrans(req.body);
    }

    async removeWarningDuplicate(req): Promise<any> {
        return await this.transactionBusiness.removeWarningDuplicate(req.params._id, req[Authenticator.userKey]._id);
    }

    async deleteTransaction(req): Promise<any> {
        return await this.transactionBusiness.deleteTransaction(req.params._id, req[Authenticator.userKey]._id);
    }

    async deleteCrunchType(req): Promise<any> {
        return await this.transactionBusiness.deleteCrunchType(req.params._id, req[Authenticator.userKey]._id);
    }
}

Object.seal(TransactionController);
export default TransactionController;
