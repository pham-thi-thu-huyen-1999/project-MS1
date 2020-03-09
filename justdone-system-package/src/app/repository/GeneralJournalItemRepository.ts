import GeneralJournalItem from '../model/generalJournalItem/GeneralJournalItem'; // eslint-disable-line
import IGeneralJournalItem from '../model/generalJournalItem/interfaces/IGeneralJournalItem'; // eslint-disable-line
import GeneralJournalItemSchema from '../dataAccess/schemas/GeneralJournalItemSchema';
import BaseRepository from './base/BaseRepository';
import GeneralJournalItemCreate from '../model/generalJournalItem/GeneralJournalItemCreate'; // eslint-disable-line
import GeneralJournalItemUpdate from '../model/generalJournalItem/GeneralJournalItemUpdate'; // eslint-disable-line

class GeneralJournalItemRepository extends BaseRepository<IGeneralJournalItem> {
    constructor() {
        super(GeneralJournalItemSchema);
    }

    async create(data: GeneralJournalItemCreate): Promise<IGeneralJournalItem> {
        return await super.create(data);
    }
}

Object.seal(GeneralJournalItemRepository);
export default GeneralJournalItemRepository;
