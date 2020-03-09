import IBaseBusiness from './base/IBaseBusiness';
import Transaction from 'justdone-system-package/dest/app/model/transaction/Transaction';
import TransactionUpdate from 'justdone-system-package/dest/app/model/transaction/TransactionUpdate'; // eslint-disable-line
import TransactionCreate from 'justdone-system-package/dest/app/model/transaction/TransactionCreate'; // eslint-disable-line
import {BankType} from 'justdone-system-package/dest/app/model/common/CommonType'; // eslint-disable-line

interface ITransactionBusiness extends IBaseBusiness<Transaction> {
    getList: (page: number, limit: number) => Promise<Transaction[]>;
    create: (data: TransactionCreate) => Promise<Transaction>;
    update: (_id: string, data: TransactionUpdate) => Promise<boolean>;
    deleteByTransactionId: (transactionId: string) => Promise<boolean>;
    markTransactionFixDuplicate: (_id: string)=> Promise<boolean>
    getTransactionsByMonth: (userId: string, accountId: string, type: BankType, month: number, year: number) => Promise<Transaction[]>;
    getTransactionOldest: (userId:string, type:BankType) => Promise<Transaction | null> ;
    createTransactions: (data: TransactionCreate[]) => Promise<Transaction[]>;
    createTransactionFixData: () => any;
    undeleteTransaction: (transactionId: string) => Promise<any>;
    createList: (data: Transaction[]) => Promise<void>;
}

export default ITransactionBusiness;
