import IReceipt from '../model/receipt/interfaces/IReceipt';
import BaseRepository from './base/BaseRepository';
import ReceiptCreate from '../model/receipt/ReceiptCreate';
import ReceiptUpdate from '../model/receipt/ReceiptUpdate';
declare class ReceiptRepository extends BaseRepository<IReceipt> {
    constructor();
    create(data: ReceiptCreate): Promise<IReceipt>;
    update(_id: string, data: ReceiptUpdate): Promise<boolean>;
}
export default ReceiptRepository;
