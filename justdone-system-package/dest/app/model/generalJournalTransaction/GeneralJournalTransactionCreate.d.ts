import IGeneralJournalTransaction from './interfaces/IGeneralJournalTransaction';
import { CrunchType } from '../common/CommonType';
declare class GeneralJournalTransactionCreate {
    amount: number;
    description: string;
    userId: any;
    isCredit: boolean;
    typeCrunch: CrunchType;
    month: number;
    year: number;
    coaId: any;
    constructor(model: IGeneralJournalTransaction);
    static parseArray(list: IGeneralJournalTransaction[]): GeneralJournalTransactionCreate[];
}
export default GeneralJournalTransactionCreate;
