import Statement from 'justdone-system-package/dest/app/model/statement/Statement';
import StatementCreate from 'justdone-system-package/dest/app/model/statement/StatementCreate'; // eslint-disable-line
import StatementUpdate from 'justdone-system-package/dest/app/model/statement/StatementUpdate'; // eslint-disable-line
import IStatementBusiness from './interfaces/IStatementBusiness'; // eslint-disable-line
import StatementRepository from 'justdone-system-package/dest/app/repository/StatementRepository';

class StatementBusiness implements IStatementBusiness {
    private statementRepository: StatementRepository;

    constructor() {
        this.statementRepository = new StatementRepository();
    }

    async getList(page: number, limit: number): Promise<Statement[]> {
        let statements = await this.statementRepository.find(null, null, page, limit);
        return Statement.parseArray(statements);
    }

    async getCount(): Promise<number> {
        return await this.statementRepository.getCount();
    }

    async find(query: object): Promise<Statement[]> {
        let statements = await this.statementRepository.findAll({query: query});
        return statements;
    }

    async get(_id: string): Promise<Statement | null> {
        if (!_id)
            return null;

        let statement = await this.statementRepository.get(_id);
        return statement && new Statement(statement);
    }

    async create(data: StatementCreate): Promise<Statement> {
        let statement;
        statement = await this.statementRepository.create(data);

        return statement && new Statement(statement);
    }

    async updateStatementAndManual(data: any): Promise<any> {
        let statement = await this.get(data.statementId);
        // console.log('=>>>>>>>>>>>>>', statement);
        let openOld;

        if (!statement)
            return false;

        if (statement)
            openOld = statement.openBalance;

        let dataUpdate = {
            openBalance: data.openBalance ? data.openBalance : openOld,
            manualStatement: data.manualStatement
        };

        let resultUpdate = await this.update(statement._id, dataUpdate);

        if (!resultUpdate)
            return false;

        return true;
    }

    async update(_id: string, data: StatementUpdate): Promise<boolean> {
        return await this.statementRepository.update(_id, data);
    }

    async delete(_id: string): Promise<boolean> {
        return await this.statementRepository.delete(_id);
    }
}

// function validateName(name: string): boolean {
//     if (!name)
//         throw new Error('Name is required!');
//     else if (name.trim().length < 4)
//         throw new Error('Minimum name is 4 characters!');

//     return true;
// }

Object.seal(StatementBusiness);
export default StatementBusiness;
