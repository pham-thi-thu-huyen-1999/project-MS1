import IBalanceSheetReport from "./interfaces/IBalanceSheetReport"; // eslint-disable-line

class BalanceSheetReportCreate {
    userId: any;
    csv: string;
    month: number;
    year: number;

    constructor(model: IBalanceSheetReport) {
        if (!model)
            return;

        this.userId = model.userId;
        this.csv = model.csv;
        this.month = model.month;
        this.year = model.year;
    }
}

Object.seal(BalanceSheetReportCreate);
export default BalanceSheetReportCreate;
