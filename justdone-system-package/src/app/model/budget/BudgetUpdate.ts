import IBudget from './interfaces/IBudget'; // eslint-disable-line

class BudgetUpdate {
    amount: number;

    constructor(model: IBudget) {
        if (!model)
            return;
        this.amount = model.amount;
    }

    static parseArray(list: IBudget[]): BudgetUpdate[] {
        return list && Array.isArray(list) ? list.map(item => new BudgetUpdate(item)) : [];
    }
}

Object.seal(BudgetUpdate);
export default BudgetUpdate;
