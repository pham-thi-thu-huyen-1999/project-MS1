import IFinance from "./interfaces/IFinance"; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

class FinanceUpdate {
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

    constructor(model: IFinance) {
        if (!model)
            return;

        this.userId = model.userId;
        this.financialYear = model.financialYear;
        this.currentBas = model.currentBas;
        this.currentProfit = model.currentProfit;
        this.grossIncome = model.grossIncome;
        this.expenseYear = model.expenseYear;
        this.incomeTax = model.incomeTax;
        this.integratedClient = model.integratedClient;
        this.estimatedTax = model.estimatedTax;
        this.putAsidedBas = model.putAsidedBas;
        this.monthlyDetail = model.monthlyDetail;

        DataHelper.handleDataModelInput(this);
    }
}

Object.seal(FinanceUpdate);
export default FinanceUpdate;
