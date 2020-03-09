import IGroupReportBusiness from './interfaces/IGroupReportBusiness'; // eslint-disable-line
import BusinessLoader from '../../system/BusinessLoader';
import GroupReportRepository from 'justdone-system-package/dest/app/repository/GroupReportRepository';
import GroupReport from 'justdone-system-package/dest/app/model/groupReport/GroupReport';
import GroupReportCreate from 'justdone-system-package/dest/app/model/groupReport/GroupReportCreate'; // eslint-disable-line
import GroupReportUpdate from 'justdone-system-package/dest/app/model/groupReport/GroupReportUpdate'; // eslint-disable-line
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import module from 'justdone-system-package/dest/resources/permission/module';
import AuthorizationHelper from 'justdone-system-package/dest/helpers/AuthorizationHelper';

class GroupReportBusiness implements IGroupReportBusiness {
    private GroupReportRepository: GroupReportRepository;

    constructor() {
        this.GroupReportRepository = new GroupReportRepository();
    }

    async getAll(): Promise<GroupReport[]> {
        let groupReport = await this.GroupReportRepository.findAll();
        return groupReport ? groupReport : [];
    }

    async get(_id: string): Promise<GroupReport | null> {
        if (!_id)
            return null;
        let groupReport = await this.GroupReportRepository.get(_id);
        return groupReport && new GroupReport(groupReport);
    }

    update(_id: string, data: GroupReportUpdate) :any {
        return null;
    }

    async getAllByUser(userId: string): Promise<GroupReport[]> {
        let param = {
            query: {
                userId: userId
            },
        };
        let GroupReports = await this.GroupReportRepository.find(param, {order: 1}, 0, 100);
        return GroupReports ? GroupReports : [];
    }

    async getCoaListOfUser(userId: string): Promise<string[]> {
        let GroupReports = await this.getAllByUser(userId);
        let coas:string[] = [];
        for (let i = 0; i < GroupReports.length; i++) {
            if (GroupReports[i].coas && GroupReports[i].coas.length > 0) {
                // coas = [...new Set(coas.concat(GroupReports[i].coas))];
                coas = coas.concat(GroupReports[i].coas);
            }
        }
        return coas;
    }

    async getByUser(originId: string, page: number, limit: number): Promise<GroupReport[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.GROUP_EXPENSE.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];

        let originUser = await AuthorizationHelper.userService.get(originId);
        let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        if (!originUser || !originUser.permission ||
            !products.find(product => product.code === productCode))
            return [];

        let params = <any>{
            query: {
                userId: DataHelper.toObjectId(originId),
            },
            select: '-coas'
        };

