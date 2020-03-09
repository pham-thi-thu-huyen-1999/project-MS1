import IReceipt from "./interfaces/IReceipt"; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

class ReceiptUpdate {
    fileId?: string;
    year: number;
    month: number;
    day: number;
    total: number;
    currency: string;

    constructor(model: IReceipt) {
        if (!model)
            return;

        this.year = model.year;
        this.month = model.month;
        this.day = model.day;
        this.total = model.total;
        this.fileId = model.fileId;
        this.currency = model.currency;

        DataHelper.handleDataModelInput(this);
    }
}

Object.seal(ReceiptUpdate);
export default ReceiptUpdate;
