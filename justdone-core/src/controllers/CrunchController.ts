import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import ICrunchBusiness from '../app/business/interfaces/ICrunchBusiness';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
class BudgetController extends BaseController {
    private crunchBusiness: ICrunchBusiness = BusinessLoader.crunchBusiness;

    constructor() {
        super();
        this.get('/crunch-filter-by-id', Authenticator.isAuthenticated, this.getCrunchFilterById.bind(this));
        this.get('/get-total-income', Authenticator.isAuthenticated, this.getTotalIncome.bind(this));
        this.get('/user-not-crunchs', Authenticator.isAuthenticated, this.validatePagination(10), this.getUserNotCrunch.bind(this));
        this.get('/count-user-uncompleted', Authenticator.isAuthenticated, this.getCountUserNotCrunch.bind(this));
        this.get('/user-completed-crunchs', Authenticator.isAuthenticated, this.validatePagination(10), this.getUserCompletedCrunch.bind(this));
        this.get('/count-user-completed', Authenticator.isAuthenticated, this.getCountUserCompletedCrunch.bind(this));
        this.get('/cruncher-filter', Authenticator.isAuthenticated, this.validatePagination(20), this.getCrunchFilter.bind(this));
        this.get('/count-cruncher-filter', Authenticator.isAuthenticated, this.validatePagination(20), this.getCountCrunchFilter.bind(this));
        this.get('/update-name-filed', this.updateNameFiled.bind(this));

        this.post('/crunch-filter', Authenticator.isAuthenticated, this.createCrunchFilter.bind(this));
        this.post('/status', Authenticator.isAuthenticated, this.getStatus.bind(this));
        this.post('/crunchs', Authenticator.isAuthenticated, this.getCrunchs.bind(this));
        this.post('/crunchs-all', this.crunchAll.bind(this));
        this.post('/aprove', Authenticator.isAuthenticated, this.updateApprove.bind(this));
        this.post('/data-reports', Authenticator.isAuthenticated, this.getDataReport.bind(this));
        this.post('/total-income-for-date', Authenticator.isAuthenticated, this.totalIncomeForDate.bind(this));
        this.post('/total-coa-for-date', Authenticator.isAuthenticated, this.totalChartAccountForDate.bind(this));
        this.put('/complete', Authenticator.isAuthenticated, this.updateCompleted.bind(this));
        this.put('/start', Authenticator.isAuthenticated, this.updateStart.bind(this));
        this.put('/unstart', Authenticator.isAuthenticated, this.updateUnStart.bind(this));
        this.put('/crunch-filter', Authenticator.isAuthenticated, this.updateCrunchFilter.bind(this));
        this.delete('/crunch-filter', Authenticator.isAuthenticated, this.deleteCunchFilter.bind(this));
    }

    async getCrunchFilterById(req): Promise<any> {
        return await this.crunchBusiness.getCrunchFilterById(req[Authenticator.userKey]._id, req.query.crunchfilterId);
    }

    async getTotalIncome(req): Promise<any> {
        return await this.crunchBusiness.getTotalIncome(req[Authenticator.userKey]._id);
    }

    async getStatus(req): Promise<any> {
        return await this.crunchBusiness.getStatusCrunch(req[Authenticator.userKey]._id, req.body.userIds);
    }

    async getCrunchs(req): Promise<any> {
        return await this.crunchBusiness.getCrunchs(req[Authenticator.userKey]._id, req.body.userId, req.body.type, req.body.beginYear);
    }

    async crunchAll(req): Promise<any> {
        return await this.crunchBusiness.completedAllUser();
    }

    async getUserNotCrunch(req): Promise<any> {
        return await this.crunchBusiness.getUsersNotCrunch(req[Authenticator.userKey]._id, Number(req.query.productCode), req.query.page, req.query.limit);
    }

    async getCountUserNotCrunch(req): Promise<any> {
        return await this.crunchBusiness.getCountUsersNotCrunch(req[Authenticator.userKey]._id, Number(req.query.productCode));
    }