        let GroupReports = await this.GroupReportRepository.find(params, {order: -1, code: 1}, page, limit);
        return GroupReport.parseArray(GroupReports);
    }

    async getChartAccountByGroupId(originId: string, groupId: string): Promise<GroupReport | null> {
        if (!originId || !groupId)
            return null;
        let products = await Authenticator.filterProductsPermission([module.GROUP_EXPENSE.claim.GET.code], originId, []);
        if (!products || !products.length)
            return null;

        let originUser = await AuthorizationHelper.userService.get(originId);
        let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        if (!originUser || !originUser.permission ||
            !products.find(product => product.code === productCode))
            return null;
        let param = {
            query: {
                _id: DataHelper.toObjectId(groupId)
            },
            select: '-searchTerm -userId',
            populate: {
                path: 'coas',
                select: '_id name code'
            }
        };
        let groupReport = await this.GroupReportRepository.findOne(param);
        return groupReport && new GroupReport(groupReport);
    }

    async create(data: GroupReportCreate): Promise<GroupReport> {
        let groupReport;
        data.searchTerm = data.code + ' ' + data.name.toLowerCase();
        data.name = data.name.toLowerCase();
        groupReport = await this.GroupReportRepository.create(data);

        return groupReport && new GroupReport(groupReport);
    }

    async addChartAccount(_id: string, userId: string, coas: string[]): Promise<boolean> {
        if (!coas || coas.length <= 0) {
            throw new ErrorCommon(105, 'Chart Account');
        }
        if (!userId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.GROUP_EXPENSE.claim.GET.code], userId, []);
        if (!products || !products.length)
            return false;

        let originUser = await AuthorizationHelper.userService.get(userId);
        let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        if (!originUser || !originUser.permission ||
                !products.find(product => product.code === productCode))
            return false;

        let group = await this.GroupReportRepository.get(_id);
        let i = 0;

        do {
            let coa = await BusinessLoader.chartAccountBusiness.get(coas[i]);
            if (!coa) {
                throw new ErrorCommon(101, 'Chart Account');
            }
            i++;
        } while (i < coas.length);

        if (!group)
            throw new ErrorCommon(101, 'Group');

        // to do check coa exist user
        // let coasCurrent = await this.getCoaListOfUser(userId);
        // for (let i = 0; i < coas.length; i++) {
        //     let coaExists = coasCurrent.find(key => key === coas[i]);
        //     if (!coaExists)
        //         throw new ErrorCommon(102, 'Chart Account');
        // }
        let result = await this.GroupReportRepository.update(_id, {$addToSet: {coas: {$each: coas}}});
        return result;
    }

    async removeCoa(originId: string, GroupReportId: string, coaId: string): Promise<boolean> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        if (!GroupReportId || !coaId)
            return false;

        let products = await Authenticator.filterProductsPermission([module.GROUP_EXPENSE.claim.DELETE.code], originId, []);
        if (!products || !products.length)
            return false;

        let originUser = await AuthorizationHelper.userService.get(originId);
        let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        if (!originUser || !originUser.permission ||
            !products.find(product => product.code === productCode))
            return false;
        let data = {
            '$pull': {
                'coas': {
                    '$in': [DataHelper.toObjectId(coaId)]
                }
            }
        };
        let result = await this.GroupReportRepository.update(GroupReportId, data);
        if (result)
            return true;
        else
            return false;
    }

    async delete(_id: string): Promise<boolean> {
        let param = {
            query: {
                parent: DataHelper.toObjectId(_id)
            }
        };
        let childGroup = await this.GroupReportRepository.findOne(param);

        if (childGroup)
            return false;

        let result = await this.GroupReportRepository.delete(_id, true);

        return result;
    }

    async deleteGroupReport(originId: string, GroupReportId: string): Promise<boolean> {
        if (!originId || !GroupReportId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.GROUP_EXPENSE.claim.DELETE.code], originId, []);
        if (!products || !products.length)
            return false;

        let originUser = await AuthorizationHelper.userService.get(originId);
        let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        if (!originUser || !originUser.permission ||
            !products.find(product => product.code === productCode))
            return false;
        let param = {
            query: {
                parent: DataHelper.toObjectId(GroupReportId)
            }
        };
        let childGroup = await this.GroupReportRepository.findOne(param);

        if (childGroup)
            return false;

        let result = await this.GroupReportRepository.delete(GroupReportId, true);

        return result;
    }

    async checkDataExists(userId: string, name: string): Promise<boolean> {
        let param = {
            query: {
                userId: DataHelper.toObjectId(userId),
                $or: [
                    {name: name}
                ]
            }
        };
        let group = await this.GroupReportRepository.findOne(param);
        return group ? true : false;
    }

    async checkDataUpdateExists(_id: string, userId: string, name: string): Promise<boolean> {
        let param = {
            query: {
                _id: {$ne: DataHelper.toObjectId(_id)},
                userId: DataHelper.toObjectId(userId),
                $or: [
                    {name: name}
                ]
            }
        };
        let group = await this.GroupReportRepository.findOne(param);
        return group ? true : false;
    }
}

Object.seal(GroupReportBusiness);
export default GroupReportBusiness;
