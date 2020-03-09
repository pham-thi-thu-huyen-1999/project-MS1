import GroupExpenseCreate from 'justdone-system-package/dest/app/model/groupExpense/GroupExpenseCreate';

export default function getGroupExpenses(): {isRequired: boolean, data: GroupExpenseCreate}[] {
    let groupExpense:any = [{
        isRequired: true,
        data: {
            ...new GroupExpenseCreate(<any>{
                name: 'Test 1',
                code: '001',
                parent: '',
                searchTerm: '001 Test1',
                userId: '5a16533fed0b673daf48ec09'})
        }
    }];

    return groupExpense;
}
