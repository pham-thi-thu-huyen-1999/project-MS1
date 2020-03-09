import IGroupExpenseBusiness from './interfaces/IGroupExpenseBusiness'; // eslint-disable-line
import BusinessLoader from '../../system/BusinessLoader';
import GroupExpenseRepository from 'justdone-system-package/dest/app/repository/GroupExpenseRepository';
import GroupExpense from 'justdone-system-package/dest/app/model/groupExpense/GroupExpense';
import GroupExpenseCreate from 'justdone-system-package/dest/app/model/groupExpense/GroupExpenseCreate'; // eslint-disable-line
import GroupExpenseUpdate from 'justdone-system-package/dest/app/model/groupExpense/GroupExpenseUpdate'; // eslint-disable-line
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import module from 'justdone-system-package/dest/resources/permission/module';
import AuthorizationHelper from 'justdone-system-package/dest/helpers/AuthorizationHelper';

class GroupExpenseBusiness implements IGroupExpenseBusiness {
    private groupExpenseRepository: GroupExpenseRepository;

    constructor() {
        this.groupExpenseRepository = new GroupExpenseRepository();
    }

    async getAll(): Promise<GroupExpense[]> {
        let groupExpense = await this.groupExpenseRepository.findAll();
        return groupExpense ? groupExpense : [];
    }

    async get(_id: string): Promise<GroupExpense | null> {
        if (!_id)
            return null;
        let groupExpense = await this.groupExpenseRepository.get(_id);
        return groupExpense && new GroupExpense(groupExpense);
    }

    async getAllByUser(userId: string): Promise<GroupExpense[]> {
        let param = {
            query: {
                userId: userId
            },
        };
        let groupExpenses = await this.groupExpenseRepository.find(param, {order: 1}, 0, 100);
        return groupExpenses ? groupExpenses : [];
    }

    async getCoaListOfUser(userId: string): Promise<string[]> {
        let groupExpenses = await this.getAllByUser(userId);
        let coas:string[] = [];
        for (let i = 0; i < groupExpenses.length; i++) {
            if (groupExpenses[i].coas && groupExpenses[i].coas.length > 0) {
                // coas = [...new Set(coas.concat(groupExpenses[i].coas))];
                coas = coas.concat(groupExpenses[i].coas);
            }
        }
        return coas;
    }

    async getByUser(originId: string, page: number, limit: number): Promise<GroupExpense[]> {
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

        let groupExpenses = await this.groupExpenseRepository.find(params, {order: -1, code: 1}, page, limit);
        return GroupExpense.parseArray(groupExpenses);
    }

