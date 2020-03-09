import IGroupExpense from '../model/groupExpense/interfaces/IGroupExpense';
import BaseRepository from './base/BaseRepository';
import GroupExpenseCreate from '../model/groupExpense/GroupExpenseCreate';
declare class GroupExpenseRepository extends BaseRepository<IGroupExpense> {
    constructor();
    create(data: GroupExpenseCreate): Promise<IGroupExpense>;
}
export default GroupExpenseRepository;
