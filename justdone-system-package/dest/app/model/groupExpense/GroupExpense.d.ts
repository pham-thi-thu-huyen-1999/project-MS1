import IGroupExpense from './interfaces/IGroupExpense';
declare class GroupExpense {
    _id: string;
    userId: any;
    parent: any;
    code: number;
    name: string;
    searchTerm: string;
    coas: any[];
    order: number;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(model: IGroupExpense);
    static parseArray(list: IGroupExpense[]): GroupExpense[];
}
export default GroupExpense;
