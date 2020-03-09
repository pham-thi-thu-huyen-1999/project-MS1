import IStatement from "./interfaces/IStatement";
declare class StatementUpdate {
    openBalance?: number;
    closeBalance?: number;
    transactionFailed?: boolean;
    manualStatement?: boolean;
    constructor(model: IStatement);
}
export default StatementUpdate;
