import UsageBudget from 'justdone-system-package/dest/app/model/usageBudget/UsageBudget';

interface IUsageBudgetBusiness {
    get(_id:string): Promise<UsageBudget>;
    getBudgetUsageCoa(): Promise<any>;
    getByBeginYear: (userId:string, beginYear: number) => Promise<UsageBudget[]>;
    createMultiple: (userId:string, beginYear: number, coas:{coaId:string, percent:number}[]) => Promise<UsageBudget>;
    updateUsageBudget(usageBudgets: UsageBudget[]): Promise<boolean>;
}

export default IUsageBudgetBusiness;
