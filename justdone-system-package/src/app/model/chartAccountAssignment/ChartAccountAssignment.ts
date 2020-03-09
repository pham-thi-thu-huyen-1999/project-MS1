import IChartAccountAssignment from './interfaces/IChartAccountAssignment'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

class ChartAccountAssignment {
    _id: string;
    coa: string;
    product: string;
    client: string;

    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IChartAccountAssignment) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.coa = DataHelper.handleIdDataModel(model.coa);
        this.product = DataHelper.handleIdDataModel(model.product);
        this.client = DataHelper.handleIdDataModel(model.client);

        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IChartAccountAssignment[]): ChartAccountAssignment[] {
        return list && Array.isArray(list) ? list.map(item => new ChartAccountAssignment(item)) : [];
    }
}

Object.seal(ChartAccountAssignment);
export default ChartAccountAssignment;
