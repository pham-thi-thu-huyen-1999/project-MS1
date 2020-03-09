import IBaseBusiness from './base/IBaseBusiness';
import Statement from 'justdone-system-package/dest/app/model/statement/Statement';
import StatementCreate from 'justdone-system-package/dest/app/model/statement/StatementCreate'; // eslint-disable-line
import StatementUpdate from 'justdone-system-package/dest/app/model/statement/StatementUpdate'; // eslint-disable-line

interface IStatementBusiness extends IBaseBusiness<Statement> {
    getList: (page: number, limit: number) => Promise<Statement[]>;
    getCount: () => Promise<number>;
    create: (data: StatementCreate) => Promise<Statement>;
    update: (_id: string, data: StatementUpdate) => Promise<boolean>;
    updateStatementAndManual: (data: any) => Promise<any>;
    find: (query: object) => Promise<Statement[]>
}

export default IStatementBusiness;
