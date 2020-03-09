import 'mocha';
import {expect} from 'chai';
import BusinessLoader from '../../system/BusinessLoader';
import Project from '../../config/Project';
import {DataAccess} from 'justdone-system-package/dest/app/dataAccess/DataAccess';
import IRoleBusiness from '../../app/business/interfaces/IRoleBusiness'; // eslint-disable-line
import Role from 'justdone-system-package/dest/app/model/role/Role'; // eslint-disable-line
import RoleCreate from 'justdone-system-package/dest/app/model/role/RoleCreate'; // eslint-disable-line
import RoleUpdate from 'justdone-system-package/dest/app/model/role/RoleUpdate'; // eslint-disable-line

let connection;
BusinessLoader.init();
let roleBusiness: IRoleBusiness = BusinessLoader.roleBusiness;

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

describe('Role business testing', () => {
    it('Create new role', async () => {
        let roleCreate = new RoleCreate(<any>{
            name: 'Role test',
            order: 1
        });
        let role = await roleBusiness.create(roleCreate);
        expect(role.name).to.equal(roleCreate.name);
    });

    it('Update role', async () => {
        let roles = await roleBusiness.getAll();
        if (roles && roles.length > 0) {
            let roleUpdate = new RoleUpdate(<any>roles[0]);
            roleUpdate.name = 'Role updated';
            let role = await roleBusiness.update(roles[0]._id, roleUpdate);
            expect(role).to.not.be.null;
        }
    });

    it('Find roles', async () => {
        let roles = await roleBusiness.getAll();
        expect(Array.isArray(roles)).to.be.true;
    });

    it('Get role by id', async () => {
        let roles = await roleBusiness.getAll();
        if (roles && roles.length > 0) {
            let user = await roleBusiness.get(roles[0]._id);
            expect(user).to.not.be.null;
        }
    });

    it('Delete role', async () => {
        let roles = await roleBusiness.getAll();
        if (roles && roles.length > 0) {
            let result = await roleBusiness.delete(roles[0]._id);
            expect(result).to.be.true;
        }
    });
});

