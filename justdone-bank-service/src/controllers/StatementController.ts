import BusinessLoader from '../system/BusinessLoader';
import BaseController from './base/BaseController';
import StatementCreate from 'justdone-system-package/dest/app/model/statement/StatementCreate';
import StatementUpdate from 'justdone-system-package/dest/app/model/statement/StatementUpdate';

class StatementController extends BaseController {
    private statementBusiness = BusinessLoader.statementBusiness;

    constructor() {
        super();

        this.get('/list', this.getStatements.bind(this));
        this.get('/list/count', this.getCountStatements.bind(this));
        this.get('/:_id', this.getStatementById.bind(this));
        this.post('/', this.createStatement.bind(this));
        this.put('/:_id', this.updateStatement.bind(this));
        this.put('/update-statement-manual', this.updateStatementAndManual.bind(this));
        this.delete('/:_id', this.deleteStatement.bind(this));
    }

    async getStatements(req): Promise<any> {
        return await this.statementBusiness.find({userId: '5a1554a21c6f953770055f63'});
    }

    async getCountStatements(req): Promise<any> {
        return await this.statementBusiness.getCount();
    }

    async getStatementById(req): Promise<any> {
        return await this.statementBusiness.get(req.params._id);
    }

    async createStatement(req): Promise<any> {
        return await this.statementBusiness.create(new StatementCreate(req.body));
    }

    async updateStatement(req): Promise<any> {
        return await this.statementBusiness.update(req.params._id, new StatementUpdate(req.body));
    }

    async updateStatementAndManual(req): Promise<any> {
        return await this.statementBusiness.updateStatementAndManual(req.body);
    }

    async deleteStatement(req): Promise<any> {
        return await this.statementBusiness.delete(req.params._id);
    }
}

Object.seal(StatementController);
export default StatementController;
