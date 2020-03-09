import IChartAccount from '../model/chartAccount/interfaces/IChartAccount';
import BaseRepository from './base/BaseRepository';
import ChartAccountCreate from '../model/chartAccount/ChartAccountCreate';
import ChartAccountUpdate from '../model/chartAccount/ChartAccountUpdate';
declare class ChartAccountRepository extends BaseRepository<IChartAccount> {
    constructor();
    create(data: ChartAccountCreate): Promise<IChartAccount>;
    update(_id: string, data: ChartAccountUpdate): Promise<boolean>;
}
export default ChartAccountRepository;
