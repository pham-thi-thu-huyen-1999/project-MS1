import IChartAccount from '../model/chartAccount/interfaces/IChartAccount'; // eslint-disable-line
import ChartAccountSchema from '../dataAccess/schemas/ChartAccountSchema';
import BaseRepository from './base/BaseRepository';
import ChartAccountCreate from '../model/chartAccount/ChartAccountCreate'; // eslint-disable-line
import ChartAccountUpdate from '../model/chartAccount/ChartAccountUpdate'; // eslint-disable-line

class ChartAccountRepository extends BaseRepository<IChartAccount> {
    constructor() {
        super(ChartAccountSchema);
    }

    async create(data: ChartAccountCreate): Promise<IChartAccount> {
        return await super.create(data);
    }
    async update(_id: string, data: ChartAccountUpdate): Promise<boolean> {
        return await super.update(_id, data);
    }
}

Object.seal(ChartAccountRepository);
export default ChartAccountRepository;
