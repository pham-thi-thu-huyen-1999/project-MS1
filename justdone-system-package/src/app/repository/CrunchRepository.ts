import ICrunch from '../model/crunch/interfaces/ICrunch'; // eslint-disable-line
import CrunchSchema from '../dataAccess/schemas/CrunchSchema';
import BaseRepository from './base/BaseRepository';
import { Crunch, CrunchCreate, CrunchUpdate} from '../model/crunch';// eslint-disable-line

class CrunchRepository extends BaseRepository<ICrunch> {
    constructor() {
        super(CrunchSchema);
    }

    async create(data: CrunchCreate): Promise<ICrunch> {
        return await super.create(data);
    }

    async update(_id: string, data: CrunchUpdate): Promise<boolean> {
        return await super.update(_id, data);
    }

    async updateNameField(): Promise<boolean> {
        return await this.model.update({}, {$rename: {'providerAccountId': 'accountId'}}, {multi: true, strict: false}, function(err, blocks) { }).exec();
    }
}

Object.seal(CrunchRepository);
export default CrunchRepository;
