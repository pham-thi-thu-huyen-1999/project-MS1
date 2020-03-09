import IMagicLink from '../model/magiclink/interfaces/IMagiclink';
import BaseRepository from './base/BaseRepository';
import MagiclinkCreate from '../model/magiclink/MagiclinkCreate';
declare class MagicLinkRepository extends BaseRepository<IMagicLink> {
    constructor();
    create(data: MagiclinkCreate): Promise<IMagicLink>;
}
export default MagicLinkRepository;
