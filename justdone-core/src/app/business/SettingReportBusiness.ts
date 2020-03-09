import SettingReportRepository from 'justdone-system-package/dest/app/repository/SettingReportRepository';
import SettingReport from 'justdone-system-package/dest/app/model/settingReport/SettingReport'; // eslint-disable-line
import balanceSheetTemplate from 'justdone-system-package/dest/resources/template/balanceSheetTemplate'; // eslint-disable-line
import ISettingReportBusiness from './interfaces/ISettingReportBusiness';// eslint-disable-line

class SettingReportBusiness implements ISettingReportBusiness {
    private settingReportRepository : SettingReportRepository;
    private templateReport;
    constructor() {
        this.settingReportRepository = new SettingReportRepository();
        this.templateReport = balanceSheetTemplate;
    }

    async getAll(): Promise<SettingReport[]> {
        let settingReports = await this.settingReportRepository.findAll();
        return SettingReport.parseArray(settingReports);
    }

    getConfig(): Promise<any> {
        return this.templateReport;
    }

    async get(_id:string): Promise<any> {
        return this.settingReportRepository.get(_id);
    }

    async create(data: any): Promise<any> {
        const settingReport = await this.settingReportRepository.create(data);
        return settingReport && new SettingReport(settingReport);
    }

    async update(_id:string, data: any): Promise<any> {
        return await this.settingReportRepository.update(_id, data);
    }
}

Object.seal(SettingReportBusiness);
export default SettingReportBusiness;
