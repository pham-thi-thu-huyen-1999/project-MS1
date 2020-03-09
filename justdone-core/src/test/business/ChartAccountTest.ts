import 'mocha';
import {expect} from 'chai'; //eslint-disable-line
import BusinessLoader from '../../system/BusinessLoader';
import Project from '../../config/Project';
import {DataAccess} from 'justdone-system-package/dest/app/dataAccess/DataAccess';
import ChartAccount from 'justdone-system-package/dest/app/model/chartAccount/ChartAccount'; // eslint-disable-line
import ChartAccountCreate from 'justdone-system-package/dest/app/model/chartAccount/ChartAccount'; //eslint-disable-line
import ChartAccountUpdate from 'justdone-system-package/dest/app/model/chartAccount/ChartAccount';//eslint-disable-line
import GroupExpense from 'justdone-system-package/dest/app/model/groupExpense/GroupExpense'; //eslint-disable-line
import UserCreate from 'justdone-system-package/dest/app/model/user/UserCreate'; // eslint-disable-line

let connection;
BusinessLoader.init();

let userTest1 = new UserCreate(<any>{ // eslint-disable-line
    firstName: 'Nguyen',
    lastName: 'Tin',
    fullName: 'Nguyen Tin',
    email: 'tin@gmail.com',
    password: 'Kitty123!',
    productType: 1,
    status: 1
});

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

describe('ChartAccount business testing', () => {
    it('Create new ChartAccount', async () => {
        // let user = await BusinessLoader.userBusiness.create(userTest1);
        // let GroupExpress1 = new GroupExpense(<any>{
        //     userId: user._id,
        //     name: 'group1',
        //     code: '001'
        // });
        // let GroupExpress = await BusinessLoader.groupExpenseBusiness.create(GroupExpress1);
        // console.log('GroupExpress: ', GroupExpress);
        // if (GroupExpress) {
        //     let chartAccountCreate = new ChartAccountCreate(<any>{
        //         userId: user._id,
        //         code: '0111',
        //         name: 'NAME2'
        //     });
        //     let chartAccount = await BusinessLoader.chartAccountBusiness.create(chartAccountCreate);
        //     expect(chartAccountCreate.name).to.equal(chartAccount.name);
        // }
    });

    // it('Update ChartAccount', async () => {
    //     let chartAccount = await BusinessLoader.chartAccountBusiness.getAll();
    //     if (chartAccount && chartAccount.length > 0) {
    //         let chartAccountUpdate = new ChartAccountUpdate(<any>chartAccount[0]);
    //         chartAccountUpdate.name = 'Name1';
    //         chartAccountUpdate.code = '2213';
    //         let result = await BusinessLoader.chartAccountBusiness.update(chartAccount[0]._id, chartAccountUpdate);
    //         expect(result).to.not.be.null;
    //     }
    // });

    // it('Delete ChartAccount', async () => {
    //     let chartAccount = await BusinessLoader.chartAccountBusiness.getAll();
    //     if (chartAccount && chartAccount.length > 0) {
    //         let result = await BusinessLoader.chartAccountBusiness.delete(chartAccount[0]._id);
    //         expect(result).to.be.true;
    //     }
    // });
});
