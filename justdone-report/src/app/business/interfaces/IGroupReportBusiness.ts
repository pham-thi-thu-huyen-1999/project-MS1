import GroupReport from 'justdone-system-package/dest/app/model/groupReport/GroupReport';
import GroupReportCreate from 'justdone-system-package/dest/app/model/groupReport/GroupReportCreate'; // eslint-disable-line
import GroupReportUpdate from 'justdone-system-package/dest/app/model/groupReport/GroupReportUpdate'; // eslint-disable-line

interface IGroupReportBusiness {
    getAll: () => Promise<GroupReport[]>;
    get:(_id: string)=> Promise<GroupReport | null>;
    update: (_id: string, data: GroupReportUpdate) => Promise<GroupReport | null>;
    getGroupReportByIncomeAndOtherIncome(): Promise<GroupReport[]>;
    getGroupBySettingCode(settingCode: string) :Promise<any[]>;
    create(data: GroupReportCreate): Promise<GroupReport>;
    getByGroupIds(ids:string[]): Promise<GroupReport[]>;
    getByCoaId(ids:string): Promise<GroupReport | null>;
    getByCoaIdBalanceSheet(ids:string): Promise<GroupReport | null>;
    getGroupReportByAsset(): Promise<GroupReport[]>;
}

export default IGroupReportBusiness;
