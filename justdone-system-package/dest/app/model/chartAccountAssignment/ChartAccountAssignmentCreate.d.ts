import IChartAccountAssignment from "./interfaces/IChartAccountAssignment";
declare class ChartAccountAssignmentCreate {
    coa: string;
    product: string;
    client: string;
    constructor(model: IChartAccountAssignment);
}
export default ChartAccountAssignmentCreate;
