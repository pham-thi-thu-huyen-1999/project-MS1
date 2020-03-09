import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IStatementBusiness from '../app/business/interfaces/IStatementBusiness';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import UserAuthentication from 'justdone-system-package/dest/app/model/user/UserAuthentication'; // eslint-disable-line
// import Project from '../config/Project';
// import Project from '../config/Project';

class StatementController extends BaseController {
    private statementBusiness: IStatementBusiness = BusinessLoader.statementBusiness;

    constructor() {
        super();
        let validateFinanceYear = [{field: 'type', type: 'NUM'}, {field: 'beginYear', type: 'Y'}, {field: 'endYear', type: 'Y'}];
        this.get('/finance-year', this.validateData(...validateFinanceYear), this.getStatementsByFinaceYear.bind(this));
        this.get('/update-name-filed', this.updateNameFiled.bind(this));
        this.get('/year-month/:userId', this.validateData({field: 'type', type: 'NUM'}, {field: 'year', type: 'Y'}, {field: 'month', type: 'M'}), this.getStatementOfClient.bind(this));
        this.get('/check-connect-bank/:userId', this.checkConnectBank.bind(this));
        this.post('/create-statement-by-accountId', this.createEmptyStatementOneByOneAccountId.bind(this));
        this.put('/update-open-balance-and-manual', this.validateData({field: 'type', type: 'NUM'}, {field: 'year', type: 'Y'}, {field: 'month', type: 'M'}), this.updateOpenBalanceAndManual.bind(this));
    }

    async getStatementsByFinaceYear(req): Promise<any> {
        return await this.statementBusiness.getStatementByFinaceYear(req[Authenticator.userKey]._id, req.query.userId, req.query.accountId, req.query.type, req.query.beginYear, req.query.endYear);
    }

    async getStatementOfClient(req): Promise<any> {
        let userLogin: UserAuthentication = req[Authenticator.userKey];
        return await this.statementBusiness.getStatementOfClient(req.params.userId, userLogin._id, req.query.accountId, req.query.type, req.query.year, req.query.month);
    }

    async updateOpenBalanceAndManual(req): Promise<any> {
        // let userLogin: UserAuthentication = req[Authenticator.userKey];
        return await this.statementBusiness.updateOpenBalanceAndManual(req.body.originId, req.body.userId, req.body.accountId, req.body.type, req.body.year, req.body.month, req.body.openBalance);
    }

    async checkConnectBank(req): Promise<any> {
        // let userLogin: UserAuthentication = req[Authenticator.userKey];
        return await this.statementBusiness.checkConnectBank(req.params.userId);
    }

    async createEmptyStatementOneByOneAccountId(req): Promise<any> {
        let userLogin: UserAuthentication = req[Authenticator.userKey];
        return await this.statementBusiness.createEmptyStatementOneByOneAccountId(userLogin._id, req.body);
    }

    async updateNameFiled(req): Promise<any> {
        return await this.statementBusiness.updateNameFiled();
    }
}

Object.seal(StatementController);
export default StatementController;
