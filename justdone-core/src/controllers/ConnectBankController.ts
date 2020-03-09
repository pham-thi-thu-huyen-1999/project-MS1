import BaseController from './base/BaseController';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import ConnectBankBusiness from '../app/business/ConnectBankBusiness';
import IConnectBankBusiness from '../app/business/interfaces/IConnectBankBusiness';
// import ConnectBankCreate from 'justdone-system-package/dest/app/model/connectBank/ConnectBankCreate'; // eslint-disable-line
// import BusinessLoader from '../system/BusinessLoader';

class ConnectBankController extends BaseController {
    private connectBankBusiness: IConnectBankBusiness = new ConnectBankBusiness();

    constructor() {
        super();

        this.get('/', Authenticator.isAuthenticated, this.validatePagination(10), this.find.bind(this));
        this.get('/find-all-connect-bank', Authenticator.isAuthenticated, this.validatePagination(10), this.findAllConnectBank.bind(this));
        this.get('/count-connect-bank', Authenticator.isAuthenticated, this.countConnectBank.bind(this));
        this.get('/:_id', Authenticator.isAuthenticated, this.getConnectBank.bind(this));
        this.get('/provider-account/:_id', Authenticator.isAuthenticated, this.getConnectBankByProviderAccountId.bind(this));
        this.get('/account', Authenticator.isAuthenticated, this.getAccountConnectBanks.bind(this));
        this.get('/refresh-account', Authenticator.isAuthenticated, this.refreshAccounts.bind(this));
        this.get('/active-connect-bank/:_id', Authenticator.isAuthenticated, this.activeConnectBank.bind(this));

        this.post('/', Authenticator.isAuthenticated, this.createConnectBank.bind(this));
        this.post('/add-accounts', Authenticator.isAuthenticated, this.addAcountsConnectBank.bind(this));
        this.post('/create-connect-bank-by-user-email', Authenticator.isAuthenticated, this.createConnectBankByUserEmail.bind(this));
        this.post('/create-manual-account-number', Authenticator.isAuthenticated, this.createManualNumberAccount.bind(this));

        this.put('/:_id', Authenticator.isAuthenticated, this.updateConnectBank.bind(this));

        this.delete('/manual/:_id', Authenticator.isAuthenticated, this.deleteAccountManual.bind(this));
        this.delete('/:_id', Authenticator.isAuthenticated, this.deleteConnectBank.bind(this));
    }

    async find(req): Promise<any> {
        return await this.connectBankBusiness.find(req.query.id ? req.query.id : req[Authenticator.userKey]._id, req.query.page, req.query.limit);
    }

    async findAllConnectBank(req): Promise<any> {
        return await this.connectBankBusiness.findAll(req.query.id ? req.query.id : req[Authenticator.userKey]._id);
    }

    async countConnectBank(req): Promise<any> {
        return await this.connectBankBusiness.countConnectBank(req[Authenticator.userKey]._id);
    }

    async getConnectBank(req): Promise<any> {
        return await this.connectBankBusiness.getConnectBank(req[Authenticator.userKey]._id, req.params._id);
    }

    async getConnectBankByProviderAccountId(req): Promise<any> {
        return await this.connectBankBusiness.getConnectBankByProviderAccountId(req[Authenticator.userKey]._id, req.params._id);
    }

    async getAccountConnectBanks(req): Promise<any> {
        return await this.connectBankBusiness.getAccountConnectBanks(req[Authenticator.userKey]._id, req.query.providerAccountId, req.query.providerId);
    }

    async createConnectBank(req): Promise<any> {
        return await this.connectBankBusiness.createConnectBank(req[Authenticator.userKey]._id, req.body);
    }

    async createConnectBankByUserEmail(req): Promise<boolean> {
        return await this.connectBankBusiness.createConnectBankByUserEmail(req.body.email);
    }

    async createManualNumberAccount(req): Promise<any> {
        return await this.connectBankBusiness.createManualNumberAccount(req[Authenticator.userKey]._id, req.body);
    }

    async addAcountsConnectBank(req): Promise<any> {
        return await this.connectBankBusiness.addAcountsConnectBank(req[Authenticator.userKey]._id, req.query.connectBankId, req.body);
    }

    async activeConnectBank(req): Promise<any> {
        return await this.connectBankBusiness.activeConnectBank(req[Authenticator.userKey]._id, req.params._id);
    }

    async updateConnectBank(req): Promise<any> {
        return await this.connectBankBusiness.updateConnectBank(req[Authenticator.userKey]._id, req.params._id, req.body);
    }

    async refreshAccounts(req): Promise<any> {
        return await this.connectBankBusiness.refreshAccounts(req[Authenticator.userKey]._id, req.query.providerAccountId, req.query.providerId);
    }

    async deleteConnectBank(req): Promise<any> {
        return await this.connectBankBusiness.delete(req.params._id);
    }

    async deleteAccountManual(req): Promise<any> {
        return await this.connectBankBusiness.deleteAccountManual(req.params._id);
    }
}

Object.seal(ConnectBankController);
export default ConnectBankController;
