import ITransaction from '../model/transaction/interfaces/ITransaction'; // eslint-disable-line
import TransactionCreate from '../model/transaction/TransactionCreate'; // eslint-disable-line
import ExtendFilterSchema from '../dataAccess/schemas/ExtendFilterSchema';
import BaseRepository from './base/BaseRepository';

class ExtendFilterRepository extends BaseRepository<ITransaction> {
    constructor() {
        super(ExtendFilterSchema);
    }

    async create(data: TransactionCreate): Promise<ITransaction> {
        return await super.create(data);
    }
}

Object.seal(ExtendFilterRepository);
export default ExtendFilterRepository;
