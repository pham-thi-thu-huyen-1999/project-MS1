import IBaseBusiness from './base/IBaseBusiness';
import Finance from 'justdone-system-package/dest/app/model/finance/Finance';
import FinanceMonth from 'justdone-system-package/dest/app/model/finance/FinanceMonth'; // eslint-disable-line
import FinanceCreate from 'justdone-system-package/dest/app/model/finance/FinanceCreate'; // eslint-disable-line
import FinanceUpdate from 'justdone-system-package/dest/app/model/finance/FinanceUpdate'; // eslint-disable-line

interface IFinanceBusiness extends IBaseBusiness<Finance> {
    getByUserIdAndYearFinance: (_id: string, year: string) => Promise<any>;
    updateDashboard: (dashboard: FinanceUpdate) => Promise<boolean>;
    updateCurrentProfit: (_id: string, year: string, value: number) => Promise<boolean>;
    updateGrossIncome: (_id: string, year: string, value: number) => Promise<boolean>;
    updateExpenseYear: (_id: string, year: string, value: number) => Promise<boolean>;
    updateCurrentBas: (_id: string, year: string, value: number) => Promise<boolean>;
    updateIncomeTax: (_id: string, year: string, value: number) => Promise<boolean>;
    updateIntegratedClient: (_id: string, year: string, value: number) => Promise<boolean>;
    updateEstimatedTax: (_id: string, year: string, value: number) => Promise<boolean>;
    updatePutAsidedBas: (_id: string, year: string, value: number) => Promise<boolean>;
    updateMonthlyDetail: (_id: string, year: string, monthDetail: FinanceMonth[]) => Promise<boolean>;
    getList: (page: number, limit: number) => Promise<Finance[]>;
    getCount: () => Promise<number>;
    create: (data: FinanceCreate) => Promise<Finance>;
    createOrUpdate: (data: FinanceUpdate) => Promise<Finance>;
    update: (_id: string, data: FinanceUpdate) => Promise<Finance | null>;
}

export default IFinanceBusiness;
