import IBaseBusiness from './base/IBaseBusiness';
import ChartAccount from 'justdone-system-package/dest/app/model/chartAccount/ChartAccount';

interface IChartAccountBusiness extends IBaseBusiness<ChartAccount> {
    getAll():Promise<ChartAccount[]>;
    getAllCoaUsageBudget(): Promise<ChartAccount[]>;
    getCOAByCode(code: string): Promise<ChartAccount | null>;
}

export default IChartAccountBusiness;
