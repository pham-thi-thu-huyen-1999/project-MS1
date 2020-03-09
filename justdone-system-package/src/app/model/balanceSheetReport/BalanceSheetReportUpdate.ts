import IBalanceSheetReport from "./interfaces/IBalanceSheetReport"; // eslint-disable-line

class MagicLinkUpdate {
    csv: string;

    constructor(model: IBalanceSheetReport) {
        if (!model)
            return;
        this.csv = model.csv;
    }
}

Object.seal(MagicLinkUpdate);
export default MagicLinkUpdate;
