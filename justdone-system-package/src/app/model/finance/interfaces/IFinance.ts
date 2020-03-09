import IBaseModel from '../../common/interfaces/IBaseModel';

interface IFinance extends IBaseModel {
    userId: any,
    financialYear: string,
    currentProfit?: number,
    grossIncome?: number,
    expenseYear?: number,
    currentBas?: number,
    incomeTax?: number,
    integratedClient?: number,
    estimatedTax?: number,
    putAsidedBas?: number,
    monthlyDetail?: any,
}

export default IFinance;
