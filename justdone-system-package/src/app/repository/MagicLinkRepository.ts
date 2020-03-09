import IMagicLink from '../model/magiclink/interfaces/IMagiclink'; // eslint-disable-line
import MagicLinkSchema from '../dataAccess/schemas/MagicLinkSchema';
import BaseRepository from './base/BaseRepository';
import MagiclinkCreate from '../model/magiclink/MagiclinkCreate'; // eslint-disable-line
import MagiclinkUpdate from '../model/magiclink/MagiclinkUpdate'; // eslint-disable-line

class MagicLinkRepository extends BaseRepository<IMagicLink> {
    constructor() {
        super(MagicLinkSchema);
    }

    async create(data: MagiclinkCreate): Promise<IMagicLink> {
        return await super.create(data);
    }
}

Object.seal(MagicLinkRepository);
export default MagicLinkRepository;
