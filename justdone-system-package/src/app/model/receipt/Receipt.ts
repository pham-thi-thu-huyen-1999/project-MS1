import IReceipt from './interfaces/IReceipt'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

class Receipt {
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

    constructor(model: IReceipt) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.userId = DataHelper.handleIdDataModel(model.userId);
        this.fileId = DataHelper.handleIdDataModel(model.fileId);
        this.year = model.year;
        this.month = model.month;
        this.day = model.day;
        this.total = model.total;
        this.currency = model.currency;

        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IReceipt[]): Receipt[] {
        return list && Array.isArray(list) ? list.map(item => new Receipt(item)) : [];
    }

    static parseObject(list: IReceipt[]): Object {
        let result = list.map(item => new Receipt(item));
        let data = {
            totalPrice: 0,
            totalData: 0
        };
        data.totalData = result.length;
        result.forEach(item => {
            data.totalPrice += item.total;
        });
        return data;
    }
}

Object.seal(Receipt);
export default Receipt;
