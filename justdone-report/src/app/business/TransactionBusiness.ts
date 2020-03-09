import * as fs from 'fs'; // eslint-disable-line
import {BankType, CrunchType} from 'justdone-system-package/dest/app/model/common/CommonType'; // eslint-disable-line
import TransactionCreate from 'justdone-system-package/dest/app/model/transaction/TransactionCreate'; // eslint-disable-line
import Transaction from 'justdone-system-package/dest/app/model/transaction/Transaction'; // eslint-disable-line
// import ChartAccount from 'justdone-system-package/dest/app/model/chartAccount/ChartAccount'; // eslint-disable-line
import TransactionRepository from 'justdone-system-package/dest/app/repository/TransactionRepository';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import ITransactionBusiness from './interfaces/ITransactionBusiness'; // eslint-disable-line
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import AuthorizationHelper from 'justdone-system-package/dest/helpers/AuthorizationHelper';
import module from 'justdone-system-package/dest/resources/permission/module';
import BusinessLoader from '../../system/BusinessLoader';

class TransactionBusiness implements ITransactionBusiness {
    private transactionRepository: TransactionRepository;

    constructor() {
        this.transactionRepository = new TransactionRepository();
    }

    // async getTransactionAccordingYearAndMonth(userId: string, startYear: number, startMonth: number, endYear: number, endMonth: number): Promise<any> {
    //     const transactionQuery = [{
    //         $addFields: {
    //             'dateSelect': {
    //                 '$dateFromParts': {
    //                     'year': '$year',
    //                     'month': '$month'
    //                 }
    //             }
    //         }
    //     },
    //     {
    //         $match: {
    //             'dateSelect': {
    //                 '$lte': new Date(endYear + '-' + endMonth + '-' + '01'),
    //                 '$gte': new Date(startYear + '-' + startMonth + '-' + '01')
    //             },
    //             'userId': DataHelper.toObjectId(userId)
    //         }
    //     }, {
    //         $lookup: {
    //             from: 'chartaccounts',
    //             localField: 'coaId',
    //             foreignField: '_id',
    //             as: 'coa'
    //         }
    //     }
    //     ];

    //     let result = await this.transactionRepository.aggregate(transactionQuery);
    //     return result;
    // }

    async getTransactionForBalanceSheetReport(userId: string, beginYear: number, beginMonth: number, endYear: number, monthEnd: number): Promise<any> {
        let endMonth: string;
        let startMonth: string;

        if (beginMonth < 10)
            startMonth = '0' + beginMonth;
        else
            startMonth = String(beginMonth);

        if (monthEnd < 10)
            endMonth = '0' + monthEnd;
        else
            endMonth = String(monthEnd);

        const transactionQuery = [{
            $addFields: {
                'dateSelect': {
                    '$dateFromParts': {
                        'year': '$year',
                        'month': '$month'
                    }
                }
            }
        },
        {
            $match: {
                'dateSelect': {
                    '$gte': new Date(String(beginYear) + '-' + startMonth + '-' + '01'),
                    '$lte': new Date(String(endYear) + '-' + endMonth + '-' + '01')
                },
                'userId': DataHelper.toObjectId(userId)
            }
        }, {
            $lookup: {
                from: 'chartaccounts',
                localField: 'coaId',
                foreignField: '_id',
                as: 'coa'
            }
        }
        ];

        let result = await this.transactionRepository.aggregate(transactionQuery);
        return result;
    }

    // async groupByTransactionCrunchTypeExpensesForBalanceSheetReport(userId: string, year: number, month: number): Promise<any> {
    //     let endMonth: string;
    //     if (month < 10)
    //         endMonth = '0' + month;
    //     else
    //         endMonth = String(month);

