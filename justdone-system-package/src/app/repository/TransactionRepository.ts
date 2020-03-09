import ITransaction from '../model/transaction/interfaces/ITransaction'; // eslint-disable-line
import TransactionCreate from '../model/transaction/TransactionCreate'; // eslint-disable-line
import TransactionSchema from '../dataAccess/schemas/TransactionSchema';
import BaseRepository from './base/BaseRepository';

class TransactionRepository extends BaseRepository<ITransaction> {
    constructor() {
        super(TransactionSchema);
    }

    async create(data: TransactionCreate): Promise<ITransaction> {
        return await super.create(data);
    }
}

Object.seal(TransactionRepository);
export default TransactionRepository;
