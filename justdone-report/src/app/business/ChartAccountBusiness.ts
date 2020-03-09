import IChartAccountBusiness from './interfaces/IChartAccountBusiness'; // eslint-disable-line
import ChartAccountRepository from 'justdone-system-package/dest/app/repository/ChartAccountRepository';
import ChartAccount from 'justdone-system-package/dest/app/model/chartAccount/ChartAccount'; // eslint-disable-line
import ChartAccountCreate from 'justdone-system-package/dest/app/model/chartAccount/ChartAccountCreate'; // eslint-disable-line
import ChartAccountUpdate from 'justdone-system-package/dest/app/model/chartAccount/ChartAccountUpdate'; // eslint-disable-line

class ChartAccountBusiness implements IChartAccountBusiness {
    private chartAccountRepository: ChartAccountRepository;

    constructor() {
        this.chartAccountRepository = new ChartAccountRepository();
    }

    async get(_id: string): Promise<ChartAccount | null> {
        if (!_id)
            return null;

        let chartAccount = await this.chartAccountRepository.get(_id);

        return chartAccount && new ChartAccount(chartAccount);
    }

    async getAll():Promise<ChartAccount[]> {
        let chartAccounts = await this.chartAccountRepository.findAll();

        return ChartAccount.parseArray(chartAccounts);
    }

    async getAllCoaUsageBudget():Promise<ChartAccount[]> {
        const params = {
            query: {
                usageBudget: true
            }
        };
        const chartAccounts = await this.chartAccountRepository.findAll(params);
        return ChartAccount.parseArray(chartAccounts);
    }

    async getCOAByCode(code: string): Promise<ChartAccount | null> {
        let chartAccount = await this.chartAccountRepository.findOne({query: {code: code}});
        return chartAccount && new ChartAccount(chartAccount);
    }

    async create(data: ChartAccountCreate): Promise<ChartAccount> {
        let chartAccount = await this.chartAccountRepository.create(data);
        return chartAccount && new ChartAccount(chartAccount);
    }

    async update(_id: string, data: ChartAccountUpdate): Promise<ChartAccount | null> {
        await this.chartAccountRepository.update(_id, data);
        return await this.get(_id);
    }

    async delete(_id: string): Promise<boolean> {
        return await this.chartAccountRepository.delete(_id, true);
    }
}

Object.seal(ChartAccountBusiness);
export default ChartAccountBusiness;
