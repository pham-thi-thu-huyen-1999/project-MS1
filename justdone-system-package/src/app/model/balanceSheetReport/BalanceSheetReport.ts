import IBalanceSheetReport from './interfaces/IBalanceSheetReport'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

class BalanceSheetReport {
    _id: any
    userId: any;
    csv: any;
    month: number;
    year: number;

    constructor(model: IBalanceSheetReport) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.userId = DataHelper.handleIdDataModel(model.userId);
        this.csv = DataHelper.handleIdDataModel(model.csv);
        this.month = model.month;
        this.year = model.year;
    }

    static parseArray(list: IBalanceSheetReport[]): BalanceSheetReport[] {
        return list && Array.isArray(list) ? list.map(item => new BalanceSheetReport(item)) : [];
    }
}

Object.seal(BalanceSheetReport);
export default BalanceSheetReport;
