import Finance from 'justdone-system-package/dest/app/model/finance/Finance'; // eslint-disable-line
import FinanceMonth from 'justdone-system-package/dest/app/model/finance/FinanceMonth'; // eslint-disable-line
import FinanceCreate from 'justdone-system-package/dest/app/model/finance/FinanceCreate'; // eslint-disable-line
import FinanceUpdate from 'justdone-system-package/dest/app/model/finance/FinanceUpdate'; // eslint-disable-line
import IFinanceBusiness from './interfaces/IFinanceBusiness'; // eslint-disable-line
import FinanceRepository from 'justdone-system-package/dest/app/repository/FinanceRepository';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';

class FinanceBusiness implements IFinanceBusiness {
    private financeRepository: FinanceRepository;

    constructor() {
        this.financeRepository = new FinanceRepository();
    }

    async getByUserIdAndYearFinance(_id: string, year: string): Promise<any> {
        let params = {
            query: <any>{
                userId: DataHelper.toObjectId(_id),
                financialYear: year
            }
        };
        return await this.financeRepository.find(params);
    }

    async updateDashboard(dashboard: FinanceUpdate): Promise<boolean> {
        return true;
        // return await this.financeRepository.updateDashboard(dashboard);
    }

    async updateCurrentProfit(_id: string, year: string, value: number): Promise<any> {
        return await this.financeRepository.findOneAndUpdate({userId: DataHelper.toObjectId(_id), financialYear: year}, {currentProfit: value});
    }

    async updateGrossIncome(_id: string, year: string, value: number): Promise<any> {
        return await this.financeRepository.findOneAndUpdate({userId: DataHelper.toObjectId(_id), financialYear: year}, {currentProfit: value});
    }

    async updateExpenseYear(_id: string, year: string, value: number): Promise<any> {
        return await this.financeRepository.findOneAndUpdate({userId: DataHelper.toObjectId(_id), financialYear: year}, {expenseYear: value});
    }

    async updateCurrentBas(_id: string, year: string, value: number): Promise<any> {
        return await this.financeRepository.findOneAndUpdate({userId: DataHelper.toObjectId(_id), financialYear: year}, {currentBas: value});
    }

    async updateIncomeTax(_id: string, year: string, value: number): Promise<any> {
        return await this.financeRepository.findOneAndUpdate({userId: DataHelper.toObjectId(_id), financialYear: year}, {incomeTax: value});
    }

    async updateIntegratedClient(_id: string, year: string, value: number): Promise<any> {
        return await this.financeRepository.findOneAndUpdate({userId: DataHelper.toObjectId(_id), financialYear: year}, {integratedClient: value});
    }

    async updateEstimatedTax(_id: string, year: string, value: number): Promise<any> {
        return await this.financeRepository.findOneAndUpdate({userId: DataHelper.toObjectId(_id), financialYear: year}, {estimatedTax: value});
    }

    async updatePutAsidedBas(_id: string, year: string, value: number): Promise<any> {
        return await this.financeRepository.findOneAndUpdate({userId: DataHelper.toObjectId(_id), financialYear: year}, {putAsidedBas: value});
    }

    async updateMonthlyDetail(_id: string, year: string, monthDetail: FinanceMonth[]): Promise<any> {
        if (monthDetail.length === 0) {
            throw Error('No Data for monthly detail can be found!');
        };
        for (let i = 0; i < monthDetail.length; i++) {
            if (!monthDetail[i].month || !monthDetail[i].income || !monthDetail[i].expense || !monthDetail[i].profit)
                throw Error('Invalid Request');
        };
        return await this.financeRepository.findOneAndUpdate({userId: DataHelper.toObjectId(_id), financialYear: year}, {monthlyDetail: monthDetail});// Todo
    }

    async getList(page: number, limit: number): Promise<Finance[]> {
        let finances = await this.financeRepository.find(null, null, page, limit);
        return Finance.parseArray(finances);
    }

    async getCount(): Promise<number> {
        return await this.financeRepository.getCount();
    }

    async get(_id: string): Promise<Finance | null> {
        if (!_id)
            return null;

        let finance = await this.financeRepository.get(_id);
        return finance && new Finance(finance);
    }

    async createOrUpdate(data: FinanceUpdate): Promise<Finance> {
        if (!data.userId || !data.financialYear) {
            throw Error('Invalid Request');
        };
        let query = {
            userId: DataHelper.toObjectId(data.userId),
            financialYear: data.financialYear
        };
        let finance: any = await this.financeRepository.createOrUpdate(query, data);
        return finance && new Finance(finance);
    }

    async create(data: FinanceCreate): Promise<Finance> {
        if (!data.userId || !data.financialYear) {
            throw Error('Invalid Request');
        };
        let finance = await this.financeRepository.create(data);

        return finance && new Finance(finance);
    }

    async update(_id: string, data: FinanceUpdate): Promise<Finance | null> {
        await this.financeRepository.update(_id, data);
        return await this.get(_id);
    }

    async delete(_id: string): Promise<boolean> {
        return await this.financeRepository.delete(_id);
    }
}

Object.seal(FinanceBusiness);
export default FinanceBusiness;
