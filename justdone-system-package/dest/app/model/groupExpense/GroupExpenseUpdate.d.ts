import IGroupExpense from "./interfaces/IGroupExpense";
declare class GroupExpenseUpdate {
    userId: string;
    parent: string;
    code: number;
    name: string;
    order: number;
    searchTerm: string;
    constructor(model: IGroupExpense);
}
export default GroupExpenseUpdate;
