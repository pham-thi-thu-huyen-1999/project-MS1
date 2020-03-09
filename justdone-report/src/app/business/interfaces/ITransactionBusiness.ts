import TransactionCreate from 'justdone-system-package/dest/app/model/transaction/TransactionCreate'; // eslint-disable-line
import Transaction from 'justdone-system-package/dest/app/model/transaction/Transaction'; // eslint-disable-line
import ChartAccount from 'justdone-system-package/dest/app/model/chartAccount/ChartAccount'; // eslint-disable-line

interface ITransactionBusiness {
    // getTransactionAccordingYearAndMonth(userId: string, startYear: number, startMonth: number, endYear: number, endMonth: number): Promise<any>;
    getTransactionForBalanceSheetReport: (userId: string, beginYear: number, endYear: number, startMonth: number, endMonth: number)=> Promise<any>;
    // groupByTransactionCrunchTypeExpensesForBalanceSheetReport: (userId: string, year: number, month: number) => Promise<any>;
    // groupByTransactionCrunchTypeDrawingsForBalanceSheetReport: (userId: string, year: number, month: number)=> Promise<any>;
    getAllTransaction: (userId: string, accountId: string, type: number, year: number, month: number) => Promise<Transaction[]>;
    getTransactionByMonths: (userId: string, accountId: string, type: number, timeQuery:{year:number, months:number[]}[])=> Promise<Transaction[]>;
    getTransactionByCrunchesTime: (userId: string, accountId: string, timeQuery:{year: number, months: number[], type: number}[]) => Promise<Transaction[]>;
    getTransactionForReport: (userId: string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number)=> Promise<any[]>;
    getTransactionManyBankForReport(userId: string, accountIds: string[], beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<any[]>;
    totalAmountTransactionCruch: (originId: string, clientId: string, accountId: string, type: number, baseType: string, year: number, month: number) => Promise<number>;
    totalAmountTransactionChartAccount: (originId: string, clientId: string, accountId: string, type: number, year: number, month: number) => Promise<{ userId: string, coaId: string, baseType: string, amount: any }[]>;
    getTransactionByFinalYear: (userId:string, accountId: string, beginMonth: number, beginYear:number, endMonth:number, endYear: number)=>Promise<Transaction[]>;
}

export default ITransactionBusiness;
