import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import IFinanceBusiness from '../app/business/interfaces/IFinanceBusiness';
import FinanceCreate from 'justdone-system-package/dest/app/model/finance/FinanceCreate';
import FinanceUpdate from 'justdone-system-package/dest/app/model/finance/FinanceUpdate';

class FinanceController extends BaseController {
    private financeBusiness: IFinanceBusiness = BusinessLoader.financeBusiness;

    constructor() {
        super();

        this.get('/:financialYear', this.getByUserIdAndYearFinance.bind(this));
        this.get('/:userId/:financialYear', this.getFinanceByClientId.bind(this));

        this.post('/', this.createDashboard.bind(this));

        this.put('/', this.createOrUpdateFinance.bind(this));
        this.put('/:_id', this.updateFinance.bind(this));
        this.put('/current-profit', this.validateData({field: 'value', type: 'NUM'}), this.updateCurrentProfit.bind(this));
        this.put('/gross-income', this.validateData({field: 'value', type: 'NUM'}), this.updateGrossIncome.bind(this));
        this.put('/expense-year', this.validateData({field: 'value', type: 'NUM'}), this.updateExpenseYear.bind(this));
        this.put('/current-bas', this.validateData({field: 'value', type: 'NUM'}), this.updateCurrentBas.bind(this));
        this.put('/income-tax', this.validateData({field: 'value', type: 'NUM'}), this.updateIncomeTax.bind(this));
        this.put('/integrated-client', this.validateData({field: 'value', type: 'NUM'}), this.updateIntegratedClient.bind(this));
        this.put('/estimated-tax', this.validateData({field: 'value', type: 'NUM'}), this.updateEstimatedTax.bind(this));
        this.put('/put-aside-bas', this.validateData({field: 'value', type: 'NUM'}), this.updatePutAsidedBas.bind(this));
        this.put('/monthly-detail', this.updateMonthlyDetail.bind(this));

        this.delete('/:_id', this.deleteFinance.bind(this));
    }

    async getByUserIdAndYearFinance(req): Promise<any> {
        return await this.financeBusiness.getByUserIdAndYearFinance(req[Authenticator.userKey]._id, req.params.financialYear);
    }

    async getFinanceByClientId(req): Promise<any> {
        return await this.financeBusiness.getByUserIdAndYearFinance(req.params.userId, req.params.financialYear);
    }

    async createDashboard(req): Promise<any> {
        return await this.financeBusiness.create(new FinanceCreate(req.body));
    }

    async updateCurrentProfit(req): Promise<any> {
        return await this.financeBusiness.updateCurrentProfit(req.body.userId, req.body.financialYear, req.body.value);
    }

    async updateGrossIncome(req): Promise<any> {
        return await this.financeBusiness.updateGrossIncome(req.body.userId, req.body.financialYear, req.body.value);
    }

    async updateExpenseYear(req): Promise<any> {
        return await this.financeBusiness.updateExpenseYear(req.body.userId, req.body.financialYear, req.body.value);
    }

    async updateCurrentBas(req): Promise<any> {
        return await this.financeBusiness.updateCurrentBas(req.body.userId, req.body.financialYear, req.body.value);
    }

    async updateIncomeTax(req): Promise<any> {
        return await this.financeBusiness.updateIncomeTax(req.body.userId, req.body.financialYear, req.body.value);
    }

    async updateIntegratedClient(req): Promise<any> {
        return await this.financeBusiness.updateIntegratedClient(req.body.userId, req.body.financialYear, req.body.value);
    }

    async updateEstimatedTax(req): Promise<any> {
        return await this.financeBusiness.updateEstimatedTax(req.body.userId, req.body.financialYear, req.body.value);
    }

    async updatePutAsidedBas(req): Promise<any> {
        return await this.financeBusiness.updatePutAsidedBas(req.body.userId, req.body.financialYear, req.body.value);
    }

    async updateMonthlyDetail(req): Promise<any> {
        return await this.financeBusiness.updateMonthlyDetail(req.body.userId, req.body.financialYear, req.body.monthlyDetail);
    }

    async getFinances(req): Promise<any> {
        return await this.financeBusiness.getList(req.params.page, req.params.limit);
    }

    async getCountFinances(req): Promise<any> {
        return await this.financeBusiness.getCount();
    }

    async getFinanceById(req): Promise<any> {
        return await this.financeBusiness.get(req.params._id);
    }

    async createFinance(req): Promise<any> {
        return await this.financeBusiness.create(new FinanceCreate(req.body));
    }

    async updateFinance(req): Promise<any> {
        return await this.financeBusiness.update(req.params._id, new FinanceUpdate(req.body));
    }

    async createOrUpdateFinance(req): Promise<any> {
        return await this.financeBusiness.createOrUpdate(new FinanceUpdate(req.body));
    }

    async deleteFinance(req): Promise<any> {
        return await this.financeBusiness.delete(req.params._id);
    }
}

Object.seal(FinanceController);
export default FinanceController;
