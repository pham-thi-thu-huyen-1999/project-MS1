import IBalanceSheetReport from "./interfaces/IBalanceSheetReport";
declare class BalanceSheetReportCreate {
    userId: any;
    csv: string;
    month: number;
    year: number;
    constructor(model: IBalanceSheetReport);
}
export default BalanceSheetReportCreate;
