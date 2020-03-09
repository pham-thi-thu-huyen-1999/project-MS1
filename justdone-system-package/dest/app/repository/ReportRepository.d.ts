import IReport from '../model/report/interfaces/IReport';
import BaseRepository from './base/BaseRepository';
import ReportCreate from '../model/report/ReportCreate';
import ReportUpdate from '../model/report/ReportUpdate';
declare class ReportRepository extends BaseRepository<IReport> {
    constructor();
    create(data: ReportCreate): Promise<IReport>;
    update(_id: string, data: ReportUpdate): Promise<boolean>;
}
export default ReportRepository;
