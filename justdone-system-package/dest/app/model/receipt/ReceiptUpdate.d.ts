import IReceipt from "./interfaces/IReceipt";
declare class ReceiptUpdate {
    fileId?: string;
    year: number;
    month: number;
    day: number;
    total: number;
    currency: string;
    constructor(model: IReceipt);
}
export default ReceiptUpdate;
