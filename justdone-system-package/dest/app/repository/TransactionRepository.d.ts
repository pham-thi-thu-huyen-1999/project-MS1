import ITransaction from '../model/transaction/interfaces/ITransaction';
import TransactionCreate from '../model/transaction/TransactionCreate';
import BaseRepository from './base/BaseRepository';
declare class TransactionRepository extends BaseRepository<ITransaction> {
    constructor();
    create(data: TransactionCreate): Promise<ITransaction>;
}
export default TransactionRepository;
