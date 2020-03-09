import IChartAccount from './interfaces/IChartAccount';
import { GstType } from '../common/CommonType';
declare class ChartAccount {
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
    constructor(model: IChartAccount);
    static parseArray(list: IChartAccount[]): ChartAccount[];
}
export default ChartAccount;
