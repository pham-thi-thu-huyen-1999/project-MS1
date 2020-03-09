import IBaseModel from '../../common/interfaces/IBaseModel';
import { GstType } from '../../common/CommonType';
interface IChartAccount extends IBaseModel {
    code: string;
    name: string;
    searchTerm: string;
    usageBudget: boolean;
    gstType: GstType;
    description?: string;
    country?: string;
}
export default IChartAccount;
