import ICrunch from './interfaces/ICrunch'; // eslint-disable-line
import {BankType} from '../common/CommonType';
import DataHelper from '../../../helpers/DataHelper';

class Crunch {
    _id: string;
    userId: any;
    type: BankType;
    month: number;
    year: number;
    accountId: string;
    coaAmounts: any[];
    income?: number;
    startedAt?: Date;
    approvedAt?: Date;
    amendedAt?: Date;
    completedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: ICrunch) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.userId = DataHelper.handleIdDataModel(model.userId);
        this.month = model.month;
        this.year = model.year;
        this.type = model.type;
        this.accountId = model.accountId;
        this.coaAmounts = model.coaAmounts;
        this.income = model.income;
        this.approvedAt = model.approvedAt;
        this.completedAt = model.completedAt;
        this.amendedAt = model.amendedAt;
        this.startedAt = model.startedAt;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: ICrunch[]): Crunch[] {
        return list && Array.isArray(list) ? list.map(item => new Crunch(item)) : [];
    }
}

Object.seal(Crunch);
export default Crunch;
