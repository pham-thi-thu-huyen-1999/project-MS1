import IBalanceSheetReport from '../model/balanceSheetReport/interfaces/IBalanceSheetReport';
import BaseRepository from './base/BaseRepository';
import BalanceSheetReportCreate from '../model/balanceSheetReport/BalanceSheetReportCreate';
declare class BalanceSheetReportRepository extends BaseRepository<IBalanceSheetReport> {
    constructor();
    create(data: BalanceSheetReportCreate): Promise<IBalanceSheetReport>;
}
export default BalanceSheetReportRepository;
