import IUsageBudget from '../model/usageBudget/interfaces/IUsageBudget';
import BaseRepository from './base/BaseRepository';
import UsageBudgetCreate from '../model/usageBudget/UsageBudgetCreate';
declare class UsageBudgetRepository extends BaseRepository<IUsageBudget> {
    constructor();
    create(data: UsageBudgetCreate): Promise<IUsageBudget>;
}
export default UsageBudgetRepository;
