import IGroupExpense from '../model/groupExpense/interfaces/IGroupExpense'; // eslint-disable-line
import GroupExpenseSchema from '../dataAccess/schemas/GroupExpenseSchema';
import BaseRepository from './base/BaseRepository';
import GroupExpenseCreate from '../model/groupExpense/GroupExpenseCreate'; // eslint-disable-line

class GroupExpenseRepository extends BaseRepository<IGroupExpense> {
    constructor() {
        super(GroupExpenseSchema);
    }

    async create(data: GroupExpenseCreate): Promise<IGroupExpense> {
        return await super.create(data);
    }
}

Object.seal(GroupExpenseRepository);
export default GroupExpenseRepository;
