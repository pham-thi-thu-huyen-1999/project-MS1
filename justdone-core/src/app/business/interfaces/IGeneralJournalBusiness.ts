import GeneralJournal from 'justdone-system-package/dest/app/model/generalJournal/GeneralJournal';// eslint-disable-line
import GeneralJournalCreate from 'justdone-system-package/dest/app/model/generalJournal/GeneralJournalCreate';// eslint-disable-line
import GeneralJournalItem from 'justdone-system-package/dest/app/model/generalJournalItem/GeneralJournalItem';
import GeneralJournalItemCreate from 'justdone-system-package/dest/app/model/generalJournalItem/GeneralJournalItemCreate';// eslint-disable-line

interface IGeneralJournalBusiness {
    generateGJCode(userId:string, year:number, beginYear:number):Promise<string>;
    getGeneralJournalTotal(userId:string, beginMonth: number, beginYear:number, endMonth: number, endYear: number):Promise<number>;
    getGeneralJournal(userId:string, beginMonth: number, beginYear:number, endMonth: number, endYear: number, page: number, limit:number):Promise<GeneralJournal[]>;
    getGeneralJournalItem(gjId: string, page: number, limit:number):Promise<GeneralJournalItem[]>;
    getGeneralJournalItemTotal(gjId: string):Promise<number>;
    createGeneralJournalAndItems(userId: string, month: number, year: number, beginYear: number, note: string, gjItems: GeneralJournalItemCreate[]):Promise<any>;
    createGeneralJournalItem(gjItem: GeneralJournalItemCreate): Promise<GeneralJournalItem | null>;
    createGeneralJournal(userId:string, month:number, year: number, beginYear: number, note:string): Promise<GeneralJournal | null>;
    // createGeneralJournalItem(gjId:string, userId:string, transactionId:string, coaId: string, note:string, month:number): Promise<GeneralJournalItem | null>;
    moveClientInProduct(userId:string, productId: string): Promise<boolean>;
    updateDateGeneralJournal(_id: string, month: number, year: number): Promise<any>;
    updateGeneralJournal(_id:string, data :any): Promise<boolean>;
    updateGeneralJournalNote(_id:string, note :string): Promise<boolean>;
    updateGeneralJournalItem(_id:string, data :any): Promise<any>;
    updateEvidenced(_id:string, fileCreate:any): Promise<boolean>;
    deleteGeneralJournal(userId:string, _id:string):Promise<boolean>
    deleteGeneralJournalItem(userId, _id:string):Promise<boolean>;
}

export default IGeneralJournalBusiness;
