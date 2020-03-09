import IBalanceSheetReport from '../model/balanceSheetReport/interfaces/IBalanceSheetReport'; // eslint-disable-line
import BalanceSheetReportSchema from '../dataAccess/schemas/BalanceSheetReportSchema';
import BaseRepository from './base/BaseRepository';
import BalanceSheetReportCreate from '../model/balanceSheetReport/BalanceSheetReportCreate'; // eslint-disable-line
import BalanceSheetReportUpdate from '../model/balanceSheetReport/BalanceSheetReportUpdate'; // eslint-disable-line

class BalanceSheetReportRepository extends BaseRepository<IBalanceSheetReport> {
    constructor() {
        super(BalanceSheetReportSchema);
    }

    async create(data: BalanceSheetReportCreate): Promise<IBalanceSheetReport> {
        return await super.create(data);
    }
}

Object.seal(BalanceSheetReportRepository);
export default BalanceSheetReportRepository;
