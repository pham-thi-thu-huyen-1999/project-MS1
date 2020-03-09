import IChartAccount from "./interfaces/IChartAccount";
import { GstType } from '../common/CommonType';
declare class ChartAccountCreate {
    code: string;
    name: string;
    searchTerm: string;
    description?: string;
    country?: string;
    gstType?: GstType;
    constructor(model: IChartAccount);
}
export default ChartAccountCreate;
