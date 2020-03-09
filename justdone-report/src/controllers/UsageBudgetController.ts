import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IUsageBudgetBusiness from '../app/business/interfaces/IUsageBudgetBusiness'; // eslint-disable-line

class UsageBudgetController extends BaseController {
    private usageBudgetBusiness: IUsageBudgetBusiness = BusinessLoader.usageBudgetBusiness;

    constructor() {
        super();

        this.get('/', this.getByBeginYear.bind(this));
        this.get('/coa', this.getCoaUsageBudget.bind(this));
        this.post('/', this.createUsageBudget.bind(this));
        this.put('/', this.updateUsageBudget.bind(this));
    }

    async getCoaUsageBudget(req) {
        return await this.usageBudgetBusiness.getBudgetUsageCoa();
    }

    async getByBeginYear(req) {
        return await this.usageBudgetBusiness.getByBeginYear(req.query.userId, req.query.beginYear);
    }

    async createUsageBudget(req) {
        return await this.usageBudgetBusiness.createMultiple(req.body.userId, req.body.beginYear, req.body.coas);
    }

    async updateUsageBudget(req) {
        return await this.usageBudgetBusiness.updateUsageBudget(req.body.usageBudgets);
    }
}

Object.seal(UsageBudgetController);
export default UsageBudgetController;
