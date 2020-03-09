import IGeneralJournalTransaction from './interfaces/IGeneralJournalTransaction';
declare class GeneralJournalTransactionUpdate {
    amount: number;
    description: string;
    isCredit: boolean;
    month: number;
    year: number;
    coaId: any;
    constructor(model: IGeneralJournalTransaction);
    static parseArray(list: IGeneralJournalTransaction[]): GeneralJournalTransactionUpdate[];
}
export default GeneralJournalTransactionUpdate;
