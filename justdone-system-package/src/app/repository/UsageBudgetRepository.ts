import IUsageBudget from '../model/usageBudget/interfaces/IUsageBudget'; // eslint-disable-line
import UsageBudgetSchema from '../dataAccess/schemas/UsageBudgetSchema';
import BaseRepository from './base/BaseRepository';
import UsageBudgetCreate from '../model/usageBudget/UsageBudgetCreate'; // eslint-disable-line

class UsageBudgetRepository extends BaseRepository<IUsageBudget> {
    constructor() {
        super(UsageBudgetSchema);
    }

    async create(data: UsageBudgetCreate): Promise<IUsageBudget> {
        return await super.create(data);
    }
}

Object.seal(UsageBudgetRepository);
export default UsageBudgetRepository;
