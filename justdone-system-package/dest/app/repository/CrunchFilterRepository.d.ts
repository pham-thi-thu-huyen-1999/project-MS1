import ICrunchFilter from '../model/crunchFilter/interfaces/ICrunchFilter';
import BaseRepository from './base/BaseRepository';
import CrunchFilterCreate from '../model/crunchFilter/CrunchFilterCreate';
declare class CrunchFilterRepository extends BaseRepository<ICrunchFilter> {
    constructor();
    create(data: CrunchFilterCreate): Promise<ICrunchFilter>;
}
export default CrunchFilterRepository;
