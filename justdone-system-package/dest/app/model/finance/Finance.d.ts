import IFinance from './interfaces/IFinance';
declare class Finance {
    _id: string;
    userId: any;
    financialYear: string;
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
    static parseArray(list: IFinance[]): Finance[];
}
export default Finance;
