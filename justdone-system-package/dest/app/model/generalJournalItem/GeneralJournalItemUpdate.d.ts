import IGeneralJournalItem from "./interfaces/IGeneralJournalItem";
import GeneralJournalItemExtend from './GeneralJournalItemExtend';
declare class GeneralJournalUpdate {
    note?: string;
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
    month?: number;
    year?: number;
    transactionId?: any;
    extend?: GeneralJournalItemExtend;
    isIncludeTax?: boolean;
    constructor(model: IGeneralJournalItem);
}
export default GeneralJournalUpdate;
