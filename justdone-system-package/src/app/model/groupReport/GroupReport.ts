import IGroupReport from './interfaces/IGroupReport'; // eslint-disable-line
import ChartAccount from '../chartAccount/ChartAccount';
import DataHelper from '../../../helpers/DataHelper';

class GroupReport {
    _id: string;
    code: string;
    name: string;
    searchTerm: string;
    coas: any[];
    order: number;
    parentId?: any;

    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IGroupReport) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.code = model.code;
        this.name = model.name;
        this.searchTerm = model.searchTerm;
        this.coas = model.coas && Array.isArray(model.coas) ? ChartAccount.parseArray(model.coas) : [];
        this.order = model.order;
        this.parentId = model.parentId;

        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IGroupReport[]): GroupReport[] {
        return list && Array.isArray(list) ? list.map(item => new GroupReport(item)) : [];
    }
}

Object.seal(GroupReport);
export default GroupReport;
