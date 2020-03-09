import GeneralJournalRepository from 'justdone-system-package/dest/app/repository/GeneralJournalRepository';
import GeneralJournalItemRepository from 'justdone-system-package/dest/app/repository/GeneralJournalItemRepository';
import GeneralJournalTransactionRepository from 'justdone-system-package/dest/app/repository/GeneralJournalTransactionRepository';
import GeneralJournal from 'justdone-system-package/dest/app/model/generalJournal/GeneralJournal'; // eslint-disable-line
import GeneralJournalItem from 'justdone-system-package/dest/app/model/generalJournalItem/GeneralJournalItem'; // eslint-disable-line
import GeneralJournalItemUpdate from 'justdone-system-package/dest/app/model/generalJournalItem/GeneralJournalItemUpdate'; // eslint-disable-line
import GeneralJournalUpdate from 'justdone-system-package/dest/app/model/generalJournal/GeneralJournalUpdate'; // eslint-disable-line
import IGeneralJournalBusiness from './interfaces/IGeneralJournalBusiness';// eslint-disable-line
import BusinessLoader from '../../system/BusinessLoader';// eslint-disable-line
import GeneralJournalItemCreate from 'justdone-system-package/dest/app/model/generalJournalItem/GeneralJournalItemCreate';// eslint-disable-line
import GeneralJournalItemExtend from 'justdone-system-package/dest/app/model/generalJournalItem/GeneralJournalItemExtend';// eslint-disable-line
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import Pagination from 'justdone-system-package/dest/app/model/common/Pagination';
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import {GenernalJournalItemType, GstType, RoleCode} from 'justdone-system-package/dest/app/model/common/CommonType';
import GoogleStorageHelper from 'justdone-system-package/dest/helpers/GoogleStorageHelper';
import {isBoolean} from 'util';

class GeneralJournalBusiness implements IGeneralJournalBusiness {
    private generalJournalRepository : GeneralJournalRepository;
    private generalJournalItemRepository : GeneralJournalItemRepository;
    private generalJournalTransactionRepository: GeneralJournalTransactionRepository;
    constructor() {
        this.generalJournalRepository = new GeneralJournalRepository();
        this.generalJournalItemRepository = new GeneralJournalItemRepository();
        this.generalJournalTransactionRepository = new GeneralJournalTransactionRepository();
    }
    async getGeneralJournalById(_id:string): Promise<GeneralJournal | null> {
        const generalJournal = await this.generalJournalRepository.get(_id);
        return generalJournal && new GeneralJournal(generalJournal);
    }

    async getGeneralJournalByTextSearch(userId:string, month: number, year: number, textSearch: string, page: number, limit:number): Promise<any> {
        let pagination = new Pagination(page, limit);
        const regexText = new RegExp(textSearch, 'i');

        const statementQuery = [{
            $match: {
                userId: DataHelper.toObjectId(userId),
                month: Number(month),
                year: Number(year)
            }
        }, {
            $lookup: {
                from: 'transactions',
                localField: 'transactionId',
                foreignField: '_id',
                as: 'transactionId'
            }
        }, {
            $unwind: '$transactionId'
        }, {
            $match: {
                'transactionId.description.original': {
                    $regex: regexText
                }
            }
        }, {
            $lookup: {
                from: 'chartaccounts',
                localField: 'coaId',
                foreignField: '_id',
                as: 'coaId'
            }
        }, {
            $skip: pagination.skip
        }, {
            $limit: pagination.limit
        }
        ];

        let result = await this.generalJournalRepository.aggregate(statementQuery);
        return result;
    }

    async getGeneralJournalByTextSearchTotal(userId:string, month: number, year: number, textSearch: string): Promise<number> {
        const regexText = new RegExp(textSearch, 'i');

        const statementQuery = [{
            $match: {
                userId: DataHelper.toObjectId(userId),
                month: Number(month),
                year: Number(year)
            }
        }, {
            $lookup: {
                from: 'transactions',
                localField: 'transactionId',
                foreignField: '_id',
                as: 'transactionId'
            }
        }, {
            $unwind: '$transactionId'
        }, {
            $match: {
                'transactionId.description.original': {
                    $regex: regexText
                }
            }
        }, {
            $lookup: {
                from: 'chartaccounts',
                localField: 'coaId',
                foreignField: '_id',
                as: 'coaId'
            }
        }, {
            $count: 'total'
        }
        ];

        const result = await this.generalJournalRepository.aggregate(statementQuery);

        return result && result.length ? result[0].total : 0;
    }

