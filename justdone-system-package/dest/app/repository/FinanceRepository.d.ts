import IFinance from '../model/finance/interfaces/IFinance';
import BaseRepository from './base/BaseRepository';
import FinanceCreate from '../model/finance/FinanceCreate';
declare class FinanceRepository extends BaseRepository<IFinance> {
    constructor();
    create(data: FinanceCreate): Promise<IFinance>;
}
export default FinanceRepository;
