import IGeneralJournalTransaction from '../model/generalJournalTransaction/interfaces/IGeneralJournalTransaction';
import GeneralJournalTransactionCreate from '../model/generalJournalTransaction/GeneralJournalTransactionCreate';
import BaseRepository from './base/BaseRepository';
declare class TransactionRepository extends BaseRepository<IGeneralJournalTransaction> {
    constructor();
    create(data: GeneralJournalTransactionCreate): Promise<IGeneralJournalTransaction>;
}
export default TransactionRepository;
