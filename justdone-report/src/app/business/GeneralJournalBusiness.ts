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
import Transaction from 'justdone-system-package/dest/app/model/transaction/Transaction';// eslint-disable-line
import {GenernalJournalItemType, CrunchType} from 'justdone-system-package/dest/app/model/common/CommonType';

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

    async getGeneralJournalMinCreatedAt(userId: string): Promise<GeneralJournalItem[]> {
        if (!userId)
            return [];

        let param = {
            query: <any>{
                userId: DataHelper.toObjectId(userId),
                type: GenernalJournalItemType.NEWTRANSACTION,
                deletedAt: null
            },
        };

        let generalJournalItems = await this.generalJournalItemRepository.find(param, {createdAt: 1}, 1, 1);
        return GeneralJournalItem.parseArray(generalJournalItems);
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

    async getGeneralJournal(userId:string, beginYear: number, page: number, limit:number):Promise<any[]> {
        const params = {
            query: {
                userId,
                beginYear
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

        return GeneralJournal.parseArray(generalJournals).map(item => {
            const gjTotalItem = gjTotal.find(gjItem => gjItem._id.toString() === item._id.toString());
            const totalTransactions = gjTotalItem && gjTotalItem.total ? gjTotalItem.total : 0;
            return {...item, totalTransactions};
        });
    }

    async getGeneralJournalTotal(userId:string, beginYear: number):Promise<number> {
        const params = {
            query: {
                userId,
                beginYear
            }
        };
        return await this.generalJournalRepository.getCount(params);
    }

    async getNewTransactionGJByTime(userId: string, beginMonth:number, beginYear: number, endMonth: number, endYear: number):Promise<Transaction[]> {
        console.log(beginMonth, beginYear, endMonth, endYear);
        if (!this.checkValidateTimeQuery(beginMonth, beginYear, endMonth, endYear))
            return [];

        const comonParams = {userId, type: GenernalJournalItemType.NEWTRANSACTION};
        const statementWhenNotSameYear = {$or: [{...comonParams, year: beginYear, month: {$gte: beginMonth}}, {...comonParams, year: endYear, month: {$lte: endMonth}}]};
        const query = beginYear === endYear ? {...comonParams, year: beginYear, month: {$gte: beginMonth, $lte: endMonth}} : statementWhenNotSameYear;
        const populate = [{
            path: 'before.coaId',
            select: 'name code gstType'
        }, {
            path: 'after.coaId',
            select: 'name code gstType'
        }];
        const gjItems = await this.generalJournalItemRepository.findAll({query, populate});
        return this.convertGJTransaction(GeneralJournalItem.parseArray(gjItems));
    }

    async getNewTransactionBalanceSheetByTime(userId: string, month: number, year: number):Promise<any> {
        if (!month)
            return [];
        if (!year)
            return [];
        if (!userId)
            return [];
        let dataGeneralJournalMinCreatedAt = await this.getGeneralJournalMinCreatedAt(userId);
        if (!dataGeneralJournalMinCreatedAt || !dataGeneralJournalMinCreatedAt.length)
            return [];

        let endYear = year;
        let endMonth = month;
        let beginYear = dataGeneralJournalMinCreatedAt[0].year;
        let beginMonth = dataGeneralJournalMinCreatedAt[0].month;

        const comonParams = {userId, type: GenernalJournalItemType.NEWTRANSACTION, year: { $ne: 0 }};
        const statementWhenNotSameYear = {$or: [{...comonParams, year: beginYear, month: {$gte: beginMonth}}, {...comonParams, year: endYear, month: {$lte: endMonth}}]};
        const query = beginYear === endYear ? {...comonParams, year: beginYear, month: {$gte: beginMonth, $lte: endMonth}} : statementWhenNotSameYear;
        const populate = [{
            path: 'before.coaId',
            select: 'name code gstType'
        }, {
            path: 'after.coaId',
            select: 'name code gstType'
        }];
        const gjItems = await this.generalJournalItemRepository.findAll({query, populate});
        return this.convertGJTransaction(GeneralJournalItem.parseArray(gjItems));
    }

    convertGJTransaction(gjItems:GeneralJournalItem[]):any[] {
        const gjItemList = gjItems.filter(item => {
            return item && item.type === GenernalJournalItemType.NEWTRANSACTION && item.extend && item.after && (item.after.coaId || item.after.typeCrunch);
        });

        return gjItemList.map(item => {
            const transaction: any = {};
            if (item.extend) {
                transaction.baseType = item.extend.isCredit ? 'CREDIT' : 'DEBIT';
                transaction.amount = {amount: item.extend.amount, currency: 'AUD'};
                if (item.after) {
                    if (item.after.coaId) {
                        transaction.coaId = item.after.coaId;
                        transaction.typeCrunch = item.after.typeCrunch ? item.after.typeCrunch : CrunchType.Expenses;
                    }
                    else {
                        transaction.typeCrunch = item.after.typeCrunch;
                    }
                }

                transaction.description = {original: item.extend.description};
                transaction.month = item.month;
                transaction.year = item.year;
                transaction.date = new Date(item.year, item.month - 1, 1);
                transaction.status = 'POSTED';
                transaction.postDate = new Date(item.year, item.month - 1, 1);
            }
            return transaction;
        });
    }

    checkValidateTimeQuery(beginMonth: number, beginYear: number, endMonth: number, endYear: number) {
        if (beginYear > endYear)
            return false;
        if (beginYear === endYear && beginMonth > endMonth)
            return false;
        if (beginYear < endYear) {
            if (beginYear < endYear - 1)
                return false;
            if ( endMonth > 6 || beginMonth < 7)
                return false;
        }
        return true;
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
    async getGeneralJournalItem(gjId: string, page: number, limit:number):Promise<GeneralJournalItem[]> {
        const params = {
            query: {
                gjId
            },
            populate: [{
                path: 'transactionId',
                select: 'description transactionId'
            }, {
                path: 'coaId',
                select: 'code name'
            }, {
                path: 'evidenced',
                select: 'url'
            }]
        };
        const generalJournalItems = await this.generalJournalItemRepository.find(params, null, page, limit);
        return GeneralJournalItem.parseArray(generalJournalItems);
    }

    async getGeneralJournalItemById(_id:string): Promise<GeneralJournalItem | null> {
        const populate = [{
            path: 'userId',
            select: 'permission'
        }];
        const generalJournal = await this.generalJournalItemRepository.get(_id, populate);
        return generalJournal && new GeneralJournalItem(generalJournal);
    }

    async getGeneralJournalItemsByYear(userId:string, beginYear:number):Promise<GeneralJournalItem[]> {
        const gjItems = await this.generalJournalItemRepository.findAll({userId, beginYear});
        return GeneralJournalItem.parseArray(gjItems);
    }

    async updateGeneralJournal(_id:string, data :any): Promise<boolean> {
        const dataUpdate = new GeneralJournalUpdate(data);
        return await this.generalJournalRepository.update(_id, dataUpdate);
    }

    async deleteGeneralJournal(_id:string):Promise<boolean> {
        return await this.generalJournalRepository.delete(_id);
    }

    async deleteGeneralJournalItem(_id:string):Promise<boolean> {
        return await this.generalJournalItemRepository.delete(_id);
    }
}

Object.seal(GeneralJournalBusiness);
export default GeneralJournalBusiness;
