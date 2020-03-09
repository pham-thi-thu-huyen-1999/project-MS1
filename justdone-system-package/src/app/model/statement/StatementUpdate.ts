import IStatement from "./interfaces/IStatement"; // eslint-disable-line

class StatementUpdate {
    openBalance?: number;
    closeBalance?: number;
    transactionFailed?: boolean;
    manualStatement?: boolean;

    constructor(model: IStatement) {
        if (!model)
            return;
        this.closeBalance = model.openBalance;
        this.closeBalance = model.closeBalance;
        this.transactionFailed = model.transactionFailed;
        this.manualStatement = model.manualStatement;
    }
}

Object.seal(StatementUpdate);
export default StatementUpdate;
