import ICrunch from '../model/crunch/interfaces/ICrunch';
import BaseRepository from './base/BaseRepository';
import { CrunchCreate, CrunchUpdate } from '../model/crunch';
declare class CrunchRepository extends BaseRepository<ICrunch> {
    constructor();
    create(data: CrunchCreate): Promise<ICrunch>;
    update(_id: string, data: CrunchUpdate): Promise<boolean>;
    updateNameField(): Promise<boolean>;
}
export default CrunchRepository;
