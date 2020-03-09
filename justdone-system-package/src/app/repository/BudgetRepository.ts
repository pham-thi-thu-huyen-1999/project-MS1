import IBudget from '../model/budget/interfaces/IBudget'; // eslint-disable-line
import BudgetSchema from '../dataAccess/schemas/BudgetSchema';
import BaseRepository from './base/BaseRepository';
import Budget from '../model/budget/Budget';// eslint-disable-line
import BudgetCreate from '../model/budget/BudgetCreate';// eslint-disable-line
import BudgetUpdate from '../model/budget/BudgetUpdate';// eslint-disable-line

class BudgetRepository extends BaseRepository<IBudget> {
    constructor() {
        super(BudgetSchema);
    }

    async create(data: BudgetCreate): Promise<IBudget> {
        return await super.create(data);
    }

    async createMultiple(data: BudgetCreate[]): Promise<IBudget[]> {
        return await super.createMultiple(data);
    }

    async update(_id: string, data: BudgetUpdate): Promise<boolean> {
        return await super.update(_id, data);
    }
}

Object.seal(BudgetRepository);
export default BudgetRepository;
