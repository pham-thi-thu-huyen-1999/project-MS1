import SettingReport from 'justdone-system-package/dest/app/model/settingReport/SettingReport';

interface ISettingReportBusiness {
    getAll: () => Promise<SettingReport[]>;
    create: (data: any) => Promise<any>;
    getConfig: () => Promise<any>;
}

export default ISettingReportBusiness;
