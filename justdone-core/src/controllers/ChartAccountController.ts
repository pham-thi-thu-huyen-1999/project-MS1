import BaseController from './base/BaseController';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import ChartAccountBusiness from '../app/business/ChartAccountBusiness';
import IChartAccountBusiness from '../app/business/interfaces/IChartAccountBusiness';
import ChartAccountCreate from 'justdone-system-package/dest/app/model/chartAccount/ChartAccountCreate'; // eslint-disable-line
import ChartAccountUpdate from 'justdone-system-package/dest/app/model/chartAccount/ChartAccountUpdate';
import BusinessLoader from '../system/BusinessLoader';

class ChartAccountController extends BaseController {
    private chartAccountBusiness: IChartAccountBusiness = new ChartAccountBusiness();

    constructor() {
        super();

        this.get('/search', Authenticator.isAuthenticated, this.validatePagination(20), this.search.bind(this));
        this.get('/search-count', Authenticator.isAuthenticated, this.getCount.bind(this));
        this.get('/:_id', Authenticator.isAuthenticated, this.getChartAccountById.bind(this));
        this.get('/search-by-product', Authenticator.isAuthenticated, this.searchWithProduct.bind(this));
        this.get('/count-search-by-product', Authenticator.isAuthenticated, this.getCountWithProduct.bind(this));
        this.get('/chart-account-by-client', Authenticator.isAuthenticated, this.getCoaByClient.bind(this));
        this.get('/count-chart-account-by-client', Authenticator.isAuthenticated, this.getCountCoaByClient.bind(this));
        this.post('/status', Authenticator.isAuthenticated, this.getStatusChartAccount.bind(this));
        this.post('/', Authenticator.isAuthenticated, this.create.bind(this));
        this.post('/assign-clients', Authenticator.isAuthenticated, this.assignClients.bind(this));
        this.post('/client-assigned', Authenticator.isAuthenticated, this.removeClientAssigned.bind(this));

        this.put('/:_id', Authenticator.isAuthenticated, this.updateChartAccount.bind(this));
        this.patch('/remove-product/:_id', Authenticator.isAuthenticated, this.removeProduct.bind(this));

        this.delete('/:_id', Authenticator.isAuthenticated, this.deleteChartAccount.bind(this));
    }

    async getCount(req): Promise<any> {
        return await this.chartAccountBusiness.getCount(req.query.keyword);
    }

    async getStatusChartAccount(req): Promise<any> {
        return await this.chartAccountBusiness.getStatusChartAccount(req[Authenticator.userKey]._id, req.body.ids);
    }

    async getChartAccountById(req): Promise<any> {
        return await this.chartAccountBusiness.get(req.params._id);
    }

    async searchWithProduct(req): Promise<any> {
        return await this.chartAccountBusiness.searchWithProduct(req[Authenticator.userKey]._id, req[Authenticator.userKey].permission.product.code, Number(req.query.page), Number(req.query.limit), req.query.keyword);
    }

    async getCountWithProduct(req): Promise<any> {
        return await this.chartAccountBusiness.getCountWithProduct(req[Authenticator.userKey]._id, req[Authenticator.userKey].permission.product.code, req.query.keyword);
    }

    async getCoaByClient(req): Promise<any> {
        req.query.productCode = req.query.productCode ? Number(req.query.productCode) : 0;
        return await BusinessLoader.chartAccountAssignmentBusiness.getCoaByClient(req[Authenticator.userKey]._id, req.query.productCode, req.query.userId, req.query.keyword, Number(req.query.page), Number(req.query.limit));
    }

    async getCountCoaByClient(req): Promise<any> {
        req.query.productCode = req.query.productCode ? Number(req.query.productCode) : 0;
        return await BusinessLoader.chartAccountAssignmentBusiness.getCountCoaByClient(req[Authenticator.userKey]._id, req.query.productCode, req.query.userId, req.query.keyword);
    }

    async search(req): Promise<any> {
        return await this.chartAccountBusiness.search(req[Authenticator.userKey]._id, req.query.page, req.query.limit, req.query.keyword);
    }

    async create(req): Promise<any> {
        return await this.chartAccountBusiness.createChartAccount(req[Authenticator.userKey]._id, req.body);
    }

    async assignClients(req): Promise<any> {
        if (!req.body || !req.body.coaId || !req.body.productCode || !req.body.clientIds)
            return false;

        return await this.chartAccountBusiness.assignClients(req[Authenticator.userKey]._id, req.body.coaId, req.body.productCode, req.body.clientIds, req.body.actionSelectedAll);
    }

    async updateChartAccount(req): Promise<any> {
        return await this.chartAccountBusiness.updateChartAccount(req[Authenticator.userKey]._id, req.params._id, new ChartAccountUpdate(req.body));
    }

    async removeProduct(req): Promise<any> {
        return await this.chartAccountBusiness.removeProduct(req[Authenticator.userKey]._id, req.params._id, req.body.productCode);
    }

    async deleteChartAccount(req): Promise<any> {
        return await this.chartAccountBusiness.deleteChartAccount(req[Authenticator.userKey]._id, req.params._id);
    }

    async removeClientAssigned(req): Promise<any> {
        if (!req.body || !req.body.coaId || !req.body.productCode || !req.body.clientIds)
            return false;
        return await this.chartAccountBusiness.removeClientAssigned(req[Authenticator.userKey]._id, req.body.coaId, req.body.productCode, req.body.clientIds);
    }
}

Object.seal(ChartAccountController);
export default ChartAccountController;
