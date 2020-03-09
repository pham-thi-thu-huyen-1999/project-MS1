import IBudget from './interfaces/IBudget';
declare class Budget {
    _id: string;
    userId: string;
    year: any;
    month: number;
    coaId: any;
    amount: number;
    constructor(model: IBudget);
    static parseArray(list: IBudget[]): Budget[];
}
export default Budget;
