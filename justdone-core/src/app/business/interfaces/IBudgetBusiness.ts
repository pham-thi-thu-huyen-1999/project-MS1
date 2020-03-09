// import Budget from 'justdone-system-package/dest/app/model/budget/Budget';

interface IBudgetBusiness {
    getBudgets: (originId: string, productCode: number, clientId: string, beginYear: number, beginMonth: number, endYear: number, endMonth: number, coaId: string, page: number, limit: number) => Promise<{ coa: any, budgets: any[] }[]>;
    getCountBudget: (originId: string, productCode: number, clientId: string, keyword : string) => Promise<number>;
    getBudgetForCrunch: (originId: string, ProductCode: number, clientIds: string[], coaIds: string[], beginYear: number, beginMonth: number, endYear: number, endMonth: number) => Promise<any>;
    getTotalAmountBudget: (originId: string, productCode: number, clientIds: {_id: string, coaIds: string[]}[], currentYear: number, currentMonth: number) => Promise<{clientId: string, coas: any[]}[]>;
    createAndUpdate: (originId: string, productCode: number, clientId: string, coaId: string, budgets: any[]) => Promise<any>;
}

export default IBudgetBusiness;