    //     const transactionQuery = [{
    //         $addFields: {
    //             'dateSelect': {
    //                 '$dateFromParts': {
    //                     'year': '$year',
    //                     'month': '$month'
    //                 }
    //             }
    //         }
    //     },
    //     {
    //         $match: {
    //             'dateSelect': {
    //                 '$lte': new Date(String(year) + '-' + endMonth + '-' + '01')
    //             },
    //             'typeCrunch': 1,
    //             'userId': DataHelper.toObjectId(userId)
    //         }
    //     }, {
    //         $lookup: {
    //             from: 'chartaccounts',
    //             localField: 'coaId',
    //             foreignField: '_id',
    //             as: 'coa'
    //         }
    //     },
    //     {
    //         $group: {_id: '$coa._id', amount: {$sum: '$amount.amount'}}
    //     }
    //     ];

    //     let result = await this.transactionRepository.aggregate(transactionQuery);
    //     return result;
    // }

    // async groupByTransactionCrunchTypeDrawingsForBalanceSheetReport(userId: string, year: number, month: number): Promise<any> {
    //     let endMonth: string;
    //     if (month < 10)
    //         endMonth = '0' + month;
    //     else
    //         endMonth = String(month);
    //     const transactionQuery = [{
    //         $addFields: {
    //             'dateSelect': {
    //                 '$dateFromParts': {
    //                     'year': '$year',
    //                     'month': '$month'
    //                 }
    //             }
    //         }
    //     },
    //     {
    //         $match: {
    //             'dateSelect': {
    //                 '$lte': new Date(String(year) + '-' + endMonth + '-' + '01')
    //             },
    //             'typeCrunch': 2,
    //             'userId': DataHelper.toObjectId(userId)
    //         }
    //     }, {
    //         $lookup: {
    //             from: 'chartaccounts',
    //             localField: 'coaId',
    //             foreignField: '_id',
    //             as: 'coa'
    //         }
    //     },
    //     {
    //         $group: {_id: null, amount: {$sum: '$amount.amount'}}
    //     }
    //     ];

    //     let result = await this.transactionRepository.aggregate(transactionQuery);
    //     return result;
    // }

    async getAllTransaction(userId: string, accountId: string, type: number, year: number, month: number): Promise<Transaction[]> {
        let body = {
            query: {
                userId: DataHelper.toObjectId(userId),
                type: type,
                year: year,
                month: month,
                accountId: accountId
            },
            populate: {
                path: 'coaId',
                select: 'name code gstType'
            }
        };

        let transactions = await this.transactionRepository.findAll(body);
        return Transaction.parseArray(transactions);
    }

    async getTransactionByMonths(userId: string, accountId: string, type: number, timeQuery:{year:number, months:number[]}[]): Promise<Transaction[]> {
        let body = {
            query: {
                userId: DataHelper.toObjectId(userId),
                type: type,
                accountId: accountId,
                $or: timeQuery.map(item => {
                    return {
                        year: item.year,
                        month: {
                            $in: item.months
                        }
                    };
                })
            },
            populate: {
                path: 'coaId',
                select: 'name code gstType'
            }
        };

        let transactions = await this.transactionRepository.findAll(body);
        return Transaction.parseArray(transactions);
    }

    async getTransactionByCrunchesTime(userId: string, accountId: string, timeQuery:{year: number, months: number[], type: number}[]): Promise<Transaction[]> {
        if (timeQuery.length <= 0)
            return [];
        const params = {
            query: {
                userId: DataHelper.toObjectId(userId),
                accountId: accountId,
                $or: timeQuery.map(item => ({
                    year: item.year,
                    month: {
                        $in: item.months
                    },
                    type: item.type
                }))
            },
            populate: {
                path: 'coaId',
                select: 'name code gstType'
            }
        };

        let transactions = await this.transactionRepository.findAll(params);
        return Transaction.parseArray(transactions);
    }

    async getTransactionManyBankByCrunchesTime(userId: string, accountIds: string[], timeQuery:{year: number, months: number[], type: number}[]): Promise<Transaction[]> {
        if (timeQuery.length <= 0)
            return [];
        const params = {
            query: {
                userId: DataHelper.toObjectId(userId),
                accountId: {$in: accountIds},
                $or: timeQuery.map(item => ({
                    year: item.year,
                    month: {
                        $in: item.months
                    },
                    type: item.type
                }))
            },
            populate: {
                path: 'coaId',
                select: 'name code gstType'
            }
        };

        let transactions = await this.transactionRepository.findAll(params);
        return Transaction.parseArray(transactions);
    }

