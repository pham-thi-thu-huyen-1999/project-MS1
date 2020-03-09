import IAccounting from "./interfaces/IAccounting";
import MonthlyAccountItem from './MonthlyAccountItem';
import AccountingItem from './AccountingItem';
import BasQuarterAccountItem from './BasQuarterAccountItem';
declare class AccountingUpdate {
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
    constructor(model: IAccounting);
}
export default AccountingUpdate;
