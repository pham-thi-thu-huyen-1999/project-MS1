import IAccounting from "./interfaces/IAccounting"; // eslint-disable-line
import MonthlyAccountItem from './MonthlyAccountItem'; // eslint-disable-line
import AccountingItem from './AccountingItem'; // eslint-disable-line
import BasQuarterAccountItem from './BasQuarterAccountItem';

class AccountingCreate {
    userId: any;
    beginYear: number;
    endYear: number;
    monthlyAccounts: MonthlyAccountItem[];
    profitLoss: AccountingItem;
    balanceSheet: AccountingItem;
    basQuarter: boolean;
    basQuarter1: BasQuarterAccountItem;
    basQuarter2: BasQuarterAccountItem;
    basQuarter3: BasQuarterAccountItem;
    basQuarter4: BasQuarterAccountItem;
    taxReturn: AccountingItem;
    annualReport: AccountingItem;
    newYear?: string;
    subContractor?: string;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IAccounting) {
        if (!model)
            return;

        this.userId = model.userId && !model.userId._id ? model.userId.toString() : model.userId;
        this.beginYear = model.beginYear;
        this.endYear = model.endYear;
        this.monthlyAccounts = model.monthlyAccounts;
        this.profitLoss = model.profitLoss;
        this.balanceSheet = model.balanceSheet;
        this.basQuarter = model.basQuarter;
        this.basQuarter1 = model.basQuarter1;
        this.basQuarter2 = model.basQuarter2;
        this.basQuarter3 = model.basQuarter3;
        this.basQuarter4 = model.basQuarter4;
        this.taxReturn = model.taxReturn;
        this.annualReport = model.annualReport;
        this.newYear = model.newYear;
        this.subContractor = model.subContractor;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
}

Object.seal(AccountingCreate);
export default AccountingCreate;
