import IFinance from "./interfaces/IFinance";
declare class FinanceCreate {
    userId: string;
    financialYear: string;
    constructor(model: IFinance);
}
export default FinanceCreate;
