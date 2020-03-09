declare class ChartAccountStatistic {
    coa: any;
    product: number;
    client: number;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(model: ChartAccountStatistic);
    static parseArray(list: ChartAccountStatistic[]): ChartAccountStatistic[];
}
export default ChartAccountStatistic;