    async getUserCompletedCrunch(req): Promise<any> {
        return await this.crunchBusiness.getUsersCompletedCrunch(req[Authenticator.userKey]._id, Number(req.query.productCode), req.query.page, req.query.limit);
    }

    async getCountUserCompletedCrunch(req): Promise<any> {
        return await this.crunchBusiness.getCountUsersCompletedCrunch(req[Authenticator.userKey]._id, Number(req.query.productCode));
    }

    // async getDataCrunchsReports(req): Promise<any> {
    //     return await this.crunchBusiness.getCrunchsByTime(req.body.userIds, req.body.type, req.body.beginYear, req.body.beginMonth, req.body.endYear, req.body.endMonth);
    // }

    async getDataReport(req): Promise<any> {
        return await this.crunchBusiness.getDataReport(req[Authenticator.userKey]._id, req[Authenticator.userKey].permission.product.code, req.body.managerId, req.body.userIds, req.body.beginYear, req.body.beginMonth, req.body.endYear, req.body.endMonth);
    }

    async totalIncomeForDate(req): Promise<any> {
        return await this.crunchBusiness.totalIncomeForDate(req[Authenticator.userKey]._id, req.body.userIds, req.body.type, req.body.beginYear, req.body.beginMonth, req.body.endYear, req.body.endMonth);
    }

    async totalChartAccountForDate(req): Promise<any> {
        return await this.crunchBusiness.totalChartAccountForDate(req[Authenticator.userKey]._id, req.body.userIds, req.body.type, req.body.coaIds, req.body.beginYear, req.body.beginMonth, req.body.endYear, req.body.endMonth);
    }

    async getCrunchFilter(req): Promise<any> {
        return await this.crunchBusiness.getCrunchFilter(req[Authenticator.userKey].permission.product.code, req[Authenticator.userKey]._id, req.query.userId, JSON.parse(req.query.isGlobal), req.query.startDate, req.query.endDate, req.query.searchText, req.query.page, req.query.limit);
    }

    async getCountCrunchFilter(req): Promise<any> {
        return await this.crunchBusiness.getCountCrunchFilter(req[Authenticator.userKey].permission.product.code, req[Authenticator.userKey]._id, req.query.userId, JSON.parse(req.query.isGlobal), req.query.startDate, req.query.endDate, req.query.searchText);
    }

    async createCrunchFilter(req): Promise<any> {
        return await this.crunchBusiness.createCrunchFilter(req[Authenticator.userKey]._id, req.body);
    }

    async updateCompleted(req): Promise<any> {
        return await this.crunchBusiness.completed(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, Number(req.query.type), Number(req.query.year), Number(req.query.month));
    }

    async updateStart(req): Promise<any> {
        return await this.crunchBusiness.started(req[Authenticator.userKey]._id, req.query.crunchId);
    }

    async updateUnStart(req): Promise<any> {
        return await this.crunchBusiness.unStarted(req[Authenticator.userKey]._id, req.query.crunchId);
    }

    async updateNameFiled(req): Promise<any> {
        return await this.crunchBusiness.updateNameFiled();
    }

    async updateApprove(req): Promise<any> {
        let msg = req.body.msg;
        let userId = req.body.userId;
        let type = req.body.type;
        let year = req.body.year;
        let month = req.body.month;
        return await this.crunchBusiness.approve(req[Authenticator.userKey]._id, userId, Number(type), Number(year), Number(month), msg);
    }

    async updateCrunchFilter(req): Promise<any> {
        return await this.crunchBusiness.updateCrunchFilter(req[Authenticator.userKey]._id, req.query.crunchfilterId, req.body);
    }

    async deleteCunchFilter(req): Promise<any> {
        return await this.crunchBusiness.deleteCunchFilter(req[Authenticator.userKey]._id, req.query.crunchfilterId);
    }
}

Object.seal(BudgetController);
export default BudgetController;
