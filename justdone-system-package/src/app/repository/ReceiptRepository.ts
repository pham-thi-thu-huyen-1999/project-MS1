import IReceipt from '../model/receipt/interfaces/IReceipt'; // eslint-disable-line
import ReceiptSchema from '../dataAccess/schemas/ReceiptSchema';
import BaseRepository from './base/BaseRepository';
import ReceiptCreate from '../model/receipt/ReceiptCreate'; // eslint-disable-line
import ReceiptUpdate from '../model/receipt/ReceiptUpdate'; // eslint-disable-line

class ReceiptRepository extends BaseRepository<IReceipt> {
    constructor() {
        super(ReceiptSchema);
    }

    async create(data: ReceiptCreate): Promise<IReceipt> {
        return await super.create(data);
    }

    async update(_id: string, data: ReceiptUpdate): Promise<boolean> {
        return await super.update(_id, data);
    }
}

Object.seal(ReceiptRepository);
export default ReceiptRepository;
