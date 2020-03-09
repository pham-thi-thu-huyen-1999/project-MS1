import IUsageBudget from './interfaces/IUsageBudget'; // eslint-disable-line

class UsageBudget {
    _id: string;
    userId: any;
    coaId: any;
    beginYear: number;
    percentUsage: number;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IUsageBudget) {
        if (!model)
            return;

        this._id = model._id && model._id.toString();
        this.userId = model.userId;
        this.coaId = model.coaId;
        this.beginYear = model.beginYear;
        this.percentUsage = model.percentUsage;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IUsageBudget[]): UsageBudget[] {
        return list && Array.isArray(list) ? list.map(item => new UsageBudget(item)) : [];
    }
}

Object.seal(UsageBudget);
export default UsageBudget;
