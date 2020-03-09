import IBaseModel from '../../common/interfaces/IBaseModel';
import { CrunchType } from '../../common/CommonType';
interface IGeneralJournalTransaction extends IBaseModel {
    amount: number;
    description: string;
    userId: any;
    isCredit: boolean;
    typeCrunch: CrunchType;
    month: number;
    year: number;
    coaId: any;
}
export default IGeneralJournalTransaction;
