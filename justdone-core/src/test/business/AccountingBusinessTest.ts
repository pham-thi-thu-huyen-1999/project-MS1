import 'mocha';
import {expect} from 'chai';
import BusinessLoader from '../../system/BusinessLoader';
import Project from '../../config/Project';
import {DataAccess} from 'justdone-system-package/dest/app/dataAccess/DataAccess';
import UserCreate from 'justdone-system-package/dest/app/model/user/UserCreate';
import AccountingCreate from 'justdone-system-package/dest/app/model/accounting/AccountingCreate';

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

let userTest1 = new UserCreate(<any>{
    firstName: 'Nguyen',
    lastName: 'huu',
    fullName: 'Nguyen huu',
    email: 'huuthi12@namtech.com.au',
    password: 'Kitty123!',
    productType: 1,
    status: 1
});

describe('AccountingBusiness testing', () => {
    it('Create new Accounting', async () => {
        let user = await BusinessLoader.userBusiness.create(userTest1);
        let accountingCreate = new AccountingCreate(<any>{
            userId: user._id,
            beginYear: 2014,
            endYear: 2020,
            basQuarter: true,
            basQuarter1: {
                status: 1,
                beginMonth: 8,
                endMonth: 9,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            basQuarter2: {
                status: 1,
                beginMonth: 10,
                endMonth: 12,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            basQuarter3: {
                status: 1,
                beginMonth: 1,
                endMonth: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            basQuarter4: {
                status: 1,
                beginMonth: 6,
                endMonth: 7,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        let accounting = await BusinessLoader.accountingBusiness.create(accountingCreate);
        expect(accounting.userId).to.equal(accountingCreate.userId);
    });

    it('Delete account', async () => {
        let account = await BusinessLoader.accountingBusiness.getAll();
        if (account && account.length > 0) {
            let result = await BusinessLoader.accountingBusiness.delete(account[0]._id);
            expect(result).to.be.true;
        }
    });

    // it('get Accounting By User ', async () => {
    //     let userTest1 = new UserCreate(<IUser>{
    //         firstName: 'Nguyen',
    //         lastName: 'huu',
    //         email: 'huuthi1@namtech.com.au',
    //         password: 'Kitty123!',
    //         productType: 1,
    //         status: 1
    //     });
    //     let user = await BusinessLoader.userBusiness.create(userTest1);
    //     let accounting = await BusinessLoader.accountingBusiness.getAccountingByUser(user._id, 2017, 2017);
    //     expect(accounting).to.exist;
    // });
});
