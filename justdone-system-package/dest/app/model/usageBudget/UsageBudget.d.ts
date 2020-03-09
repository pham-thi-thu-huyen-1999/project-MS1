import IUsageBudget from './interfaces/IUsageBudget';
declare class UsageBudget {
    _id: string;
    userId: any;
    coaId: any;
    beginYear: number;
    percentUsage: number;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(model: IUsageBudget);
    static parseArray(list: IUsageBudget[]): UsageBudget[];
}
export default UsageBudget;
