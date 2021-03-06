import IBaseModel from '../../common/interfaces/IBaseModel';
import MonthlyAccountItem from '../MonthlyAccountItem'; // eslint-disable-line
import AccountingItem from '../AccountingItem'; // eslint-disable-line
import BasQuarterAccountItem from '../BasQuarterAccountItem';

interface IAccounting extends IBaseModel {
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
}

export default IAccounting;
