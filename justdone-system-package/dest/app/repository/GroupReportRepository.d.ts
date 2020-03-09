import IGroupReport from '../model/groupReport/interfaces/IGroupReport';
import BaseRepository from './base/BaseRepository';
import GroupReportCreate from '../model/groupReport/GroupReportCreate';
declare class GroupReportRepository extends BaseRepository<IGroupReport> {
    constructor();
    create(data: GroupReportCreate): Promise<IGroupReport>;
}
export default GroupReportRepository;
