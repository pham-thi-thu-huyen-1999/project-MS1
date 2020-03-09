import BusinessLoader from '../system/BusinessLoader';
import BaseController from './base/BaseController';

class YodleeController extends BaseController {
    private yodleeBusiness = BusinessLoader.yodleeBusiness;

    constructor() {
        super();

        this.get('/providers/:userId', this.getProviders.bind(this));
        this.get('/cron/:userId', this.cronWithUserId.bind(this));
        this.get('/cron-custom/:userId/:month', this.cronCustom.bind(this));
        this.get('/cron-all/:pwd', this.cronAllUser.bind(this));
        this.get('/providers/:userId/:providerId', this.getProviderById.bind(this));
        this.get('/form-login-bank/:userId/:providerId', this.getFormLoginBank.bind(this));
        this.get('/connecting-bank-status/:userId/:providerAccountId', this.getStatusConnectingBank.bind(this));
        this.get('/statement/:userId/:selectAccountId/:type', this.getStatement.bind(this));
        this.get('/bank-accounts/:userId', this.getBankAccounts.bind(this));
        this.get('/all-bank/:userId', this.getAllProviders.bind(this));
        this.get('/public-key', this.getPublicKey.bind(this));
        this.get('/createtransactionfix', this.createTransactionFixData.bind(this));
        this.post('/', this.createYodleeAccount.bind(this));
        this.post('/transactions', this.getTransactionAllUser.bind(this));
        this.post('/transaction-intergrate', this.getTransactionFromYodlee.bind(this));
        this.post('/sync-yodlee', this.asyncYodlee.bind(this));
        this.post('/mark-transaction', this.markTransaction.bind(this));
        this.post('/transaction', this.getTransactionOneUser.bind(this));
        this.post('/add-bank', this.addYodleeBank.bind(this));
        this.post('/transaction-all/:pwd', this.loadStatementAllUser.bind(this));
        this.post('/calc-trans-by-closing', this.calcAndUpdateStatementWithClosing.bind(this));
        this.put('/update-bank', this.updateBank.bind(this));
        this.put('/update-openbalance', this.updateOpenBalance.bind(this));
        this.put('/update-openbalance-multi-bank', this.updateOpenBalaceMultiBank.bind(this));
        this.delete('remove-bank', this.removeYodleeBank.bind(this));
    }

    async calcAndUpdateStatementWithClosing(req) {
        return await this.yodleeBusiness.calcAndUpdateStatementWithClosing(req.body.transactions, req.body.closingBalance, req.body.statementId);
    }

    async markTransaction(req): Promise<any> {
        return await this.yodleeBusiness.markTransactionFixDuplicate(req.body.userId, req.body.month, req.body.year, req.body.acountId, req.body.type);
    }

    async asyncYodlee(req): Promise<any> {
        return await this.yodleeBusiness.syncTransactionWhenFixDuplicate(req.body.userId, req.body.month, req.body.year, req.body.acountId, req.body.type);
    }

    async createYodleeAccount(req): Promise<any> {
        return await this.yodleeBusiness.createAccount(req.body.userId, req.body.email);
    }

    async getProviders(req): Promise<any> {
        return await this.yodleeBusiness.getProviders(req.params.userId);
    }

    async getFormLoginBank(req): Promise<any> {
        return await this.yodleeBusiness.getFormLoginBank(req.params.userId, req.params.providerId);
    }

    async getTransactionFromYodlee(req): Promise<any> {
        return await this.yodleeBusiness.getTransactionsForTesting(req.body.userId, req.body.accountIdSelected, req.body.type, req.body.month, req.body.year);
    }

    async addYodleeBank(req): Promise<any> {
        return await this.yodleeBusiness.addBank(req.body.userId, req.body.providerId, req.body.loginForm);
    }

    async removeYodleeBank(req): Promise<any> {
        return await this.yodleeBusiness.removeBank(req.body.userId, req.body.providerAccountId);
    }

    // hỏi lại anh Hùng
    async cronCustom(req): Promise<any> {
        return await this.yodleeBusiness.cronWithUserIdCustom(req.params.userId, req.params.month);
    }

    async getStatusConnectingBank(req): Promise<any> {
        return await this.yodleeBusiness.getStatusConnectingBank(req.params.userId, req.params.providerAccountId);
    }

    async getStatement(req): Promise<any> {
        return this.yodleeBusiness.loadStatementAndSave(req.params.userId, req.params.selectAccountId, Number(req.params.type));
    }

    async getProviderById(req): Promise<any> {
        return await this.yodleeBusiness.getProviderById(req.params.userId, req.params.providerId);
    }

    async getBankAccounts(req): Promise<any> {
        return await this.yodleeBusiness.getBankAccounts(req.params.userId);
    }

    getAllProviders(req): Promise<any> {
        return this.yodleeBusiness.getAllProviders(req.params.userId);
    }

    async getPublicKey(req): Promise<any> {
        return await this.yodleeBusiness.getPublicKey();
    }

    // hỏi lại anh Hùng
    async cronWithUserId(req) {
        return await this.yodleeBusiness.cronWithUserId(req.params.userId);
    }

    async updateBank(req) {
        return await this.yodleeBusiness.updateBank(req.body.userId, req.body.providerId, req.body.loginForm);
    }

    async updateOpenBalance(req) {
        return await this.yodleeBusiness.updateOpenBalaceManual(req.body.userId, req.body.accountId, Number(req.body.month), Number(req.body.year), Number(req.body.type), Number(req.body.openBalance));
    }

    async updateOpenBalaceMultiBank(req) {
        return await this.yodleeBusiness.updateOpenBalaceMultiBank(req.body.userId, req.body.accountId, Number(req.body.month), Number(req.body.year), Number(req.body.type), Number(req.body.openBalance));
    }

    getTransactionAllUser(req) {
        let userName = req.body.userName;
        let password = req.body.password;
        if (userName === 'aragon' && password === 'Namtech@88')
            this.yodleeBusiness.getTransactionAllClient();
        return 'ok';
    }

    getTransactionOneUser(req) {
        let userName = req.body.userName;
        let password = req.body.password;
        if (userName === 'aragon' && password === 'Namtech@88')
            this.yodleeBusiness.getTrasactionOneClient(req.body.userId, req.body.selectAccountId, Number(req.body.type));
    }

    cronAllUser(req) {
        let pwd = req.params.pwd;
        if (pwd !== '016743@namtech')
            throw new Error('not found');
        else
            return this.yodleeBusiness.cronTransactionAllClient();
    }

    async loadStatementAllUser(req) {
        let pwd = req.params.pwd;
        if (pwd !== '016743@namtech')
            throw new Error('not found');
        else
            return this.yodleeBusiness.loadStatementAndSaveAll(req.body.ids);
    }

    createTransactionFixData(req) {
        this.yodleeBusiness.createTransactionFixData();
    }
}

Object.seal(YodleeController);
export default YodleeController;
