import Statement from 'justdone-system-package/dest/app/model/statement/Statement';
import StatementCreate from 'justdone-system-package/dest/app/model/statement/StatementCreate'; //eslint-disable-line

interface IStatementBusiness {
    create: (data: StatementCreate) => Promise<any>;
    getByEmail: (email: string) => Promise<any>;
    getByUserId: (userId: string) => Promise<any>;
    getStatementByFinaceYear: (originId: string, userId: string, accountId: string, type: number, beginYear: number, endYear: number) => Promise<Statement[]>;
    getStatementOfClient: (userId: string, managerId: string, accountId: string, type: number, year: number, month: number) => Promise<Statement | null>;
    updateOpenBalanceAndManual: (originId: string, userId: string, accountId: string, type: number, year: number, month: number, openBalance: number) => Promise<any>;
    checkConnectBank: (userId: string) => Promise<any>;
    createEmptyStatementOneByOneAccountId: (originId: string, data: any) => Promise<any>
    deleteAllByUser(originId: string, clientId: string): Promise<boolean>;
    updateNameFiled(): Promise<boolean>;
}

export default IStatementBusiness;
