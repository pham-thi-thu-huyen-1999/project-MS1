import IBudget from './interfaces/IBudget';
declare class BudgetUpdate {
    amount: number;
    constructor(model: IBudget);
    static parseArray(list: IBudget[]): BudgetUpdate[];
}
export default BudgetUpdate;
