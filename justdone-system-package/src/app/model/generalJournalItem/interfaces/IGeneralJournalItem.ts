import IBaseModel from '../../common/interfaces/IBaseModel';
import GeneralJournalItemExtend from '../GeneralJournalItemExtend';
interface IGeneralJournal extends IBaseModel {
    gjId: any;
    userId: any;
    evidenced?: any;
    type:number;
    transactionId?: any;
    extend?: GeneralJournalItemExtend;
    isIncludeTax?: boolean;
    before?: {
        coaId?:any,
        typeCrunch?:number
    };
    after: {
        coaId?:any,
        typeCrunch:number
    }
    month: number;
    year: number;
    note?: string
}

export default IGeneralJournal;
