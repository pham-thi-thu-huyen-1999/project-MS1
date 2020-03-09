import IGroupReport from '../model/groupReport/interfaces/IGroupReport'; // eslint-disable-line
import GroupReportSchema from '../dataAccess/schemas/GroupReportSchema';
import BaseRepository from './base/BaseRepository';
import GroupReportCreate from '../model/groupReport/GroupReportCreate'; // eslint-disable-line

class GroupReportRepository extends BaseRepository<IGroupReport> {
    constructor() {
        super(GroupReportSchema);
    }

    async create(data: GroupReportCreate): Promise<IGroupReport> {
        return await super.create(data);
    }
}

Object.seal(GroupReportRepository);
export default GroupReportRepository;
