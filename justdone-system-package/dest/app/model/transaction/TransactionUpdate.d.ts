import ITransaction from './interfaces/ITransaction';
declare class TransactionUpdate {
    index?: number;
    constructor(model: ITransaction);
    static parseArray(list: ITransaction[]): TransactionUpdate[];
}
export default TransactionUpdate;