    async getGeneralJournal(userId:string, beginMonth: number, beginYear:number, endMonth: number, endYear: number, page: number, limit:number):Promise<any[]> {
        const params = {
            query: {
                userId,
                $or: [{
                    month: {
                        $gte: beginMonth
                    },
                    beginYear: {
                        $eq: beginYear
                    }
                }, {
                    month: {
                        $lte: endMonth
                    },
                    beginYear: {
                        $eq: endYear
                    }
                }]
            },
            populate: [{
                path: 'productId',
                select: 'name'
            }, {
                path: 'userId',
                select: 'fullName'
            }]
        };

        const generalJournals = await this.generalJournalRepository.find(params, null, page, limit);
        const gjIds = generalJournals.map(item => item._id);
        const gjTotal = await this.getTotalItemByJournals(gjIds);
        const gjTaxInclude = await this.getStatusTaxInclude(gjIds);
        return GeneralJournal.parseArray(generalJournals).map(item => {
            const gjTotalItem = gjTotal.find(gjItem => gjItem._id.toString() === item._id.toString());
            const gjTaxIncludeItem = gjTaxInclude.find(gjItem => gjItem._id.toString() === item._id.toString());
            const isTaxInclude = gjTaxIncludeItem && gjTaxIncludeItem._id && gjTaxIncludeItem.isIncludeTax ? true : false;
            const totalTransactions = gjTotalItem && gjTotalItem.total ? gjTotalItem.total : 0;
            return {...item, totalTransactions, isTaxInclude};
        });
    }

    async getGeneralJournalTotal(userId:string, beginMonth: number, beginYear:number, endMonth: number, endYear: number):Promise<number> {
        const params = {
            query: {
                userId,
                $or: [{
                    month: {
                        $gte: beginMonth
                    },
                    beginYear: {
                        $eq: beginYear
                    }
                }, {
                    month: {
                        $lte: endMonth
                    },
                    beginYear: {
                        $eq: endYear
                    }
                }]
            }
        };
        return await this.generalJournalRepository.getCount(params);
    }

    async getGeneralJournalItemTotal(gjId: string):Promise<number> {
        const params = {
            query: {
                gjId
            }
        };
        return await this.generalJournalItemRepository.getCount(params);
    }

    async getTotalItemByJournals(gjs:string[]):Promise<any[]> {
        const statementQuery = [{
            $match: {
                _id: {$in: gjs}
            }
        }, {
            $lookup: {
                from: 'generaljournalitems',
                localField: '_id',
                foreignField: 'gjId',
                as: 'item'
            }
        }, {
            $unwind: '$item'
        }, {
            $match: {
                'item.deletedAt': null
            }
        }, {
            $group: {
                _id: '$_id',
                total: {$sum: 1}
            }
        }
        ];
        const result = await this.generalJournalRepository.aggregate(statementQuery);
        return result ? result : [];
    }

    async getStatusTaxInclude(gjs:string[]) {
        const params = {
            query: {
                gjId: {$in: gjs}
            },
            populate: [{
                path: 'before.coaId',
                select: 'code name gstType'
            }, {
                path: 'after.coaId',
                select: 'code name gstType'
            }, {
                path: 'evidenced',
                select: 'url'
            }]
        };
        const gjItems = await this.generalJournalItemRepository.findAll(params);
        const result = gjs.map(item => ({_id: item, isIncludeTax: true, count: 0}));
        gjItems.map(item => {
            if (item.after && item.after.coaId) {
                const gstType = item.after.coaId.gstType;
                if (gstType === GstType.CAP || gstType === GstType.GST) {
                    const indexGJ = result.findIndex(i => i._id.toString() === item.gjId.toString());
                    if (indexGJ >= 0) {
                        result[indexGJ].count ++;
                        if (!item.isIncludeTax)
                            result[indexGJ].isIncludeTax = false;
                    }
                }
            }
        });
        return result;
    }
    async getGeneralJournalItem(gjId: string, page: number, limit:number):Promise<GeneralJournalItem[]> {
        const params = {
            query: {
                gjId
            },
            populate: [{
                path: 'transactionId',
                select: 'description transactionId amount baseType'
            }, {
                path: 'before.coaId',
                select: 'code name gstType'
            }, {
                path: 'after.coaId',
                select: 'code name gstType'
            }, {
                path: 'evidenced',
                select: 'url'
            }]
        };
        const generalJournalItems = await this.generalJournalItemRepository.find(params, null, page, limit);
        // return GeneralJournalItem.parseArray(generalJournalItems);
        return generalJournalItems;
    }

