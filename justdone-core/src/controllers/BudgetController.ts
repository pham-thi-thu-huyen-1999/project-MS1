import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IBudgetBusiness from '../app/business/interfaces/IBudgetBusiness';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';

class BudgetController extends BaseController {
    private budgetBusiness: IBudgetBusiness = BusinessLoader.budgetBusiness;

    constructor() {
        super();

        let budgetValidate = [{field: 'beginYear', type: 'Y', required: true}, {field: 'beginMonth', type: 'M', required: true}, {field: 'endYear', type: 'Y', required: true}, {field: 'endMonth', type: 'M', required: true}];

        this.get('/', Authenticator.isAuthenticated, this.validateData(...budgetValidate), this.validatePagination(20), this.getBudgets.bind(this));
        this.get('/count', Authenticator.isAuthenticated, this.getCountBudget.bind(this));
        // this.get('budgets-to-data-report', this.validateData({field: 'beginYear', type: 'Y'}, {field: 'beginMonth', type: 'M'}, {field: 'endYear', type: 'Y'}, {field: 'endMonth', type: 'M'}), this.getBudgetForCrunch.bind(this));
        // this.get('/coa-amount-total', this.validateData({field: 'productCode', type: 'NUM'}, {field: 'year', type: 'Y'}, {field: 'month', type: 'M'}), this.totalAmountBudget.bind(this));
        this.post('/', Authenticator.isAuthenticated, this.createAndUpdateBudgets.bind(this));
    }

    async getBudgets(req): Promise<any> {
        req.query.productCode = req.query.productCode ? Number(req.query.productCode) : 0;
        return await this.budgetBusiness.getBudgets(req[Authenticator.userKey]._id, req.query.productCode, req.query.clientId, req.query.beginYear, req.query.beginMonth, req.query.endYear, req.query.endMonth, req.query.keyword, req.query.page, req.query.limit);
    }

    async getCountBudget(req): Promise<any> {
        req.query.productCode = req.query.productCode ? Number(req.query.productCode) : 0;
        return await this.budgetBusiness.getCountBudget(req[Authenticator.userKey]._id, req.query.productCode, req.query.clientId, req.query.keyword );
    }

    // async getBudgetForCrunch(req): Promise<any> {
    //     req.query.clientIds = req.query.clientIds ? req.query.clientIds.split(',') : [];
    //     req.query.coaIds = req.query.coaIds ? req.query.coaIds.split(',') : [];
    //     return await this.budgetBusiness.getBudgetForCrunch(req.query.clientIds, req.query.coaIds, req.query.beginYear, req.query.beginMonth, req.query.endYear, req.query.endMonth);
    // }

    // async totalAmountBudget(req): Promise<any> {
    //     req.query.clientIds = req.query.clientIds ? req.query.clientIds.split(',') : [];
    //     req.query.coaIds = req.query.coaIds ? req.query.coaIds.split(',') : [];
    //     return await this.budgetBusiness.totalAmountBudget(req.query.productCode, req.query.clientIds, req.query.coaIds, req.query.year, req.query.month);
    // }

    async createAndUpdateBudgets(req): Promise<any> {
        return await this.budgetBusiness.createAndUpdate(req[Authenticator.userKey]._id, req.body.productCode, req.body.clientId, req.body.coaId, req.body.budgets);
    }
}

Object.seal(BudgetController);
export default BudgetController;
