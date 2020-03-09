import 'mocha';
import {expect} from 'chai';
import BusinessLoader from '../../system/BusinessLoader';
import Project from '../../config/Project';
import {DataAccess} from 'justdone-system-package/dest/app/dataAccess/DataAccess';

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

describe('File business testing', () => {
    it('Delete File', async () => {
        let files = await BusinessLoader.fileBusiness.getAll();
        if (files && files.length > 0) {
            let result = await BusinessLoader.fileBusiness.delete(files[0]._id);
            expect(result).to.be.true;
        }
    });

    // it('deleteMultiple File', async () => {
    //     let data = {

    //     };
    //     let result = await BusinessLoader.fileBusiness.deleteMultiple(data);
    //     expect(result).to.be.true;
    // });
});

