import IBalanceSheetReport from './interfaces/IBalanceSheetReport';
declare class BalanceSheetReport {
    _id: any;
    userId: any;
    csv: any;
    month: number;
    year: number;
    constructor(model: IBalanceSheetReport);
    static parseArray(list: IBalanceSheetReport[]): BalanceSheetReport[];
}
export default BalanceSheetReport;
