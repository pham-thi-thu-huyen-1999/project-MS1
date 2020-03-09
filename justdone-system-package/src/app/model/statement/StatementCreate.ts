import IStatement from "./interfaces/IStatement"; // eslint-disable-line
import {BankType} from '../../model/common/CommonType';

class StatementCreate {
    userId: string;
    type: BankType;
    month: number;
    year: number;
    openBalance: number;
    closeBalance: number;
    accountId: string;
    transactionFailed?: boolean;
    manualStatement?: boolean;

    constructor(model: IStatement) {
        if (!model)
            return;

        this.userId = model.userId;
        this.type = model.type;
        this.month = model.month;
        this.year = model.year;
        this.openBalance = model.openBalance;
        this.closeBalance = model.closeBalance;
        this.accountId = model.accountId;
        this.transactionFailed = model.transactionFailed;
        this.manualStatement = model.manualStatement;
    }
}

Object.seal(StatementCreate);
export default StatementCreate;
