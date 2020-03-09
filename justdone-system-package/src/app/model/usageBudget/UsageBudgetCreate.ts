import IUsageBudget from "./interfaces/IUsageBudget"; // eslint-disable-line

class UsageBudgetCreate {
    userId: string;
    coaId: string;
    beginYear: number;
    percentUsage: number;

    constructor(model: IUsageBudget) {
        if (!model)
            return;

        this.userId = model.userId;
        this.coaId = model.coaId;
        this.beginYear = model.beginYear;
        this.percentUsage = model.percentUsage;
    }
}

Object.seal(UsageBudgetCreate);
export default UsageBudgetCreate;
