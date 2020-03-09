import IBaseBusiness from './base/IBaseBusiness';
import GroupExpense from 'justdone-system-package/dest/app/model/groupExpense/GroupExpense';
import GroupExpenseCreate from 'justdone-system-package/dest/app/model/groupExpense/GroupExpenseCreate'; // eslint-disable-line
import GroupExpenseUpdate from 'justdone-system-package/dest/app/model/groupExpense/GroupExpenseUpdate'; // eslint-disable-line

interface IGroupExpenseBusiness extends IBaseBusiness<GroupExpense> {
    getAll: () => Promise<GroupExpense[]>;
    getByUser: (originId: string, page: number, limit: number) => Promise<GroupExpense[]>;
    getCountByUser: (originId: string) => Promise<number>;
    getChartAccountByGroupId: (originId: string, groupId: string) => Promise<GroupExpense | null>;
    getByParent: (parent: string) => Promise<GroupExpense | null>;
    getGroupsByChartAccounts: (managerId: string, coasIds: string[]) => Promise<{_id: string, code: number, name: string, coas: string[]}[]>;
    getCoaListOfUser: (userId: string) => Promise<string[]>
    update: (_id: string, data: GroupExpenseUpdate) => Promise<GroupExpense | null>;
    removeCoa: (originId: string, groupExpenseId: string, coaId: string) => Promise<boolean>;
    checkDataExists: ( userId: string, name: string) => Promise<boolean>;
    checkDataUpdateExists: (_id: string, userId: string, name: string) => Promise<boolean>;
    addChartAccount: (_id: string, userId: string, coas: string[]) => Promise<boolean>;

    getAllByUser: (userId: string) => Promise<GroupExpense[]>;
    createGroupExpense: (originId: string, data: GroupExpenseCreate) => Promise<GroupExpense | boolean>;
    updateGroupExpense: (originId: string, groupExpenseId: string, data: GroupExpenseUpdate) => Promise<GroupExpense | null>;
    deleteGroupExpense: (originId: string, groupExpenseId: string) => Promise<boolean>;
    orderGroupExpense: (originId: string, groupExpenseArray: any[]) => Promise<boolean>;
}

export default IGroupExpenseBusiness;
