import IBaseModel from '../../common/interfaces/IBaseModel';
import { BankType } from '../../common/CommonType';
interface IStatement extends IBaseModel {
    userId: any;
    type: BankType;
    month: number;
    year: number;
    accountId: string;
    openBalance: number;
    closeBalance: number;
    transactionFailed?: boolean;
    manualStatement?: boolean;
}
export default IStatement;
