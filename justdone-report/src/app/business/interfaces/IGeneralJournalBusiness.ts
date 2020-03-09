import GeneralJournal from 'justdone-system-package/dest/app/model/generalJournal/GeneralJournal';// eslint-disable-line
import GeneralJournalCreate from 'justdone-system-package/dest/app/model/generalJournal/GeneralJournalCreate';// eslint-disable-line
import GeneralJournalItem from 'justdone-system-package/dest/app/model/generalJournalItem/GeneralJournalItem';
import GeneralJournalItemCreate from 'justdone-system-package/dest/app/model/generalJournalItem/GeneralJournalItemCreate';// eslint-disable-line
import Transaction from 'justdone-system-package/dest/app/model/transaction/Transaction';

interface IGeneralJournalBusiness {
    getGeneralJournalTotal(userId:string, beginYear: number):Promise<number>;
    getGeneralJournal(userId:string, beginYear: number, page: number, limit:number):Promise<GeneralJournal[]>;
    getNewTransactionGJByTime(userId: string, beginMonth:number, beginYear: number, endMonth: number, endYear: number):Promise<Transaction[]>;
    getNewTransactionBalanceSheetByTime(userId: string, month:number, year: number):Promise<Transaction[]>;
    getGeneralJournalItem(gjId: string, page: number, limit:number):Promise<GeneralJournalItem[]>;
    getGeneralJournalItemTotal(gjId: string):Promise<number>;
}

export default IGeneralJournalBusiness;
