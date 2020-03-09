import Statement from 'justdone-system-package/dest/app/model/statement/Statement';

interface IStatementBusiness {
    getStatementOfClient: (userId: string, managerId: string, accountId: string, type: number, year: number, month: number) => Promise<Statement | null>;
    getStatementOfClientforBalanceSheetReport: (userId: string, managerId: string, year: number, month: number)=> Promise<Statement[]>;
    getStatementForYTD: (userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number)=> Promise<Statement[]>;
}

export default IStatementBusiness;
