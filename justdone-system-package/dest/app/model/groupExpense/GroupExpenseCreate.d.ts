import IGroupExpense from "./interfaces/IGroupExpense";
declare class GroupExpenseCreate {
    userId: string;
    parent: string;
    code: number;
    name: string;
    order: number;
    searchTerm: string;
    coas: any[];
    constructor(model: IGroupExpense);
}
export default GroupExpenseCreate;
