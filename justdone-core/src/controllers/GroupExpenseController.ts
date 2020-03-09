import BaseController from './base/BaseController';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import GroupExpenseBusiness from '../app/business/GroupExpenseBusiness';
import IGroupExpenseBusiness from '../app/business/interfaces/IGroupExpenseBusiness';
import GroupExpense from 'justdone-system-package/dest/app/model/groupExpense/GroupExpense'; // eslint-disable-line
import GroupExpenseCreate from 'justdone-system-package/dest/app/model/groupExpense/GroupExpenseCreate'; // eslint-disable-line
import GroupExpenseUpdate from 'justdone-system-package/dest/app/model/groupExpense/GroupExpenseUpdate'; // eslint-disable-line

class GroupExpenseController extends BaseController {
    private groupExpenseBusiness: IGroupExpenseBusiness = new GroupExpenseBusiness();

    constructor() {
        super();

        this.get('/list', Authenticator.isAuthenticated, this.validatePagination(100), this.getByUser.bind(this));
        this.get('/list/count', Authenticator.isAuthenticated, this.getCountByUser.bind(this));
        this.get('/:_id', Authenticator.isAuthenticated, this.getChartAccountByGroupId.bind(this));

        // this.post('/groups-by-coa', Authenticator.isAuthenticated, this.getGroupsByChartAccounts.bind(this));
        this.post('/', Authenticator.isAuthenticated, this.create.bind(this));

        this.put('/:_id', Authenticator.isAuthenticated, this.update.bind(this));
        this.put('/:_id/add-chart-account', Authenticator.isAuthenticated, this.addChartAccount.bind(this));
        this.put('/:_id/:coaId/remove-coa', Authenticator.isAuthenticated, this.removeCoa.bind(this));
        this.post('/order-group-expenses', Authenticator.isAuthenticated, this.orderGroupExpense.bind(this));

        this.delete('/:_id', Authenticator.isAuthenticated, this.deleteGroupExpense.bind(this));

        this.get('/test', Authenticator.isAuthenticated, this.getAllByUser.bind(this));
    }

    async getAllByUser(req): Promise<any> {
        return await this.groupExpenseBusiness.getAllByUser(req[Authenticator.userKey]._id);
    }

    async getByUser(req): Promise<any> {
        return await this.groupExpenseBusiness.getByUser(req[Authenticator.userKey]._id, req.query.page, req.query.limit);
    }

    async getCountByUser(req): Promise<any> {
        return await this.groupExpenseBusiness.getCountByUser(req[Authenticator.userKey]._id);
    }

    async getChartAccountByGroupId(req): Promise<any> {
        return await this.groupExpenseBusiness.getChartAccountByGroupId(req[Authenticator.userKey]._id, req.params._id);
    }

    // async getGroupsByChartAccounts(req): Promise<any> {
    //     return await this.groupExpenseBusiness.getGroupsByChartAccounts(req.body.coaIds);
    // }

    async create(req): Promise<any> {
        req.body.userId = req[Authenticator.userKey]._id;
        return await this.groupExpenseBusiness.createGroupExpense(req[Authenticator.userKey]._id, req.body);
    }

    async update(req): Promise<any> {
        req.body.userId = req[Authenticator.userKey]._id;
        return await this.groupExpenseBusiness.updateGroupExpense(req[Authenticator.userKey]._id, req.params._id, new GroupExpenseUpdate(req.body));
    }

    async orderGroupExpense(req): Promise<any> {
        return await this.groupExpenseBusiness.orderGroupExpense(req[Authenticator.userKey]._id, req.body);
    }

    async addChartAccount(req): Promise<any> {
        return await this.groupExpenseBusiness.addChartAccount(req.params._id, req[Authenticator.userKey]._id, req.body.coas);
    }

    async removeCoa(req): Promise<any> {
        return await this.groupExpenseBusiness.removeCoa(req[Authenticator.userKey]._id, req.params._id, req.params.coaId);
    }

    async deleteGroupExpense(req): Promise<any> {
        return await this.groupExpenseBusiness.deleteGroupExpense(req[Authenticator.userKey]._id, req.params._id);
    }
}

Object.seal(GroupExpenseController);
export default GroupExpenseController;
