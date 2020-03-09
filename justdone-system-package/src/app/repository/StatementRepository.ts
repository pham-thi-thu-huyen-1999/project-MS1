import IStatement from '../model/statement/interfaces/IStatement'; // eslint-disable-line
import StatementSchema from '../dataAccess/schemas/StatementSchema';
import BaseRepository from './base/BaseRepository';

class StatementRepository extends BaseRepository<IStatement> {
    constructor() {
        super(StatementSchema);
    }

    async updateNameField(): Promise<boolean> {
        return await this.model.update({}, {$rename: {'providerAccountId': 'accountId'}}, {multi: true, strict: false}, function(err, blocks) { }).exec();
    }
}

Object.seal(StatementRepository);
export default StatementRepository;
