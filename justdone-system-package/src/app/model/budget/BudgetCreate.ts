import IBudget from './interfaces/IBudget'; // eslint-disable-line

class Budget {
    userId: string;
    year: any;
    month: number;
    coaId: any;
    amount: number;

    constructor(model: IBudget) {
        if (!model)
            return;
        this.userId = model.userId;
        this.year = model.year;
        this.month = model.month;
        this.coaId = model.coaId;
        this.amount = model.amount;
    }

    static parseArray(list: IBudget[]): Budget[] {
        return list && Array.isArray(list) ? list.map(item => new Budget(item)) : [];
    }
}

Object.seal(Budget);
export default Budget;
