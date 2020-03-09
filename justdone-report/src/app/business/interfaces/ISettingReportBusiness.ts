import SettingReport from 'justdone-system-package/dest/app/model/settingReport/SettingReport';

interface ISettingReportBusiness {
    getAll: () => Promise<SettingReport[]>;
    create: (data: any) => Promise<any>;
    getConfigByType: (type:number) => Promise<any>;
    getGroupIdsByReportType(type:number): Promise<any[]>;
    getAllGroupReportByType(type:number): Promise<SettingReport[]>
    getSettingByCodes(codes:string[]):Promise<SettingReport[]>;
}

export default ISettingReportBusiness;
