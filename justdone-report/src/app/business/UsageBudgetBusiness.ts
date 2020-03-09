import UsageBudgetRepository from 'justdone-system-package/dest/app/repository/UsageBudgetRepository';
import UsageBudget from 'justdone-system-package/dest/app/model/usageBudget/UsageBudget'; // eslint-disable-line
import IUsageBudgetBusiness from './interfaces/IUsageBudgetBusiness';// eslint-disable-line
import BusinessLoader from '../../system/BusinessLoader';
import ChartAccount from 'justdone-system-package/dest/app/model/chartAccount/ChartAccount'; // eslint-disable-line

class UsageBudgetBusiness implements IUsageBudgetBusiness {
    private usageBudgetRepository : UsageBudgetRepository;

    constructor() {
        this.usageBudgetRepository = new UsageBudgetRepository();
    }
    async get(_id:string): Promise<any> {
        return this.usageBudgetRepository.get(_id);
    }

    async getBudgetUsageCoa(): Promise<ChartAccount[]> {
        return await BusinessLoader.chartAccountBusiness.getAllCoaUsageBudget();
    }

    async getByBeginYear(userId:string, beginYear: number): Promise<UsageBudget[]> {
        const params = {
            query: {
                userId,
                beginYear
            },
            populate: [{
                path: 'coaId',
                select: 'code name'
            }]
        };
        const usageBudgets = await this.usageBudgetRepository.findAll(params);

        if (usageBudgets.length > 0)
            return UsageBudget.parseArray(usageBudgets);
        const listCoa = await this.getBudgetUsageCoa();
        await this.createMultiple(userId, beginYear, listCoa.map(item => ({...item, percentUsage: 100})));
        return UsageBudget.parseArray(await this.usageBudgetRepository.findAll(params));
    }

    async create(data: any): Promise<any> {
        const usageBudget = await this.usageBudgetRepository.create(data);
        return usageBudget && new UsageBudget(usageBudget);
    }

    async createMultiple(userId, beginYear, coas: any): Promise<any> {
        const dataCreate = coas.map(coa => ({
            userId,
            beginYear,
            coaId: coa._id,
            percentUsage: coa.percentUsage
        }));
        const usageBudgets = await this.usageBudgetRepository.createMultiple(dataCreate);
        return UsageBudget.parseArray(usageBudgets);
    }

    async update(_id:string, percentUsage: number): Promise<any> {
        return await this.usageBudgetRepository.update(_id, {percentUsage});
    }

    async updateUsageBudget(usageBudgets: UsageBudget[]): Promise<boolean> {
        for (let index = 0; index < usageBudgets.length; index++) {
            const item = usageBudgets[index];
            await this.update(item._id, item.percentUsage);
        }
        return true;
    }
}

Object.seal(UsageBudgetBusiness);
export default UsageBudgetBusiness;
