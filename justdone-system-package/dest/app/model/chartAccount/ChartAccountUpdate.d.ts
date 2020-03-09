import IChartAccount from "./interfaces/IChartAccount";
declare class ChartAccountUpdate {
    code: string;
    name: string;
    searchTerm: string;
    description?: string;
    country?: string;
    constructor(model: IChartAccount);
}
export default ChartAccountUpdate;
