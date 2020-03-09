import IGeneralJournal from "./interfaces/IGeneralJournal";
declare class GeneralJournalCreate {
    userId: any;
    code: string;
    month: number;
    beginYear: number;
    productId: any;
    note?: string;
    constructor(model: IGeneralJournal);
}
export default GeneralJournalCreate;
