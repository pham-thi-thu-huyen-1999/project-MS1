import IBaseBusiness from './base/IBaseBusiness';
import GroupReport from 'justdone-system-package/dest/app/model/groupReport/GroupReport';
import GroupReportCreate from 'justdone-system-package/dest/app/model/groupReport/GroupReportCreate'; // eslint-disable-line
import GroupReportUpdate from 'justdone-system-package/dest/app/model/groupReport/GroupReportUpdate'; // eslint-disable-line

interface IGroupReportBusiness extends IBaseBusiness<GroupReport> {
    getAll: () => Promise<GroupReport[]>;
    getChartAccountByGroupId: (originId: string, groupId: string) => Promise<GroupReport | null>;
    update: (_id: string, data: GroupReportUpdate) => Promise<GroupReport | null>;
    create(data: GroupReportCreate): Promise<GroupReport>;
}

export default IGroupReportBusiness;
