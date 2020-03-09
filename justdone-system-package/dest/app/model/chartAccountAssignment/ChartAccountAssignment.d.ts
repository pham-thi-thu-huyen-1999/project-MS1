import IChartAccountAssignment from './interfaces/IChartAccountAssignment';
declare class ChartAccountAssignment {
    _id: string;
    coa: string;
    product: string;
    client: string;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(model: IChartAccountAssignment);
    static parseArray(list: IChartAccountAssignment[]): ChartAccountAssignment[];
}
export default ChartAccountAssignment;
