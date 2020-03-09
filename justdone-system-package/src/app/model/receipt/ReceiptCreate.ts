import IReceipt from "./interfaces/IReceipt"; // eslint-disable-line

class ReceiptCreate {
    userId: string;
    fileId: string;
    year: number;
    month: number;
    day: number;
    total: number;
    currency: string;

    constructor(model: IReceipt) {
        if (!model)
            return;

        this.userId = model.userId;
        this.fileId = model.fileId;
        this.year = model.year ? model.year : new Date().getFullYear();
        this.month = model.month ? model.month : new Date().getMonth() + 1;
        this.day = model.day ? model.day : new Date().getDate();
        this.total = model.total;
        this.currency = model.currency;
    }
}

Object.seal(ReceiptCreate);
export default ReceiptCreate;
