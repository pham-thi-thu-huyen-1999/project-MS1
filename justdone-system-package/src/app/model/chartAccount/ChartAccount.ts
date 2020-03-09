import IChartAccount from './interfaces/IChartAccount'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';
import {GstType} from '../common/CommonType';

class ChartAccount {
    _id: string;
    code: string;
    name: string;
    usageBudget: boolean;
    searchTerm: string;
    description?: string;
    country?: string;
    gstType: GstType;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IChartAccount) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.code = model.code;
        this.name = model.name;
        this.usageBudget = model.usageBudget;
        this.searchTerm = model.searchTerm;
        this.description = model.description;
        this.country = model.country;
        this.gstType = model.gstType;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IChartAccount[]): ChartAccount[] {
        return list && Array.isArray(list) ? list.map(item => new ChartAccount(item)) : [];
    }
}

Object.seal(ChartAccount);
export default ChartAccount;
