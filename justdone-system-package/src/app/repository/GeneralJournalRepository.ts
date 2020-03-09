import IGeneralJournal from '../model/generalJournal/interfaces/IGeneralJournal'; // eslint-disable-line
import GeneralJournalSchema from '../dataAccess/schemas/GeneralJournalSchema';
import BaseRepository from './base/BaseRepository';
import GeneralJournalCreate from '../model/generalJournal/GeneralJournalCreate'; // eslint-disable-line
import GeneralJournalUpdate from '../model/generalJournal/GeneralJournalUpdate'; // eslint-disable-line

class GeneralJournalRepository extends BaseRepository<IGeneralJournal> {
    constructor() {
        super(GeneralJournalSchema);
    }

    async create(data: GeneralJournalCreate): Promise<IGeneralJournal> {
        return await super.create(data);
    }
}

Object.seal(GeneralJournalRepository);
export default GeneralJournalRepository;
