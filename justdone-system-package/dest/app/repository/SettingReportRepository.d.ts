import ISettingReport from '../model/settingReport/interfaces/ISettingReport';
import BaseRepository from './base/BaseRepository';
declare class ReportRepository extends BaseRepository<ISettingReport> {
    constructor();
    create(data: {
        code: number;
        reportType: number;
        groupId: string;
    }): Promise<ISettingReport>;
    update(_id: string, data: any): Promise<boolean>;
}
export default ReportRepository;
