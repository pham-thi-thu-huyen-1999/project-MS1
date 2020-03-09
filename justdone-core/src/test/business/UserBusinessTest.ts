import 'mocha';
import {expect} from 'chai';
import BusinessLoader from '../../system/BusinessLoader';
import Project from '../../config/Project';
import {DataAccess} from 'justdone-system-package/dest/app/dataAccess/DataAccess';
import IUserBusiness from '../../app/business/interfaces/IUserBusiness'; // eslint-disable-line
import IRoleBusiness from '../../app/business/interfaces/IRoleBusiness'; // eslint-disable-line
import User from 'justdone-system-package/dest/app/model/user/User'; // eslint-disable-line
import UserCreate from 'justdone-system-package/dest/app/model/user/UserCreate'; // eslint-disable-line
import UserUpdate from 'justdone-system-package/dest/app/model/user/UserUpdate'; // eslint-disable-line
import UserAuthentication from 'justdone-system-package/dest/app/model/user/UserAuthentication'; // eslint-disable-line
import UserConnectedBank from 'justdone-system-package/dest/app/model/user/UserConnectedBank'; // eslint-disable-line
import RoleCreate from 'justdone-system-package/dest/app/model/role/RoleCreate'; // eslint-disable-line
import {ProductCode} from 'justdone-system-package/dest/app/model/common/CommonType'; // eslint-disable-line

BusinessLoader.init();

let connection;
let userBusiness: IUserBusiness = BusinessLoader.userBusiness;
// let roleBusiness: IRoleBusiness = BusinessLoader.roleBusiness;

// let Role1 :RoleCreate = {name: Role.Administrator, order: 1}; // eslint-disable-line
// let Role2 :RoleCreate = {name: Role.Manager, order: 2}; // eslint-disable-line
// let Role3 :RoleCreate = {name: Role.TaxAgent, order: 3}; // eslint-disable-line
// let Role4 :RoleCreate = {name: Role.Client, order: 4}; // eslint-disable-line

let userTest1 = new UserCreate(<any>{ // eslint-disable-line
    firstName: 'Nguyen',
    lastName: 'Pham',
    email: 'nguyen.pham@gmail.com',
    password: 'Kitty123!',
    productType: 1,
    status: 1,
    personalInfo: {
        birthday: new Date()
    }
});
let userTest2 = new UserCreate(<any>{ // eslint-disable-line
    firstName: 'Felix',
    lastName: 'Le',
    email: 'felix@gmail.com',
    password: 'Kitty123!',
    productType: 1,
    status: 1,
    personalInfo: {
        birthday: new Date()
    }
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

describe('User business testing', () => {
    it('==> Get Connect Bank Test', async () => {
        // await roleBusiness.create(Role4);
        let user = await userBusiness.signup(ProductCode.Justdone, userTest1);
        let connectBank: UserConnectedBank = {type: 1, providerId: 'ACB Global'};
        let result = await userBusiness.updateConnectedBanks(user._id, connectBank);
        if (result) {
            let userConnectedBank = await userBusiness.getConnectedBanks(user._id);
            expect(userConnectedBank[0].providerId).to.equal(connectBank.providerId);
        }
    });
});