    async getCountByUser(originId: string): Promise<number> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.GROUP_EXPENSE.claim.GET.code], originId, []);
        if (!products || !products.length)
            return 0;

        let originUser = await AuthorizationHelper.userService.get(originId);
        let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        if (!originUser || !originUser.permission ||
            !products.find(product => product.code === productCode))
            return 0;
        let params = {
            query: {
                userId: DataHelper.toObjectId(originId)
            }
        };
        return await this.groupExpenseRepository.getCount(params);
    }

    async getChartAccountByGroupId(originId: string, groupId: string): Promise<GroupExpense | null> {
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
        let groupExpense = await this.groupExpenseRepository.findOne(param);
        return groupExpense && new GroupExpense(groupExpense);
    }

    async getByParent(parent: string): Promise<GroupExpense | null> {
        if (!parent)
            return null;
        let param = {
            query: {
                _id: DataHelper.toObjectId(parent),
            }
        };
        return await this.groupExpenseRepository.findOne(param);
    }

    async getGroupsByChartAccounts(managerId: string, coaIds: string[]): Promise<{_id: string, code: number, name: string, coas: string[]}[]> {
        let groups: {_id: string, code: number, name: string, order: number, coas: string[]}[] = [];
        // let i = 0;
        // do {
        //     let params = {
        //         query: {
        //             // userId: DataHelper.toObjectId(userId),
        //             coas: {$in: [DataHelper.toObjectId(coaIds[i])]}
        //         }
        //     };
        //     let result = await this.groupExpenseRepository.findAll(params);
        //     if (result.length) {
        //         for (let j = 0; j < result.length; j++) {
        //             let group = groups.find(item => item._id.toString() === result[j]._id.toString());
        //             if (group)
        //                 group.coas.push(coaIds[i]);
        //             else
        //                 groups.push({_id: result[j]._id, code: result[j].code, name: result[j].name, coas: [coaIds[i]]});
        //         }
        //     }
        //     i++;
        // } while (i < coaIds.length);
        let params = {
            query: {
                userId: DataHelper.toObjectId(managerId),
                coas: {$in: coaIds.map(coaId => DataHelper.toObjectId(coaId))}
            },
            select: 'name code coas order'
        };
        groups = await this.groupExpenseRepository.findAll(params);
        return groups;
    }

    async create(data: GroupExpenseCreate): Promise<GroupExpense> {
        let groupExpense;
        if (!data.userId)
            throw new ErrorCommon(104, 'User id');
        if (validateName(data.name)) {
            if (await this.checkDataExists(data.userId, data.name.toLowerCase()))
                throw new ErrorCommon(104, 'Name');
            else {
                if (!data.parent || await this.getByParent(data.parent)) {
                    data.searchTerm = data.code + ' ' + data.name.toLowerCase();
                    data.name = data.name.toLowerCase();
                    groupExpense = await this.groupExpenseRepository.create(data);
                }
                else
                    throw new ErrorCommon(102, 'Parent');
            }
        }
        return groupExpense && new GroupExpense(groupExpense);
    }

    async createGroupExpense(originId: string, data: GroupExpenseCreate): Promise<GroupExpense | boolean> {
        let groupExpense;
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.GROUP_EXPENSE.claim.CREATE.code], originId, []);
        if (!products || !products.length)
            return false;

        let originUser = await AuthorizationHelper.userService.get(originId);
        let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        if (!originUser || !originUser.permission ||
            !products.find(product => product.code === productCode))
            return false;

        if (validateName(data.name)) {
            if (await this.checkDataExists(originId, data.name.toLowerCase()))
                throw new ErrorCommon(104, 'Name');
            else {
                if (!data.parent || await this.getByParent(data.parent)) {
                    data.searchTerm = data.code + ' ' + data.name.toLowerCase();
                    data.name = data.name.toLowerCase();
                    groupExpense = await this.groupExpenseRepository.create(data);
                }
                else
                    throw new ErrorCommon(102, 'Parent');
            }
        }
        return groupExpense && new GroupExpense(groupExpense);
    }

    async update(_id: string, data: GroupExpenseUpdate): Promise<GroupExpense | null> {
        let result;
        if (validateName(data.name)) {
            if (await this.checkDataUpdateExists(_id, data.userId, data.name.toLowerCase())) {
                throw new ErrorCommon(104, 'Code or name');
            }
            else {
                if (!data.parent || await this.getByParent(data.parent)) {
                    data.searchTerm = data.code + '' + data.name.toLowerCase();
                    data.name = data.name.toLowerCase();
                    result = await this.groupExpenseRepository.update(_id, data);
                }
                else {
                    throw new ErrorCommon(102, 'Parent');
                }
            }
        }
        if (result)
            return await this.get(_id);
        return null;
    }

    async updateGroupExpense(originId: string, groupExpenseId: string, data: GroupExpenseUpdate): Promise<GroupExpense | null> {
        let result;
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.GROUP_EXPENSE.claim.UPDATE.code], originId, []);
        if (!products || !products.length)
            return null;

        let originUser = await AuthorizationHelper.userService.get(originId);
        let productCode = originUser && originUser.permission && originUser.permission.product && originUser.permission.product.code;
        if (!originUser || !originUser.permission ||
            !products.find(product => product.code === productCode))
            return null;

        if (validateName(data.name)) {
            if (await this.checkDataUpdateExists(groupExpenseId, data.userId, data.name.toLowerCase()))
                throw new ErrorCommon(104, 'Code or name');
            else {
                if (!data.parent || await this.getByParent(data.parent)) {
                    data.searchTerm = data.code + '' + data.name.toLowerCase();
                    data.name = data.name.toLowerCase();
                    result = await this.groupExpenseRepository.update(groupExpenseId, data);
                }
                else {
                    throw new ErrorCommon(102, 'Parent');
                }
            }
        }
        if (result)
            return await this.get(groupExpenseId);
        return null;
    }

    async orderGroupExpense(originId: string, data: any[]): Promise<boolean> {
        if (!data || !Array.isArray(data) || !data.length)
            return false;
        let handles: any[] = [];
        for (let i = 0; i < data.length; i++) {
            handles.push(this.groupExpenseRepository.update(data[i]._id, {order: data[i].order}));
        }

        if (handles.length)
            await Promise.all(handles);

        return true;
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

        let group = await this.groupExpenseRepository.get(_id);
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
        let result = await this.groupExpenseRepository.update(_id, {$addToSet: {coas: {$each: coas}}});
        return result;
    }

    async removeCoa(originId: string, groupExpenseId: string, coaId: string): Promise<boolean> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        if (!groupExpenseId || !coaId)
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
        let result = await this.groupExpenseRepository.update(groupExpenseId, data);
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
        let childGroup = await this.groupExpenseRepository.findOne(param);

        if (childGroup)
            return false;

        let result = await this.groupExpenseRepository.delete(_id, true);

        return result;
    }

    async deleteGroupExpense(originId: string, groupExpenseId: string): Promise<boolean> {
        if (!originId || !groupExpenseId)
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
                parent: DataHelper.toObjectId(groupExpenseId)
            }
        };
        let childGroup = await this.groupExpenseRepository.findOne(param);

        if (childGroup)
            return false;

        let result = await this.groupExpenseRepository.delete(groupExpenseId, true);

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
        let group = await this.groupExpenseRepository.findOne(param);
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
        let group = await this.groupExpenseRepository.findOne(param);
        return group ? true : false;
    }
}

function validateName(name: string): boolean {
    if (!name)
        throw new ErrorCommon(105, 'Name and Code');
    // else if (name.trim().length < 4)
    //     throw new ErrorCommon(201, 'name', '4');
    // else if (code <= 0)
    //     throw new ErrorCommon(201, 'Code');
    return true;
}

Object.seal(GroupExpenseBusiness);
export default GroupExpenseBusiness;
