import IFinance from "./interfaces/IFinance";
declare class FinanceUpdate {
    userId?: string;
    financialYear?: string;
    currentProfit?: number;
    grossIncome?: number;
    expenseYear?: number;
    currentBas?: number;
    incomeTax?: number;
    integratedClient?: number;
    estimatedTax?: number;
    putAsidedBas?: number;
    monthlyDetail?: any;
    constructor(model: IFinance);
}
export default FinanceUpdate;
