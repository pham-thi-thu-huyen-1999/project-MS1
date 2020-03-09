import 'mocha';
import {expect} from 'chai';
// import {helpers} from 'justdone-system-package';
import BusinessLoader from '../../system/BusinessLoader';
import Project from '../../config/Project';
import {DataAccess} from 'justdone-system-package/dest/app/dataAccess/DataAccess';
import {ProductCode, RoleCode} from 'justdone-system-package/dest/app/model/common/CommonType';

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

describe('Abnbusiness testing', () => {
    it('Abn LookUp Abnbusiness', async function() {
        this.timeout(6000); //eslint-disable-line
        let abnLookUp = await BusinessLoader.abnBusiness.abnLookUp(ProductCode.WhiteLabel, RoleCode.Client, '51 824 753 556');
        expect(abnLookUp.entityType).to.exist;
    });
});
