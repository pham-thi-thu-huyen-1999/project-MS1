import TransactionCreate from 'justdone-system-package/dest/app/model/transaction/TransactionCreate'; // eslint-disable-line
import Transaction from 'justdone-system-package/dest/app/model/transaction/Transaction'; // eslint-disable-line
import ChartAccount from 'justdone-system-package/dest/app/model/chartAccount/ChartAccount'; // eslint-disable-line
import CrunchFilter from 'justdone-system-package/dest/app/model/crunchFilter/CrunchFilter';// eslint-disable-line

interface ITransactionBusiness {
    get(_id: string):Promise<Transaction | null>;
    getByEmail: (email: string) => Promise<any>;
    getAllTransactionToCrunch: (originId: string, userId: string, accountId: string, type: number, year: number, month: number, isAll?:boolean) => Promise<Transaction[]>;
    getTransactions: (originId: string, userId: string, accountId: string, type: number, year: number, month: number, page: number, limit: number) => Promise<Transaction[]>;
    getTransactionsForGJ(originId: string, userId: string, search: string, year: number, month: number, page: number, limit: number): Promise<Transaction[]>;
    getCruncherTransactions: (originId: string, userId: string, accountId: string, type: number, year: number, month: number, crunchType: number, coaId: string, page: number, limit: number) => Promise<Transaction[]>;
    getCountCruncherTransactions: (originId: string, userId: string, accountId: string, type: number, year: number, month: number, crunchType: number, coaId: string) => Promise<number>;
    getChartAccountForExpenses: (originId: string, userId: string, accountId: string, type: number, year: number, month: number, crunchType: number) => Promise<ChartAccount[]>
    getTransactionByCoa: (originId: string, coaId: string) => Promise<Transaction | null>;
    getAllTransactionsByCoaId: (originId: string, coaId: string) => Promise<Transaction[]>
    getAllTransactionByCrunchType: (originId: string, userId: string, accountId: string, type: number, crunchType: number, year: number, month: number) => Promise<object>;
    getCountTransactions: (originId: string, userId: string, accountId:string, type: number, year: number, month: number) => Promise<number>;
    getTransactionByTransactionIds(transactionIds:string[]):Promise<Transaction[]>;
    getAllTransactionByUserId: (userId: string) => Promise<Transaction[]>;
    totalAmountTransactionCruch: (originId: string, clientId: string, type: number, baseType: string, year: number, month: number) => Promise<number>;
    totalAmountTransactionChartAccount: (originId: string, clientId: string, type: number, year: number, month: number) => Promise<{ userId: string, coaId: string, baseType: string, amount: any }[]>;
    getTransactionsManual: (originId: string, manualTransaction: any, userId: string, accountId: string, type: number, year: number, month: number) => Promise<any>;
    createTransactionWithoutId: (originId:any, data: any) => Promise<any>;
    deleteAndUpdateStatement: (originId: string, data: any) => Promise<any>;
    findStartStatement: (originId: string, userId: string, accountId: string, type: number, year: number, month: number) => Promise<any>;
    createEmptyStatement: (originId: string, userId: string, accountId: string, type: number, year: number, month: number, openBalance: number) => Promise<any>;
    calcStatementByClosingBalance: (originId: string, userId: string, accountId: string, type: number, year: number, month: number) => Promise<any>
    checkStatementByMonth: (originId: string, userId: string, accountId: string, type: number) => Promise<any>;
    create: (data: TransactionCreate) => Promise<any>;
    removeWarningDuplicate:(_id: string, originId: string)=> Promise<boolean>;
    deleteTransaction: (_id: string, originId: string)=> Promise<boolean>
    // createCruncherPdfReport: (userId: string, originId: string, productCode: number, localtion: string, type: number, year: number, month: number) => Promise<any>;
    // createCruncherCsvReport: (userId: string, originId: string, productCode: number, localtion: string, type: number, year: number, month: number) => Promise<string>;
    update: (_id: string, data: any) => Promise<boolean>;
    updateManualTrans: (data: any) => Promise<boolean>;
    applyAdJustment(transactionId: string, typeCrunch: number, coaId: string):Promise<boolean>;
    updateCrunchType: (_id: string, managerId: string, crunchType: number) => Promise<boolean>;
    updateCoaCode: (_id: string, managerId: string, coaId: string) => Promise<boolean>;
    updateCrunchByTransactionId: (query: any, update: object) => Promise<boolean>;
    deleteCrunchType: (_id: string, managerId: string) => Promise<boolean>;
    crunchAutomation: (originId: string, clientId: string, accountId:string, type: number, year: number, month: number) => Promise<{filters: CrunchFilter[], transaction: Transaction}[]>;
    // previewCrunchAutomation: (originId: string, data:any) => Promise<Transaction[]>;
    previewCrunchAutomation: (originId: string, clientId: string, accountId: string, type: number, year: number, month: number, crunchFilter: CrunchFilter) => Promise<{correctList: Transaction[], incorrectList: Transaction[]}>;
    revertCruncherTransactions: (userId: string, accountId: string, type: number, year: number, month: number) => Promise<boolean>;
    deleteAllByUser(originId: string, clientId: string): Promise<boolean>;
}

export default ITransactionBusiness;
