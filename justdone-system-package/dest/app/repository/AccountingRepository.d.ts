import IAccounting from '../model/accounting/interfaces/IAccounting';
import BaseRepository from './base/BaseRepository';
import AccountingCreate from '../model/accounting/AccountingCreate';
import AccountingUpdate from '../model/accounting/AccountingUpdate';
declare class AccountingRepository extends BaseRepository<IAccounting> {
    constructor();
    create(data: AccountingCreate): Promise<IAccounting>;
    update(_id: string, data: AccountingUpdate): Promise<boolean>;
}
export default AccountingRepository;
