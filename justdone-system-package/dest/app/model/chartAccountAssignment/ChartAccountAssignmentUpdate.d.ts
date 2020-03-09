import IChartAccountAssignment from "./interfaces/IChartAccountAssignment";
declare class ChartAccountAssignmentUpdate {
    coa: string;
    product: string;
    client: string;
    constructor(model: IChartAccountAssignment);
}
export default ChartAccountAssignmentUpdate;
