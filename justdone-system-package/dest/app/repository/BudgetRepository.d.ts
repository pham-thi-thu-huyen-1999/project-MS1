import IBudget from '../model/budget/interfaces/IBudget';
import BaseRepository from './base/BaseRepository';
import BudgetCreate from '../model/budget/BudgetCreate';
import BudgetUpdate from '../model/budget/BudgetUpdate';
declare class BudgetRepository extends BaseRepository<IBudget> {
    constructor();
    create(data: BudgetCreate): Promise<IBudget>;
    createMultiple(data: BudgetCreate[]): Promise<IBudget[]>;
    update(_id: string, data: BudgetUpdate): Promise<boolean>;
}
export default BudgetRepository;
