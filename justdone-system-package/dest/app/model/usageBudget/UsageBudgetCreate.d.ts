import IUsageBudget from "./interfaces/IUsageBudget";
declare class UsageBudgetCreate {
    userId: string;
    coaId: string;
    beginYear: number;
    percentUsage: number;
    constructor(model: IUsageBudget);
}
export default UsageBudgetCreate;