    async getGeneralJournalItemById(_id:string): Promise<GeneralJournalItem | null> {
        const populate = [{
            path: 'userId',
            select: 'permission'
        }];
        const generalJournal = await this.generalJournalItemRepository.get(_id, populate);
        return generalJournal && new GeneralJournalItem(generalJournal);
    }

    async generateGJCode(userId:string, year:number, beginYear:number):Promise<string> {
        const endYear = beginYear + 1;
        const gjCode = `GJ${beginYear % 2000}${endYear % 2000}`;
        const regexText = new RegExp(gjCode, 'i');
        const gj = await this.generalJournalRepository.find({query: {code: regexText, userId}}, {code: -1}, undefined, 1);
        if (!gj || gj.length === 0)
            return gjCode + '001';
        const nowCode = gj[0].code;
        const numberCode = nowCode.replace(gjCode, '');
        const newNumberCode = this.convertNumberToString(Number(numberCode));
        if (isNaN(Number(newNumberCode)))
            return gjCode + '001';
        return gjCode + this.convertNumberToString(Number(numberCode) + 1);
    }

    private convertNumberToString(numberConvert: number) {
        const firstNumber = numberConvert;
        let numberZero = 2;
        while (numberConvert > 9 && numberZero > 0) {
            numberConvert /= 10;
            numberZero --;
        }
        let result = '';
        for (let index = 0; index < numberZero; index++) {
            result += '0';
        }
        return result + firstNumber.toString();
    }

    async createGeneralJournalAndItems(userId: string, month: number, year: number, beginYear: number, note: string, gjItems: GeneralJournalItemCreate[]):Promise<any> {
        if (!userId)
            throw new ErrorCommon(101, 'Request');

        const gj = await this.createGeneralJournal(userId, month, year, beginYear, note);

        if (!gj)
            return null;
        if (Array.isArray(gjItems) && gjItems.length) {
            for (let index = 0; index < gjItems.length; index++) {
                const element = gjItems[index];
                element.gjId = gj._id;
                element.userId = userId;
            }
        }

        const items = await this.createGeneralJournalItems(gjItems);

        return {
            ...gj,
            items
        };
    }

    validateGeneralJournalItem(item:GeneralJournalItemCreate) {
        if (!item.month || !item.year || !item.after || !item.after.typeCrunch || (item.type !== GenernalJournalItemType.ADJUSTMENT && item.type !== GenernalJournalItemType.NEWTRANSACTION))
            return false;

        if (item.type === GenernalJournalItemType.NEWTRANSACTION)
            return this.validateGeneralJournalItemExtend(item.extend);

        if (item.type === GenernalJournalItemType.ADJUSTMENT && !item.transactionId)
            return false;
        return true;
    }

    validateGeneralJournalItemExtend(extend:GeneralJournalItemExtend): boolean {
        if (!extend || !extend.amount || !extend.description || !isBoolean(extend.isCredit))
            return false;
        return true;
    }

    async createGeneralJournal(userId: string, month: number, year: number, beginYear: number, note: string): Promise<GeneralJournal | null> {
        const gjCode = await this.generateGJCode(userId, year, beginYear);
        const user = await BusinessLoader.userBusiness.get(userId);

        if (!user)
            throw new ErrorCommon(101, 'Request');

        const productId = user.permission && user.permission.product ? user.permission.product : null;

        if (!productId)
            throw new ErrorCommon(101, 'Request');

        const dataCreate = {userId, code: gjCode, month, beginYear: year, productId, note};
        const generalJournal = await this.generalJournalRepository.create(dataCreate);
        return GeneralJournal && new GeneralJournal(generalJournal);
    }

