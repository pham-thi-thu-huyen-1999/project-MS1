import IStatement from "./interfaces/IStatement";
import { BankType } from '../../model/common/CommonType';
declare class StatementCreate {
    userId: string;
    type: BankType;
    month: number;
    year: number;
    openBalance: number;
    closeBalance: number;
    accountId: string;
    transactionFailed?: boolean;
    manualStatement?: boolean;
    constructor(model: IStatement);
}
export default StatementCreate;
