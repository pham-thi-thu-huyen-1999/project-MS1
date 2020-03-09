import IGroupExpense from './interfaces/IGroupExpense'; // eslint-disable-line
import ChartAccount from '../chartAccount/ChartAccount';
import DataHelper from '../../../helpers/DataHelper';

class GroupExpense {
    _id: string;
    userId: any;
    parent: any;
    code: number;
    name: string;
    searchTerm: string;
    coas: any[];
    order: number;

    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IGroupExpense) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.userId = DataHelper.handleIdDataModel(model.userId);
        this.parent = DataHelper.handleIdDataModel(model.parent);
        this.code = model.code;
        this.name = model.name;
        this.searchTerm = model.searchTerm;
        this.coas = model.coas && Array.isArray(model.coas) ? ChartAccount.parseArray(model.coas) : [];
        this.order = model.order;

        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IGroupExpense[]): GroupExpense[] {
        return list && Array.isArray(list) ? list.map(item => new GroupExpense(item)) : [];
    }
}

Object.seal(GroupExpense);
export default GroupExpense;
