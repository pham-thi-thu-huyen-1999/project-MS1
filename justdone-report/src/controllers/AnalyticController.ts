import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import IAnalyticBussiness from '../app/business/interfaces/IAnalyticBusiness'; // eslint-disable-line

class AnalyticController extends BaseController {
    private analyticBusiness: IAnalyticBussiness = BusinessLoader.analyticBusiness;

    constructor() {
        super();

        this.get('/summary-clients', this.getSummaryClients.bind(this));
        this.get('/summary-managers', this.getSummaryManagers.bind(this));
        this.get('/inviteds', this.validatePagination(10), this.getUserInvited.bind(this));
        this.get('/count-inviteds', this.getCountUserInvited.bind(this));
        this.get('/client-not-assigned', this.validatePagination(10), this.getClientNotAssigned.bind(this));
        this.get('/count-client-assigned', this.getCountClientNotAssigned.bind(this));
        this.get('/crunch-clients', Authenticator.isAuthenticated, this.validatePagination(10), this.getCrunchClients.bind(this));
        this.get('/users-not-crunched', this.validatePagination(10), this.getUsersNotCrunch.bind(this));
        this.get('/count-users-not-crunched', this.getCountUsersNotCrunch.bind(this));
        this.get('/users-crunch-completed', this.validatePagination(10), this.getUsersCompletedCrunch.bind(this));
        this.get('/count-users-crunch-completed', this.getCountUsersCompletedCrunch.bind(this));
        this.get('/product-statistics', this.getProductStatistics.bind(this));
    }

    async getCrunchClients(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        req.query.roleCodes = req.query.roleCodes ? req.query.roleCodes.split(',').map(roleCode => Number(roleCode)) : [];
        req.query.isDeleted = JSON.parse(req.query.isDeleted);
        return await this.analyticBusiness.getCrunchClients(req[Authenticator.userKey]._id, req.query.productCodes, req.query.roleCodes, req.query.keyword, req.query.isDeleted, req.query.page, req.query.limit);
    }

    async getSummaryClients(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        return await this.analyticBusiness.getSummaryClients(req[Authenticator.userKey]._id, req.query.productCodes);
    }

    async getSummaryManagers(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        return await this.analyticBusiness.getSummaryManagers(req[Authenticator.userKey]._id, req.query.productCodes);
    }

    async getUserInvited(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        return await this.analyticBusiness.getUserInvited(req[Authenticator.userKey]._id, req.query.productCodes, req.query.page, req.query.limit);
    }

    async getCountUserInvited(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        return await this.analyticBusiness.getCountUserInvited(req[Authenticator.userKey]._id, req.query.productCodes);
    }

    async getClientNotAssigned(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        return await this.analyticBusiness.getClientNotAssigned(req[Authenticator.userKey]._id, req.query.productCodes, req.query.page, req.query.limit);
    }

    async getCountClientNotAssigned(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        return await this.analyticBusiness.getCountClientNotAssigned(req[Authenticator.userKey]._id, req.query.productCodes);
    }

    async getUsersNotCrunch(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        return await this.analyticBusiness.getUsersNotCrunch(req[Authenticator.userKey]._id, req.query.productCodes, req.query.page, req.query.limit);
    }

    async getCountUsersNotCrunch(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        return await this.analyticBusiness.getCountUsersNotCrunch(req[Authenticator.userKey]._id, req.query.productCodes);
    }

    async getUsersCompletedCrunch(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        return await this.analyticBusiness.getUsersCompletedCrunch(req[Authenticator.userKey]._id, req.query.productCodes, req.query.page, req.query.limit);
    }

    async getCountUsersCompletedCrunch(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        return await this.analyticBusiness.getCountUsersCompletedCrunch(req[Authenticator.userKey]._id, req.query.productCodes);
    }

    async getProductStatistics(req): Promise<any> {
        return await this.analyticBusiness.getProductStatistics(req[Authenticator.userKey]._id);
    }
}
Object.seal(AnalyticController);
export default AnalyticController;
