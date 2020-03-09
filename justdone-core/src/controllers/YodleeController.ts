import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IYodleeBusiness from '../app/business/interfaces/IYodleeBusiness';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';

class YodleeController extends BaseController {
    private yodleeBusiness: IYodleeBusiness = BusinessLoader.yodleeBusiness;

    constructor() {
        super();

        this.get('/providers', this.validatePagination(50), this.getProviders.bind(this));
        this.get('/form-login-bank-user-old/:providerId/:bankId', this.getFormUpdateUserOld.bind(this));
        this.get('/form-login-bank/:providerId', this.getFormLoginBank.bind(this));
        this.get('/form-update-bank', this.validateData({field: 'type', type: 'NUM'}), this.getFormUpdateBank.bind(this));
        this.get('/connecting-bank-status/:providerAccountId', this.getStatusConnectingBank.bind(this));
        this.get('/bank-accounts', this.getBankAccounts.bind(this));
        this.get('/transaction', this.loadTransactionAndSave.bind(this));
        this.get('/public-key', this.getPublicKey.bind(this));

        this.post('/bank', this.validateData({field: 'type', type: 'NUM'}), this.addYodleeBank.bind(this));
        this.post('/', this.validateData({field: 'mtp', type: 'NUM'}), this.yodleeData.bind(this));

        this.put('/bank', this.validateData({field: 'type', type: 'NUM', target: 'params'}), this.updateBank.bind(this));
        this.put('/remove-reconect', this.removeReconectBank.bind(this));
        this.delete('/bank', this.removeYodleeBank.bind(this));
    }

    async getProviders(req): Promise<any> {
        return await this.yodleeBusiness.getProviders(req.query.page, req.query.limit, req.query.searchTerm);
    }

    async getFormLoginBank(req): Promise<any> {
        return await this.yodleeBusiness.getFormLoginBank(req[Authenticator.userKey]._id, req.params.providerId);
    }

    async getFormUpdateUserOld(req): Promise<any> {
        return await this.yodleeBusiness.getFormUpdateUserOld(req[Authenticator.userKey]._id, req.params.providerId, req.params.bankId);
    }

    async getFormUpdateBank(req): Promise<any> {
        return await this.yodleeBusiness.getFormUpdatebank(req[Authenticator.userKey]._id, Number(req.query.type));
    }

    async getStatusConnectingBank(req): Promise<any> {
        return await this.yodleeBusiness.getStatusConnectingBank(req[Authenticator.userKey]._id, req.params.providerAccountId);
    }

    async getBankAccounts(req): Promise<any> {
        return await this.yodleeBusiness.getBankAccounts(req[Authenticator.userKey]._id, req.query.providerAccountId, req.query.providerId);
    }

    async getPublicKey(req): Promise<any> {
        return await this.yodleeBusiness.getPublicKey();
    }

    async loadTransactionAndSave(req): Promise<any> {
        return await this.yodleeBusiness.loadTransactionAndSave(req[Authenticator.userKey]._id, req.query.providerAccountId);
    }

    async addYodleeBank(req): Promise<any> {
        return await this.yodleeBusiness.addBank(req[Authenticator.userKey]._id, req.body.providerId, req.body.loginForm);
    }

    async yodleeData(req): Promise<any> {
        return await this.yodleeBusiness.yodleeValidateData(req[Authenticator.userKey]._id, req.body.track, req.body.mtp);
    }

    async updateBank(req): Promise<any> {
        return await this.yodleeBusiness.updateBank(req[Authenticator.userKey]._id, req.body.type, req.body.loginForm);
    }

    async removeReconectBank(req): Promise<any> {
        return await this.yodleeBusiness.removeReconectBank(req[Authenticator.userKey]._id, Number(req.body.type));
    }

    async removeYodleeBank(req): Promise<any> {
        return await this.yodleeBusiness.removeBank(req[Authenticator.userKey]._id, req.body.providerAccountId);
    }
}

Object.seal(YodleeController);
export default YodleeController;
