import ITransaction from './interfaces/ITransaction'; // eslint-disable-line

class TransactionUpdate {
    index?: number;
    constructor(model: ITransaction) {
        if (!model)
            return;
        this.index = model.index;
    }

    static parseArray(list: ITransaction[]): TransactionUpdate[] {
        return list && Array.isArray(list) ? list.map(item => new TransactionUpdate(item)) : [];
    }
}

Object.seal(TransactionUpdate);
export default TransactionUpdate;
