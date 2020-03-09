import IAccounting from '../model/accounting/interfaces/IAccounting'; // eslint-disable-line
import AccountingSchema from '../dataAccess/schemas/AccountingSchema';
import BaseRepository from './base/BaseRepository';
import AccountingCreate from '../model/accounting/AccountingCreate'; // eslint-disable-line
import AccountingUpdate from '../model/accounting/AccountingUpdate'; // eslint-disable-line
import AccountingItem from '../model/accounting/AccountingItem'; //eslint-disable-line
import BasQuarterAccountItem from '../model/accounting/BasQuarterAccountItem'; //eslint-disable-line
import MonthlyAccountItem from '../model/accounting/MonthlyAccountItem'; //eslint-disable-line

class AccountingRepository extends BaseRepository<IAccounting> {
    constructor() {
        super(AccountingSchema);
    }

    async create(data: AccountingCreate): Promise<IAccounting> {
        return await super.create(data);
    }

    async update(_id: string, data: AccountingUpdate): Promise<boolean> {
        return await super.update(_id, data);
    }
}

Object.seal(AccountingRepository);
export default AccountingRepository;
