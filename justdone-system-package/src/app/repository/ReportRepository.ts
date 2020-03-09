import IReport from '../model/report/interfaces/IReport'; // eslint-disable-line
import ReportSchema from '../dataAccess/schemas/ReportSchema';
import BaseRepository from './base/BaseRepository';
import ReportCreate from '../model/report/ReportCreate'; // eslint-disable-line
import ReportUpdate from '../model/report/ReportUpdate'; // eslint-disable-line

class ReportRepository extends BaseRepository<IReport> {
    constructor() {
        super(ReportSchema);
    }

    async create(data: ReportCreate): Promise<IReport> {
        return await super.create(data);
    }

    async update(_id: string, data: ReportUpdate): Promise<boolean> {
        return await super.update(_id, data);
    }
}

Object.seal(ReportRepository);
export default ReportRepository;