    async getTransactions(clientId: string, accountId: string, type: number, month: number, year: number): Promise<Transaction[]> {
        let params = {
            query: {
                userId: DataHelper.toObjectId(clientId),
                type: type,
                year: year,
                month: month,
                accountId: accountId,
            },
            populate: {
                path: 'coaId',
                select: '_id name code gstType'
            }
        };

        let transactions = await this.transactionRepository.find(params, {date: -1, index: -1});
        return Transaction.parseArray(transactions);
    };

    async getTransactionsByTime(clientId: string, accountId: string, beginMonth: number, beginYear: number, endMonth: number): Promise<Transaction[]> {
        let params = {
            query: {
                userId: DataHelper.toObjectId(clientId),
                accountId: accountId,
                $or: [{
                    month: {$gte: beginMonth},
                    year: beginYear
                }, {
                    month: {$lte: endMonth},
                    year: beginYear + 1
                }]
            },
            populate: {
                path: 'coaId',
                select: '_id name code gstType'
            }
        };

        let transactions = await this.transactionRepository.findAll(params, {date: -1, index: -1});
        return Transaction.parseArray(transactions);
    };

    async getTransactionForReport(userId: string, accountId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<any[]> {
        const crunchesFinalYear = await BusinessLoader.crunchBusiness.getCrunchsFinish(userId, beginMonth, beginYear, endMonth, endYear);
        const crunchesTimeQuery:{year:number, type: number, months:number[]}[] = [];
        crunchesFinalYear.forEach(crunch => {
            const queryItemIndex = crunchesTimeQuery.findIndex(item => item.year === crunch.year && item.type === crunch.type);
            if (queryItemIndex < 0)
                crunchesTimeQuery.push({year: crunch.year, type: crunch.type, months: [crunch.month]});
            else
                crunchesTimeQuery[queryItemIndex].months.push(crunch.month);
        });
        return await this.getTransactionByCrunchesTime(userId, accountId, crunchesTimeQuery);
    }

    async getTransactionManyBankForReport(userId: string, accountIds: string[], beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<any[]> {
        const crunchesFinalYear = await BusinessLoader.crunchBusiness.getCrunchsFinish(userId, beginMonth, beginYear, endMonth, endYear);
        const crunchesTimeQuery:{year:number, type: number, months:number[]}[] = [];
        crunchesFinalYear.forEach(crunch => {
            const queryItemIndex = crunchesTimeQuery.findIndex(item => item.year === crunch.year && item.type === crunch.type);
            if (queryItemIndex < 0)
                crunchesTimeQuery.push({year: crunch.year, type: crunch.type, months: [crunch.month]});
            else
                crunchesTimeQuery[queryItemIndex].months.push(crunch.month);
        });
        return await this.getTransactionManyBankByCrunchesTime(userId, accountIds, crunchesTimeQuery);
    }

    async aggregateTransactionByCoa(userId:string, accountId:string, beginMonth: number, beginYear:number, endMonth:number, endYear: number):Promise<any> {
        let query:any = {
            userId: DataHelper.toObjectId(userId),
            accountId: accountId
        };
        if (beginYear === endYear) {
            if (beginMonth <= endMonth) {
                query = {
                    ...query,
                    year: beginYear,
                    $and: [{month: {$gte: beginMonth}}, {month: {$lte: endMonth}}]
                };
            }
            else {
                return [];
            }
        }
        if (beginYear > endYear) {
            return [];
        }

        if (beginYear < endYear) {
            query = {
                ...query,
                $or: [
                    {month: {$lte: beginMonth}, year: beginYear},
                    {month: {$gte: endMonth}, year: endYear}
                ]};
        }

        /*
        [
   {$match:{
    userId:ObjectId("5bb709698548eb19fdfec4cf"),
    month:10,
    year:2018
    }},
    {
        $group:{
            _id:{
                coaId:"$coaId",baseType:"$baseType"
            },
            totalAmount:{$sum:"$amount.amount"}
    }
    },
    {
        $project:{
                coaId:"$_id.coaId",
                totalAmount:1,
                baseType:"$_id.baseType"
            }
    },{
        $lookup:{
                from: "chartaccounts",
                localField: "coaId",
                foreignField: "_id",
                as: "coa"
            }

        },{
            $unwind:"$coa"
            }
]
        */

        let params = [{$match: query}];
        return await this.transactionRepository.aggregate(params);
    }

    async getTransactionByFinalYear(userId:string, accountId:string, beginMonth: number, beginYear:number, endMonth:number, endYear: number):Promise<Transaction[]> {
        let query:any = {
            userId: DataHelper.toObjectId(userId),
            accountId: accountId
        };
        if (beginYear === endYear) {
            if (beginMonth <= endMonth) {
                query = {
                    ...query,
                    year: beginYear,
                    $and: [{month: {$gte: beginMonth}}, {month: {$lte: endMonth}}]
                };
            }
            else {
                return [];
            }
        }
        if (beginYear > endYear) {
            return [];
        }

        if (beginYear < endYear) {
            query = {
                ...query,
                $or: [
                    {month: {$gte: beginMonth}, year: beginYear},
                    {month: {$lte: endMonth}, year: endYear}
                ]};
        }
        let body = {
            query: query,
            populate: {
                path: 'coaId',
                select: 'name code gstType'
            }
        };
        console.log(JSON.stringify(query));
        let transactions = await this.transactionRepository.findAll(body);
        return Transaction.parseArray(transactions);
    }
    async totalAmountTransactionCruch(originId: string, clientId: string, accountId: string, type: number, baseType: string, year: number, month: number): Promise<number> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        if (!accountId)
            throw new ErrorCommon(101, 'accountId');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return 0;

        let targetUser: any = await AuthorizationHelper.userService.get(clientId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return 0;

        let result: { totalAmount: number }[] = await this.transactionRepository.aggregate([{
            $match: {'userId': DataHelper.toObjectId(clientId)}
        }, {
            $match: {'type': {$eq: type}}
        }, {
            $match: {'accountId': accountId}
        }, {
            $match: {'month': {$eq: month}}
        }, {
            $match: {'year': {$eq: year}}
        }, {
            $match: {
                $and: [{
                    'typeCrunch': {$exists: true}
                }, {
                    'typeCrunch': {$ne: null}
                }]
            }
        }, {
            $match: {'baseType': {$eq: baseType}}
        }, {
            $group: {_id: null, totalAmount: {$sum: '$amount.amount'}}
        }, {
            $project: {_id: 0, totalAmount: 1}
        }]);
        return result.length ? result[0].totalAmount : 0;
    }

    async totalAmountTransactionChartAccount(originId: string, clientId: string, accountId: string, type: number, year: number, month: number): Promise<{ userId: string, coaId: string, baseType: string, amount: any }[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        if (!accountId)
            throw new ErrorCommon(101, 'accountId');

        let products = await Authenticator.filterProductsPermission([module.TRANSACTION.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];

        let targetUser: any = await AuthorizationHelper.userService.get(clientId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return [];

        let result: { userId: string, coaId: string, baseType: string, amount: any }[] = await this.transactionRepository.aggregate([{
            $match: {'userId': DataHelper.toObjectId(clientId)}
        }, {
            $match: {'type': type}
        }, {
            $match: {'accountId': accountId}
        }, {
            $match: {'month': {$eq: month}}
        }, {
            $match: {'year': {$eq: year}}
        }, {
            $match: {
                $and: [{
                    'coaId': {$exists: true}
                }, {
                    'coaId': {$ne: null}
                }]
            }
        }, {
            $match: {
                $and: [{
                    'typeCrunch': {$exists: true}
                }, {
                    'typeCrunch': {$ne: null}
                }]
            }
        }, {
            $project: {'userId': 1, 'coaId': 1, 'baseType': 1, 'amount': 1}
        }]);
        return result.length ? result : [];
    }
}

Object.seal(TransactionBusiness);
export default TransactionBusiness;
