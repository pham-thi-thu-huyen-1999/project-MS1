import IStatementBusiness from './interfaces/IStatementBusiness'; // eslint-disable-line
import Statement from 'justdone-system-package/dest/app/model/statement/Statement';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import StatementRepository from 'justdone-system-package/dest/app/repository/StatementRepository';

class StatementBusiness implements IStatementBusiness {
    private statementRepository: StatementRepository;

    constructor() {
        this.statementRepository = new StatementRepository();
    }

    async getStatementOfClient(userId: string, managerId: string, accountId: string, type: number, year: number, month: number): Promise<Statement | null> {
        let params = {
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                year: year,
                month: month,
                accountId: accountId
            },
            populate: {
                path: 'userId',
                match: {
                    'permission.managers': {
                        $in: [DataHelper.toObjectId(managerId)]
                    },
                },
                select: 'permission.managers',
            }
        };

        if (type)
            params.query.type = type;

        let statement = await this.statementRepository.findOne(params);
        return statement && new Statement(statement);
    }

    async getStatementOfClientforBalanceSheetReport(userId: string, managerId: string, year: number, month: number): Promise<Statement[]> {
        let params = {
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                year: year,
                month: month
            },
            populate: [{
                path: 'userId',
                match: {
                    'permission.managers': {
                        $in: [DataHelper.toObjectId(managerId)]
                    },
                },
                select: 'permission.managers',
            }]
        };

        let statements = await this.statementRepository.findAll(params);
        return Statement.parseArray(statements);
    }

    async getStatementForYTD(userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<Statement[]> {
        let params = {
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                $and: [{
                    month: {
                        $gte: beginMonth
                    },
                    year: {
                        $eq: beginYear
                    }
                }, {
                    month: {
                        $lte: endMonth
                    },
                    year: {
                        $eq: endYear
                    }
                }]
            }
        };
        let statements = await this.statementRepository.findAll(params);
        return Statement.parseArray(statements);
    }
}

Object.seal(StatementBusiness);
export default StatementBusiness;
