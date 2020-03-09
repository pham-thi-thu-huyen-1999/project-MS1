import IChartAccount from "./interfaces/IChartAccount"; // eslint-disable-line
import {GstType} from '../common/CommonType';
class ChartAccountCreate {
    code: string;
    name: string;
    searchTerm: string;
    description?: string;
    country?: string;
    gstType ?: GstType;
    constructor(model: IChartAccount) {
        if (!model)
            return;

        this.code = model.code;
        this.name = model.name;
        this.searchTerm = model.searchTerm;
        this.description = model.description;
        this.country = model.country;
        this.gstType = model.gstType;
    }
}

Object.seal(ChartAccountCreate);
export default ChartAccountCreate;
