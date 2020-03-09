import IFinance from './interfaces/IFinance'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

class Finance {
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

    constructor(model: IFinance) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.userId = model.userId && !model.userId._id ? model.userId.toString() : model.userId;
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
    }

    static parseArray(list: IFinance[]): Finance[] {
        return list && Array.isArray(list) ? list.map(item => new Finance(item)) : [];
    }
}

Object.seal(Finance);
export default Finance;
