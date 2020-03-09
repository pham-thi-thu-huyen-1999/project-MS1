import IReceipt from './interfaces/IReceipt';
declare class Receipt {
    _id: string;
    userId: any;
    fileId: any;
    year: number;
    month: number;
    day: number;
    total: number;
    currency: string;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(model: IReceipt);
    static parseArray(list: IReceipt[]): Receipt[];
    static parseObject(list: IReceipt[]): Object;
}
export default Receipt;
