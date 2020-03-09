import IGeneralJournalItem from '../model/generalJournalItem/interfaces/IGeneralJournalItem';
import BaseRepository from './base/BaseRepository';
import GeneralJournalItemCreate from '../model/generalJournalItem/GeneralJournalItemCreate';
declare class GeneralJournalItemRepository extends BaseRepository<IGeneralJournalItem> {
    constructor();
    create(data: GeneralJournalItemCreate): Promise<IGeneralJournalItem>;
}
export default GeneralJournalItemRepository;
