class FinanceMonth {
    month: number;
    income: number;
    expense: number;
    profit: number;

    constructor(model: FinanceMonth) {
        if (!model)
            return;

        this.month = model.month;
        this.income = model.income;
        this.expense = model.expense;
        this.profit = model.profit;
    }
}

Object.seal(FinanceMonth);
export default FinanceMonth;
