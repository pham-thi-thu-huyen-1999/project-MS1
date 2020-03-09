import IFinance from '../model/finance/interfaces/IFinance'; // eslint-disable-line
import FinanceSchema from '../dataAccess/schemas/FinanceSchema';
import BaseRepository from './base/BaseRepository';
import FinanceCreate from '../model/finance/FinanceCreate'; // eslint-disable-line
import FinanceUpdate from '../model/finance/FinanceUpdate'; // eslint-disable-line
import FinanceMonth from '../model/finance/FinanceMonth'; // eslint-disable-line

class FinanceRepository extends BaseRepository<IFinance> {
    constructor() {
        super(FinanceSchema);
    }

    // async updateDashboard(dashboard: FinanceUpdate): Promise<boolean> {
    //     return await this.model.update({userId: DataHelper.toObjectId(dashboard.userId), financialYear: dashboard.financialYear}, dashboard).exec();
    // }

    async create(data: FinanceCreate): Promise<IFinance> {
        return await super.create(data);
    }
}

Object.seal(FinanceRepository);
export default FinanceRepository;
