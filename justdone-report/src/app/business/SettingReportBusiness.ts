import SettingReportRepository from 'justdone-system-package/dest/app/repository/SettingReportRepository';
import SettingReport from 'justdone-system-package/dest/app/model/settingReport/SettingReport'; // eslint-disable-line
import balanceSheetTemplate from 'justdone-system-package/dest/resources/template/balanceSheetTemplate'; // eslint-disable-line
import profitLossTemplate from 'justdone-system-package/dest/resources/template/profitLossTemplate'; // eslint-disable-line
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

    getConfigByType(type: number): any {
        return type === 1 ? balanceSheetTemplate : profitLossTemplate;
    }

    async get(_id:string): Promise<any> {
        return this.settingReportRepository.get(_id);
    }

    async getSettingByCodes(codes:string[]):Promise<SettingReport[]> {
        const query = {
            code: {
                $in: codes
            }
        };

        let settingReports = await this.settingReportRepository.findAll({
            query: query
        });

        return SettingReport.parseArray(settingReports);
    }

    async create(data: any): Promise<any> {
        const settingReport = await this.settingReportRepository.create(data);
        return settingReport && new SettingReport(settingReport);
    }

    async update(_id:string, data: any): Promise<any> {
        return await this.settingReportRepository.update(_id, data);
    }

    async getGroupIdsByReportType(type:number): Promise<any[]> {
        const template = this.getConfigByType(type);
        let codes = this.getCodeByTemplate(template);
        console.log(codes);
        let groups = await this.settingReportRepository.findAll({query: {
            code: {$in: codes}
        }});
        return groups;
    }

    async getAllGroupReportByType(type:number): Promise<SettingReport[]> {
        let groups = await this.settingReportRepository.findAll({query: {
            reportType: type
        }});
        return SettingReport.parseArray(groups);
    }

    getCodeByTemplate(template:any):string[] {
        let result:any[] = [];
        if (template.items && template.items.length > 0) {
            template.items.forEach(element => {
                result = result.concat(this.getCodeByTemplate(element));
            });
        }
        if (template.code && !template.items)
            result.push(template.code);
        return result;
    }
}

Object.seal(SettingReportBusiness);
export default SettingReportBusiness;
