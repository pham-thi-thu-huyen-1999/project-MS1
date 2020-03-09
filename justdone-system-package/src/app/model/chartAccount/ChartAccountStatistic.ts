import IChartAccount from './interfaces/IChartAccount'; // eslint-disable-line
import ChartAccount from './ChartAccount'; // eslint-disable-line

class ChartAccountStatistic {
    coa: any;
    product: number;
    client: number;

    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: ChartAccountStatistic) {
        if (!model)
            return;

        this.coa = model.coa && new ChartAccount(model.coa);
        this.product = model.product && Number(model.product);
        this.client = model.client && Number(model.client);

        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: ChartAccountStatistic[]): ChartAccountStatistic[] {
        return list && Array.isArray(list) ? list.map(item => new ChartAccountStatistic(item)) : [];
    }
}

Object.seal(ChartAccountStatistic);
export default ChartAccountStatistic;