    async createGeneralJournalItem(gjItem: GeneralJournalItemCreate): Promise<GeneralJournalItem | null> {
        if (!gjItem || !gjItem.gjId)
            throw new ErrorCommon(101, 'Request');
        const gjId = gjItem.gjId;
        if (!this.validateGeneralJournalItem(gjItem))
            throw new ErrorCommon(101, 'Request');

        const generalJournal = await this.generalJournalRepository.get(gjId);

        if (!generalJournal)
            throw new ErrorCommon(102, 'General Journal');

        const isCreateAdjustment = gjItem.type === GenernalJournalItemType.ADJUSTMENT ? true : false;
        if (isCreateAdjustment) {
            const year = gjItem.month > 6 ? generalJournal.beginYear : generalJournal.beginYear + 1;
            gjItem.year = year;
            const transactionId = gjItem.transactionId;
            const transaction = await BusinessLoader.transactionBusiness.get(transactionId);
            if (!transaction || !transaction.coaId)
                throw new ErrorCommon(102, 'Transaction');
            gjItem.before = {};
            gjItem.before.coaId = transaction.coaId;
            gjItem.before.typeCrunch = transaction.typeCrunch;
        }
        if (gjItem.after && !gjItem.after.coaId)
            delete(gjItem.after.coaId);
        if (gjItem.before && !gjItem.before.coaId)
            delete(gjItem.before.coaId);

        const gjItemCreated = await this.generalJournalItemRepository.create(gjItem);
        if (isCreateAdjustment && gjItemCreated && gjItem.after && gjItem.after.typeCrunch)
            await BusinessLoader.transactionBusiness.applyAdJustment(gjItem.transactionId, gjItem.after.typeCrunch, gjItem.after.coaId);

        return gjItemCreated && new GeneralJournalItem(gjItemCreated);
    }

    async createGeneralJournalItems(gjItems:GeneralJournalItemCreate[]): Promise<GeneralJournalItem[]> {
        if (!Array.isArray(gjItems) || gjItems.length === 0)
            return [];

        const gjAdJustmentItems:GeneralJournalItemCreate[] = [];

        const gjId = gjItems[0].gjId;

        if (!gjId)
            throw new ErrorCommon(101, 'Request');

        gjItems.forEach(item => {
            if (gjId !== item.gjId)
                throw new ErrorCommon(101, 'Request');
            if (!this.validateGeneralJournalItem(item))
                throw new ErrorCommon(101, 'Request');
            if (item.type === GenernalJournalItemType.ADJUSTMENT)
                gjAdJustmentItems.push(item);
        });

        const generalJournal = await this.generalJournalRepository.get(gjId);
        if (!generalJournal)
            throw new ErrorCommon(104, 'General Journal');

        const transactions = gjAdJustmentItems.length > 0 ?
            await BusinessLoader.transactionBusiness.getTransactionByTransactionIds(gjAdJustmentItems.map(item => item.transactionId)) : [];
        for (let index = 0; index < gjItems.length; index++) {
            const item = gjItems[index];
            item.userId = generalJournal.userId;
            // const year = item.month > 6 ? generalJournal.year : generalJournal.year + 1;
            const year = generalJournal.beginYear;
            item.year = year;
            if (item.type === GenernalJournalItemType.ADJUSTMENT) {
                const transactionId = item.transactionId;
                const transaction = transactions.find(i => i._id.toString() === transactionId.toString());
                if (!transaction || !transaction.coaId)
                    throw new ErrorCommon(104, 'Transaction');
                item.before = {};
                item.before.coaId = transaction.coaId;
                item.before.typeCrunch = transaction.typeCrunch;
            }
        }
        this.filterGjItem(gjItems);
        const items = await this.generalJournalItemRepository.createMultiple(gjItems);
        const applyAdJustmentPromises: any[] = [];

        items.forEach(item => {
            if (item.type === GenernalJournalItemType.ADJUSTMENT && item.after && item.after.coaId)
                applyAdJustmentPromises.push(BusinessLoader.transactionBusiness.applyAdJustment(item.transactionId, item.after.typeCrunch, item.after.coaId));
        });
        await Promise.all(applyAdJustmentPromises);

        return GeneralJournalItem.parseArray(items);
    }

