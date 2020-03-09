import IGeneralJournal from '../model/generalJournal/interfaces/IGeneralJournal';
import BaseRepository from './base/BaseRepository';
import GeneralJournalCreate from '../model/generalJournal/GeneralJournalCreate';
declare class GeneralJournalRepository extends BaseRepository<IGeneralJournal> {
    constructor();
    create(data: GeneralJournalCreate): Promise<IGeneralJournal>;
}
export default GeneralJournalRepository;
