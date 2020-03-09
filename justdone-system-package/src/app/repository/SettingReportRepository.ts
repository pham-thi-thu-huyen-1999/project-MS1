import ISettingReport from '../model/settingReport/interfaces/ISettingReport'; // eslint-disable-line
import SettingReportSchema from '../dataAccess/schemas/SettingReportSchema';
import BaseRepository from './base/BaseRepository';

class ReportRepository extends BaseRepository<ISettingReport> {
    constructor() {
        super(SettingReportSchema);
    }

    async create(data: {code:number, reportType:number, groupId:string}): Promise<ISettingReport> {
        return await super.create(data);
    }

    async update(_id: string, data: any): Promise<boolean> {
        return await super.update(_id, data);
    }
}

Object.seal(ReportRepository);
export default ReportRepository;