    filterGjItem(items:any[]) {
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            if (item.after && !item.after.coaId)
                delete(item.after.coaId);
            if (item.before && !item.before.coaId)
                delete(item.before.coaId);
        }
    }

    async moveClientInProduct(userId:string, productId: string): Promise<boolean> {
        await this.generalJournalRepository.findAndUpdateAll({userId}, {productId});
        return true;
    }

    async updateDateGeneralJournal(_id: string, month: number, year: number): Promise<any> {
        if (!_id || !month || !year)
            throw new ErrorCommon(104, 'data');
        let generalJournal = await this.getGeneralJournalById(_id);
        if (!generalJournal)
            throw new ErrorCommon(104, 'General Journal');

        const generalJournalItems = await this.generalJournalItemRepository.findAll({
            query: {
                gjId: DataHelper.toObjectId(_id)
            }
        });

        await this.updateGeneralJournal(_id, {month: month, beginYear: year, userId: generalJournal.userId, code: generalJournal.code, productId: generalJournal.productId, note: generalJournal.note});

        let newTransactionRollBack: any[] = [];
        let adjustmentTransactionRollBack: any[] = [];
        let isRollBack = false;

        for (let i = 0; i < generalJournalItems.length; i++) {
            let monthBefore: any = generalJournalItems[i].month;
            let yearBefore: any = generalJournalItems[i].year;
            let id: string = generalJournalItems[i]._id;
            let transactionId: string = generalJournalItems[i].transactionId;
            let extend: any = generalJournalItems[i].extend;
            let item: any = generalJournalItems[i];
            let beforeCoa: any = generalJournalItems[i].before ? generalJournalItems[i].before : undefined;
            if (beforeCoa) {
                delete item._id;
                delete item.deletedAt;
                delete item.createdAt;
                delete item.updatedAt;
                adjustmentTransactionRollBack.push(item);
                await this.generalJournalItemRepository.delete(id, true);
                let result = await BusinessLoader.transactionBusiness.applyAdJustment(transactionId, beforeCoa.typeCrunch, beforeCoa.coaId);
                if (!result) {
                    isRollBack = true;
                    break;
                }
            }
            else {
                newTransactionRollBack.push(this.updateDateGeneralJournalItem(id, {month: monthBefore, year: yearBefore, note: generalJournalItems[i].note, isIncludeTax: generalJournalItems[i].isIncludeTax, extend: {amount: generalJournalItems[i].extend && extend.amount, description: extend.description, isCredit: extend.isCredit}}));
                let result = await this.updateDateGeneralJournalItem(id, {month: month, year: year, note: generalJournalItems[i].note, isIncludeTax: generalJournalItems[i].isIncludeTax, extend: {amount: generalJournalItems[i].extend && extend.amount, description: extend.description, isCredit: extend.isCredit}});
                if (!result) {
                    isRollBack = true;
                    break;
                }
            }
        }
        if (isRollBack) {
            await Promise.all(newTransactionRollBack);
            await this.createGeneralJournalItems(adjustmentTransactionRollBack);
            for (let i = 0; i < adjustmentTransactionRollBack.length; i++) {
                await BusinessLoader.transactionBusiness.applyAdJustment(adjustmentTransactionRollBack[i].transactionId, adjustmentTransactionRollBack[i].after.typeCrunch, adjustmentTransactionRollBack[i].after.coaId);
            }
            return false;
        }
        else
            return true;
    }

    async updateGeneralJournal(_id:string, data :any): Promise<boolean> {
        const dataUpdate = new GeneralJournalUpdate(data);
        return await this.generalJournalRepository.update(_id, dataUpdate);
    }

    async updateGeneralJournalNote(_id:string, note :string): Promise<boolean> {
        return await this.generalJournalRepository.update(_id, {note});
    }

    async updateDateGeneralJournalItem(_id:string, data :any): Promise<boolean> {
        const dataUpdate = new GeneralJournalItemUpdate(data);
        return await this.generalJournalItemRepository.update(_id, dataUpdate);
    }

    async updateGeneralJournalItem(_id:string, data :any): Promise<any> {
        const gJItem = await this.generalJournalItemRepository.get(_id);
        if (!gJItem)
            return false;
        const gj = await this.generalJournalRepository.get(gJItem.gjId);
        if (!gj)
            return false;
        if (data.month) {
            const month = data.month;
            data.year = month > 6 ? gj.beginYear : gj.beginYear + 1;
        }
        let isUpdate = true;
        if (data.before && data.before.coaId && data.before.typeCrunch && gJItem.before && gJItem.before.coaId !== data.coaId && gJItem.type === GenernalJournalItemType.ADJUSTMENT && gJItem.transactionId)
            isUpdate = await BusinessLoader.transactionBusiness.applyAdJustment(gJItem.transactionId, data.before.typeCrunch, data.before.coaId);
        const dataUpdate = new GeneralJournalItemUpdate(data);
        if (dataUpdate.after && !dataUpdate.after.coaId)
            delete(dataUpdate.after.coaId);
        if (!isUpdate)
            return false;
        return await this.generalJournalItemRepository.update(_id, dataUpdate);
    }

    async updateEvidenced(_id:string, fileCreate:any): Promise<boolean> {
        const generalJournalItem = await this.getGeneralJournalItemById(_id);
        if (!generalJournalItem)
            return false;

        const productId = generalJournalItem.userId && generalJournalItem.userId.permission && generalJournalItem.userId.permission.product ? generalJournalItem.userId.permission.product : null;
        if (!productId)
            return false;
        const product = await BusinessLoader.productBusiness.get(productId);
        if (!product)
            return false;
        let prefix = GoogleStorageHelper.getEvidencedPrefix(generalJournalItem.userId, product.code, generalJournalItem.year.toString(), generalJournalItem.month);
        fileCreate.prefix = prefix;
        fileCreate.userId = generalJournalItem.userId._id;
        fileCreate.productCode = product.code;
        const file = await BusinessLoader.fileBusiness.create(fileCreate);

        if (!file)
            return false;
        return await this.generalJournalItemRepository.update(_id, {evidenced: file._id});
    }

    async deleteGeneralJournal(userId:string, _id:string):Promise<boolean> {
        const userAdmin = await BusinessLoader.userBusiness.get(userId);
        if (!userAdmin || !userAdmin.permission || !userAdmin.permission.role)
            throw new ErrorCommon(101, 'Request');
        const role = await BusinessLoader.roleBusiness.get(userAdmin.permission.role);
        if (!role || role.code !== RoleCode.SuperAdmin)
            throw new ErrorCommon(101, 'Request');
        await this.generalJournalRepository.delete(_id);
        const gjItems = await this.generalJournalItemRepository.findAll({query: <any>{gjId: DataHelper.toObjectId(_id)}});
        const promiseDelete:any[] = [];
        gjItems.forEach(item => {
            promiseDelete.push(this.deleteGeneralJournalItem( '', item._id));
        });
        await Promise.all(promiseDelete);
        return true;
    }

    async deleteGeneralJournalItem(userId:string, _id:string):Promise<boolean> {
        if (userId) {
            const userAdmin = await BusinessLoader.userBusiness.get(userId);
            if (!userAdmin || !userAdmin.permission || !userAdmin.permission.role)
                throw new ErrorCommon(101, 'Request');
            const role = await BusinessLoader.roleBusiness.get(userAdmin.permission.role);
            if (!role || role.code !== RoleCode.SuperAdmin)
                throw new ErrorCommon(101, 'Request');
        }
        const gjItem = await this.generalJournalItemRepository.get(_id);
        if (!gjItem)
            throw new ErrorCommon(104, 'General Journal Item');
        if (gjItem.transactionId
            && gjItem.before
            && gjItem.before.coaId
            && gjItem.before.typeCrunch
            && !await BusinessLoader.transactionBusiness.applyAdJustment(gjItem.transactionId, gjItem.before.typeCrunch, gjItem.before.coaId))
            return false;

        return await this.generalJournalItemRepository.delete(_id);
    }

    async deleteGeneralJournalItemByAdmin(userId:string, _id:string):Promise<boolean> {
        const userAdmin = await BusinessLoader.userBusiness.get(userId);
        if (!userAdmin || !userAdmin.permission || !userAdmin.permission.role)
            throw new ErrorCommon(101, 'Request');
        const role = await BusinessLoader.roleBusiness.get(userAdmin.permission.role);
        if (!role || role.code !== RoleCode.SuperAdmin)
            throw new ErrorCommon(101, 'Request');
        return this.deleteGeneralJournalItem('', _id);
    }
}

Object.seal(GeneralJournalBusiness);
export default GeneralJournalBusiness;
