import ICrunchFilter from '../model/crunchFilter/interfaces/ICrunchFilter'; // eslint-disable-line
import CrunchFilterSchema from '../dataAccess/schemas/CrunchFilterSchema';
import BaseRepository from './base/BaseRepository';
// import CrunchFilter from '../model/crunchFilter/CrunchFilter';// eslint-disable-line
import CrunchFilterCreate from '../model/crunchFilter/CrunchFilterCreate';// eslint-disable-line

class CrunchFilterRepository extends BaseRepository<ICrunchFilter> {
    constructor() {
        super(CrunchFilterSchema);
    }

    async create(data: CrunchFilterCreate): Promise<ICrunchFilter> {
        return await super.create(data);
    }
}

Object.seal(CrunchFilterRepository);
export default CrunchFilterRepository;
