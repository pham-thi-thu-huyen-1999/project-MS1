import IGeneralJournalItem from "./interfaces/IGeneralJournalItem";
import GeneralJournalItemExtend from './GeneralJournalItemExtend';
declare class GeneralJournalItem {
    _id: any;
    userId: any;
    gjId: any;
    type: number;
    evidenced?: any;
    transactionId?: any;
    extend?: GeneralJournalItemExtend;
    isIncludeTax?: boolean;
    before?: {
        coaId?: any;
        typeCrunch?: number;
        name?: String;
    };
    after: {
        coaId?: any;
        typeCrunch: number;
        name?: String;
    };
    month: number;
    year: number;
    note?: string;
    createdAt?: Date;
    constructor(model: IGeneralJournalItem);
    static parseArray(list: IGeneralJournalItem[]): GeneralJournalItem[];
}
export default GeneralJournalItem;
