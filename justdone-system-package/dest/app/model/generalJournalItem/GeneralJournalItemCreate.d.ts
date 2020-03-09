import IGeneralJournalItem from "./interfaces/IGeneralJournalItem";
declare class GeneralJournalItemCreate {
    gjId: any;
    userId: any;
    evidenced?: any;
    type: number;
    transactionId?: any;
    extend?: any;
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
    isIncludeTax?: boolean;
    month: number;
    year: number;
    note?: string;
    constructor(model: IGeneralJournalItem);
    static parseArray(list: IGeneralJournalItem[]): GeneralJournalItemCreate[];
}
export default GeneralJournalItemCreate;
