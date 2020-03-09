import IGroupReportBusiness from './interfaces/IGroupReportBusiness'; // eslint-disable-line
import GroupReportRepository from 'justdone-system-package/dest/app/repository/GroupReportRepository';
import GroupReport from 'justdone-system-package/dest/app/model/groupReport/GroupReport';
import GroupReportCreate from 'justdone-system-package/dest/app/model/groupReport/GroupReportCreate'; // eslint-disable-line
import GroupReportUpdate from 'justdone-system-package/dest/app/model/groupReport/GroupReportUpdate'; // eslint-disable-line
import BusinessLoader from '../../system/BusinessLoader';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';

class GroupReportBusiness implements IGroupReportBusiness {
    private groupReportRepository: GroupReportRepository;

    constructor() {
        this.groupReportRepository = new GroupReportRepository();
    }

    async getAll(): Promise<GroupReport[]> {
        let groupReport = await this.groupReportRepository.findAll();
        return groupReport ? groupReport : [];
    }

    async get(_id: string): Promise<GroupReport | null> {
        if (!_id)
            return null;
        let groupReport = await this.groupReportRepository.get(_id);
        return groupReport && new GroupReport(groupReport);
    }

    async getGroupReportByIncomeAndOtherIncome(): Promise<GroupReport[]> {
        const body = {
            query: {$or: [{code: '7-0000'}, {code: '4-0000'}]},
            populate: {
                path: 'coas',
                select: '_id name code'
            }
        };
        let groupReports = await this.groupReportRepository.find(body);

        return GroupReport.parseArray(groupReports);
    }

    async getByGroupIds(ids:string[]): Promise<GroupReport[]> {
        const body = {
            query: {_id: {$in: ids}},
            populate: {
                path: 'coas',
                select: '_id name code'
            }
        };
        let groups = await this.groupReportRepository.findAll(body);
        return GroupReport.parseArray(groups);
    }

    async getGroupReportByAsset(): Promise<GroupReport[]> {
        const body = {
            query: {
                $or: [{_id: DataHelper.toObjectId('5c1a064e1db73153088b5aa6')}, {parentId: DataHelper.toObjectId('5d2550157d8aac691e58d30a')}]
            },
            populate: {
                path: 'coas',
                select: '_id name code'
            }
        };
        let groups = await this.groupReportRepository.find(body);
        return GroupReport.parseArray(groups);
    }

    async getGroupBySettingCode(settingCode: string) :Promise<any[]> {
        const gstGroupSetting = await BusinessLoader.settingReportBusiness.getSettingByCodes([settingCode]);
        const gstGroupReports = await BusinessLoader.groupReportBusiness.getByGroupIds(gstGroupSetting.map(item => item.groupId));
        return gstGroupReports.length ? gstGroupReports[0].coas : [];
    }

    async getByCoaId(id:string): Promise<GroupReport | null> {
        const body = {
            query: {coas: {$in: [id]}},
            populate: {
                path: 'coas',
                select: '_id name code'
            }
        };
        let group = await this.groupReportRepository.findOne(body);
        return group && new GroupReport(group);
    }

    async getByCoaIdBalanceSheet(id:string): Promise<GroupReport | null> {
        const body = {
            query: {
                coas: {
                    $in: [id]
                }, 
            parentId: {
                $ne: null
            }},
            populate: {
                path: 'coas',
                select: '_id name code'
            }
        };
        let group = await this.groupReportRepository.findOne(body);
        if(group === null){
            const query = {
                query: {
                    coas: {
                        $in: [id]
                    }
                },
                populate: {
                    path: 'coas',
                    select: '_id name code'
                }
            };
            group = await this.groupReportRepository.findOne(query);
        }
        return group && new GroupReport(group);
    }

    update(_id: string, data: GroupReportUpdate) :any {
        return null;
    }

    async create(data: GroupReportCreate): Promise<GroupReport> {
        let groupReport;
        data.searchTerm = data.code + ' ' + data.name.toLowerCase();
        data.name = data.name.toLowerCase();
        groupReport = await this.groupReportRepository.create(data);
        return groupReport && new GroupReport(groupReport);
    }
}

Object.seal(GroupReportBusiness);
export default GroupReportBusiness;
