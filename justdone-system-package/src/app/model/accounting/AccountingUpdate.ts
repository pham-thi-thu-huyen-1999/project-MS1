import IAccounting from "./interfaces/IAccounting"; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';
import MonthlyAccountItem from './MonthlyAccountItem'; // eslint-disable-line
import AccountingItem from './AccountingItem';
import BasQuarterAccountItem from './BasQuarterAccountItem';

class AccountingUpdate {
    monthlyAccounts?: MonthlyAccountItem[];
    profitLoss?: AccountingItem;
    balanceSheet?: AccountingItem;
    basQuarter?: boolean;
    basQuarter1?: BasQuarterAccountItem;
    basQuarter2?: BasQuarterAccountItem;
    basQuarter3?: BasQuarterAccountItem;
    basQuarter4?: BasQuarterAccountItem;
    taxReturn?: AccountingItem;
    annualReport?: AccountingItem;
    subContractor?: string;

    constructor(model: IAccounting) {
        if (!model)
            return;

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
        this.subContractor = model.subContractor;

        DataHelper.handleDataModelInput(this);
    }
}

Object.seal(AccountingUpdate);
export default AccountingUpdate;
