import 'mocha';
import {expect} from 'chai';
import BusinessLoader from '../../system/BusinessLoader';
import Project from '../../config/Project';
import {DataAccess} from 'justdone-system-package/dest/app/dataAccess/DataAccess';
import UserCreate from 'justdone-system-package/dest/app/model/user/UserCreate';
import GroupExpenseCreate from 'justdone-system-package/dest/app/model/groupExpense/GroupExpenseCreate';//eslint-disable-line
import GroupExpenseUpdate from 'justdone-system-package/dest/app/model/groupExpense/GroupExpenseUpdate';

let connection;
BusinessLoader.init();

before(done => {
    connection = DataAccess.connect(Project.DB_CONN_URI_TEST);
    connection.once('open', async () => {
        await connection.db.dropDatabase();
        done();
    });
});

after(async () => {
    await connection.db.dropDatabase();
});

// let userTest1 = new UserCreate(<any>{
//     firstName: 'Nguyen',
//     lastName: 'Thi',
//     email: 'thi@namtech.com.au',
//     password: 'Kitty123!',
//     productType: 1,
//     status: 1
// });
let userTest2 = new UserCreate(<any>{ // eslint-disable-line
    firstName: 'Felix',
    lastName: 'Le',
    email: 'felix@gmail.com',
    password: 'Kitty123!',
    productType: 1,
    status: 1
});

describe('GroupExpense business testing', () => {
    it('Create new GroupExpense', async () => {
        // let user = await BusinessLoader.userBusiness.create(userTest1);
        // let groupExpenseCreate = new GroupExpenseCreate(<any>{
        //     name: 'group 1',
        //     code: '1',
        //     parent: '',
        //     coas: [],
        //     searchTerm: 'g1',
        //     userId: user._id
        // });
        // let groupexpense = await BusinessLoader.groupExpenseBusiness.create(groupExpenseCreate);
        // expect(groupexpense.name).to.equal(groupExpenseCreate.name);
    });
    it('Update new Group Expense', async () => {
        let groupExpense = await BusinessLoader.groupExpenseBusiness.getAll();
        if (groupExpense && groupExpense.length > 0) {
            let groupExpenseUpdate = new GroupExpenseUpdate(<any>groupExpense[0]);
            groupExpenseUpdate.name = 'GroupExpense updated';
            groupExpenseUpdate.code = 2345;
            let groupexpense = await BusinessLoader.groupExpenseBusiness.update(groupExpense[0]._id, groupExpenseUpdate);
            expect(groupexpense).to.not.be.null;
        }
    });
    it('Find GroupExpense', async () => {
        let groupExpense = await BusinessLoader.groupExpenseBusiness.getAll();
        expect(Array.isArray(groupExpense)).to.be.true;
    });
    // it('getByParent GroupExpense', async () => {
    //     let param = '';
    //     let groupExpense = await BusinessLoader.groupExpenseBusiness.getByParent(param);
    //     expect(groupExpense).to.be.true;
    // });
    // it('addcoas GroupExpense', async () => {
    //     let groupId = '5a2f7b993d5822685d45f14d';
    //     let idCoa = '5a2f64532f0e526852e87603';
    //     let groupExpense = await BusinessLoader.groupExpenseBusiness.addcoas(groupId, idCoa);
    //     expect(groupExpense).to.not.be.null;
    // });
    it('Delete GroupExpense', async () => {
        let groupExpense = await BusinessLoader.groupExpenseBusiness.getAll();
        if (groupExpense && groupExpense.length > 0) {
            let result = await BusinessLoader.groupExpenseBusiness.delete(groupExpense[0]._id);
            expect(result).to.be.true;
        }
    });
});
