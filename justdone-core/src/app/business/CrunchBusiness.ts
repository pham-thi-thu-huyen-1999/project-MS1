import * as moment from 'moment';
import Project from './../../config/Project';
import BusinessLoader from '../../system/BusinessLoader';// eslint-disable-line
import ICrunchBusiness from './interfaces/ICrunchBusiness'; // eslint-disable-line
import CrunchRepository from 'justdone-system-package/dest/app/repository/CrunchRepository';
import Crunch from 'justdone-system-package/dest/app/model/crunch/Crunch';// eslint-disable-line
import CrunchCreate from 'justdone-system-package/dest/app/model/crunch/CrunchCreate';// eslint-disable-line
import CrunchStatus from 'justdone-system-package/dest/app/model/crunch/CrunchStatus';
import CrunchFilterRepository from 'justdone-system-package/dest/app/repository/CrunchFilterRepository';
import CrunchFilter from 'justdone-system-package/dest/app/model/crunchFilter/CrunchFilter';// eslint-disable-line
import CrunchFilterCreate from 'justdone-system-package/dest/app/model/crunchFilter/CrunchFilterCreate';// eslint-disable-line
import {ProductCode, RoleCode} from 'justdone-system-package/dest/app/model/common/CommonType';// eslint-disable-line
import User from 'justdone-system-package/dest/app/model/user/User';
import Pagination from 'justdone-system-package/dest/app/model/common/Pagination';
import {CrunchType} from 'justdone-system-package/dest/app/model/common/CommonType'; // eslint-disable-line
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import module from 'justdone-system-package/dest/resources/permission/module';
import LogHelper from 'justdone-system-package/dest/helpers/LogHelper';
import AuthorizationHelper from 'justdone-system-package/dest/helpers/AuthorizationHelper';

class CrunchBusiness implements ICrunchBusiness {
    private crunchRepository: CrunchRepository;
    private crunchFilterRepository: CrunchFilterRepository;

    constructor() {
        this.crunchRepository = new CrunchRepository();
        this.crunchFilterRepository = new CrunchFilterRepository();
    }

    async getByEmail(email: string): Promise<any> {
        let user = await BusinessLoader.userBusiness.getByEmail(email.trim().toLowerCase());
        if (user) {
            let params = {
                query: <any>{
                    userId: DataHelper.toObjectId(user._id)
                }
            };
            return await this.crunchRepository.findAll(params);
        }
        return [];
    }

    async getByUserId(userId: string): Promise<any> {
        if (!userId)
            return [];
        let params = {
            query: <any>{
                userId: DataHelper.toObjectId(userId)
            }
        };
        return await this.crunchRepository.findAll(params);
    }

    async getCrunchs(originId: string, targetId: string, type: number, beginYear: number): Promise<Crunch[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.CRUNCHER.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];

        let params = {query: {}};
        let endYear = beginYear + 1;

        let user = await BusinessLoader.userBusiness.get(targetId);
        if (!user || !user.permission)
            throw new ErrorCommon(101, 'Request');
        let product = await BusinessLoader.productBusiness.get(user.permission.product);
        let proCode = product && product.code;

        if (!product || ! products.find(item => item.code === proCode))
            throw new ErrorCommon(101, 'Request');

        if (endYear <= beginYear || endYear > beginYear + 1)
            throw new ErrorCommon(203, 'statement_end_year', 'begin_year');

        params.query = {
            userId: DataHelper.toObjectId(targetId),
            type: type,
            $or: [{
                month: {
                    $gte: product.config.financialYear.beginMonth
                },
                year: {
                    $eq: beginYear
                }
            }, {
                month: {
                    $lte: product.config.financialYear.endMonth
                },
                year: {
                    $eq: endYear
                }
            }],
        };
        let crunchs = await this.crunchRepository.findAll(params, {createdAt: 1});
        return crunchs;
    }

    async getFinalYearCrunchs(userId: string, accountId: string, type: number, beginYear: number): Promise<Crunch[]> {
        let params = {query: {}};
        let endYear = beginYear + 1;

        let user = await BusinessLoader.userBusiness.get(userId);
        if (!user || !user.permission)
            throw new ErrorCommon(101, 'Request');
        let product = await BusinessLoader.productBusiness.get(user.permission.product);

        if (!product)
            throw new ErrorCommon(101, 'Request');

        if (endYear <= beginYear || endYear > beginYear + 1)
            throw new ErrorCommon(203, 'statement_end_year', 'begin_year');

        params.query = {
            userId: DataHelper.toObjectId(userId),
            type: type,
            accountId: accountId,
            $or: [{
                month: {
                    $gte: product.config.financialYear.beginMonth
                },
                year: {
                    $eq: beginYear
                }
            }, {
                month: {
                    $lte: product.config.financialYear.endMonth
                },
                year: {
                    $eq: endYear
                }
            }],
        };
        let crunchs = await this.crunchRepository.findAll(params, {createdAt: 1});
        return crunchs;
    }

    async getTotalIncome(originId: string): Promise<{total: number}> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.CRUNCHER.claim.GET.code], originId, []);
        if (!products || !products.length)
            return {total: 0};

        let params = [{
            $group: {
                _id: null,
                total: {$sum: '$income'}
            }
        }];
        let result = await this.crunchRepository.aggregate(params);
        let obj = {total: result[0].total};
        return obj;
    }

    async getSixMonthCrunchs(originId: string, userIds: any[]): Promise<Crunch[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.CRUNCHER.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];

        let nowDay = moment().subtract(1, 'month');
        let nowMonth = parseInt(nowDay.format('M'));
        userIds = userIds.map(userId => DataHelper.toObjectId(userId));
        let nowYear = parseInt(nowDay.format('YYYY'));
        let params = {query: {}};
        if (nowMonth > 6)
            params.query = {
                userId: {$in: userIds},
                month: {
                    $lte: nowMonth,
                    $gte: nowMonth - 5
                },
                year: nowYear
            };
        else {
            let beginMonth = 6 + nowMonth;
            params.query = {
                userId: {$in: userIds},
                $or: [{
                    month: {
                        $gt: beginMonth
                    },
                    year: {
                        $eq: nowYear - 1
                    }
                }, {
                    month: {
                        $lte: nowMonth
                    },
                    year: {
                        $eq: nowYear
                    }
                }]
            };
        }

        let crunchs = await this.crunchRepository.findAll(params);
        return crunchs;
    }

    async getStatusCrunch(originId: string, userIds: string[]): Promise<{ userId: string, status: CrunchStatus | undefined, details: CrunchStatus[] }[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.CRUNCHER.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];

        let userCrunchs = await this.getSixMonthCrunchs(originId, userIds);
        let crunchs: { userId: string, crunchs: Crunch[] }[] = [];

        userIds.forEach(userId => {
            let item = userCrunchs.filter(crunch => {
                return crunch.userId.toString() === userId.toString();
            });
            crunchs.push({userId: userId, crunchs: item});
        });

        // userCrunchs.forEach(userCrunch => {
        //     let index = crunchs.findIndex(c => {
        //         console.log(userCrunch.userId.toString(), c.userId.toString());
        //         return c.userId.toString() === userCrunch.userId.toString();
        //     });
        //     console.log(index);
        //     if (index === -1)
        //         crunchs.push({userId: userCrunch.userId, crunchs: [userCrunch]});
        //     else
        //         crunchs[index].crunchs.push(userCrunch);
        // });// comment code doan a boi den
        let nowDay = moment().subtract(1, 'month');
        let nowMonth = parseInt(nowDay.format('M'));
        let nowYear = parseInt(nowDay.format('YYYY'));
        let beginYear = nowYear;
        let beginMonth = 1;
        if (nowMonth > 6) {
            beginMonth = nowMonth - 5; ;
        }
        else {
            beginMonth = 6 + nowMonth;
            beginYear = nowYear - 1;
        }

        let userStatus = crunchs.map(userCrunch => {
            let status: CrunchStatus | undefined;
            let details: CrunchStatus[] = [];

            for (let i = 0; i < userCrunch.crunchs.length; i++) {
                let crunch = userCrunch.crunchs[0];
                let overDay = caculatorOverdue(crunch.month, crunch.year);
                let detail = new CrunchStatus(crunch);

                if (!crunch.completedAt)
                    detail.overdue = overDay;
                details.push(detail);

                if (!status)
                    status = detail;
                // else {
                //     if (status.completedAt && compareTime(status, crunch))
                //         status = detail;
                //     if (!detail.completedAt && compareTime(status, crunch))
                //         status = detail;
                // }
            }

            for (let year = beginYear; year <= nowYear; year++) {
                if (year !== beginYear)
                    beginMonth = 1;
                for (let month = beginMonth; month <= 12; month++) {
                    for (let typeBank = 1; typeBank < 3; typeBank++) {
                        let monthDetail = details.find(item => item.month === month && item.type === typeBank && item.year === year);
                        if (!monthDetail) {
                            let crunchStatus = new CrunchStatus({month: month, year: year, isNoTransaction: true, type: typeBank});
                            details.push(crunchStatus);
                        }
                    }
                    if (month === nowMonth && year === nowYear)
                        break;
                }
            }

            return {userId: userCrunch.userId, status: status, details: details};
        });

        return userStatus;
    }

    async getCrunchsByTime(managerId: string, userIds: any[], accountIds: any[], endYear: number, endMonth: number): Promise<Crunch[]> {
        // if (!managerId)
        //     throw new ErrorCommon(101, 'Request');
        // let products = await Authenticator.filterProductsPermission([module.CRUNCHER.claim.GET.code], managerId, []);
        // if (!products || !products.length)
        //     return [];

        let beginMonth = 7;
        let beginYear = endYear;
        if (endMonth < 7)
            beginYear = endYear - 1;

        let params: any = {};
        params.query = {
            completedAt: {$exists: true, $ne: null},
            userId: {$in: userIds},
            accountId: {$in: accountIds},
            $or: [{
                month: {
                    $gte: beginMonth
                },
                year: {
                    $eq: beginYear
                }
            }, {
                month: {
                    $lte: endMonth
                },
                year: {
                    $eq: endYear
                }
            }]
        };

        params.populate = [{
            path: 'coaAmounts.coaId',
            select: 'name code',
        }];

        let crunches = await this.crunchRepository.findAll(params, {year: 1, month: 1});
        if (!crunches.length)
            return [];

        let coaIds: string[] = [];
        crunches.forEach(crunch => {
            crunch.coaAmounts.forEach(coa => {
                coa.amount = parseFloat(coa.amount).toFixed(2);
                coa.amount = parseFloat(coa.amount);
                if (coa.coaId && coa.coaId._id && !coaIds.includes(coa.coaId._id))
                    coaIds.push(coa.coaId._id);
            });
        });

        let unGroupExpense = {
            _id: '6969696969696969696969696969',
            order: -696969,
            code: 696969,
            name: 'Ungroup Expense',
            coas: []
        };

        let results = <any[]>[];
        let groups = await BusinessLoader.groupExpenseBusiness.getGroupsByChartAccounts(managerId, coaIds);

        if (groups.length) {
            for (let i = 0; i < crunches.length; i++) {
                for (let j = 0; j < crunches[i].coaAmounts.length; j++) {
                    let isNotInGroup = true;
                    for (let y = 0; y < groups.length; y++) {
                        if (crunches[i].coaAmounts[j].coaId && crunches[i].coaAmounts[j].coaId._id) {
                            if (groups[y].coas.find(coaId => coaId.toString() === crunches[i].coaAmounts[j].coaId._id.toString())) {
                                isNotInGroup = false;
                                crunches[i].coaAmounts[j].group = groups[y];
                                let cruncher = results.find(r => r._id.toString() === crunches[i]._id.toString());

                                if (!cruncher) {
                                    cruncher = JSON.parse(JSON.stringify(crunches[i]));
                                    cruncher.coaAmounts = [];
                                    results.push(cruncher);
                                }
                                cruncher.coaAmounts.push(crunches[i].coaAmounts[j]);
                            }
                            if (isNotInGroup && y === groups.length - 1) {
                                if (!(<any[]>unGroupExpense.coas).find(r => r.toString() === crunches[i].coaAmounts[j].coaId._id.toString()))
                                    (<any[]>unGroupExpense.coas).push(crunches[i].coaAmounts[j].coaId._id.toString());

                                crunches[i].coaAmounts[j].group = unGroupExpense;
                                let cruncher = results.find(r => r._id.toString() === crunches[i]._id.toString());
                                if (!cruncher) {
                                    cruncher = JSON.parse(JSON.stringify(crunches[i]));
                                    cruncher.coaAmounts = [];
                                    results.push(cruncher);
                                }
                                cruncher.coaAmounts.push(crunches[i].coaAmounts[j]);
                            }
                        }
                    }
                }
            }
        }

        return Crunch.parseArray(results);
    }

    async totalIncomeForDate(originId: string, clientIds: string[], type: number, beginYear: number, beginMonth: number, endYear: number, endMonth: number): Promise<{ clientId: string, amount: number }[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.CRUNCHER.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];
        if (!clientIds.length)
            return [];
        let totalIncomeforDate: { clientId: string, amount: number }[] = [];
        for (let i = 0; i < clientIds.length; i++) {
            let result = await this.crunchRepository.aggregate([{
                $match: {'userId': DataHelper.toObjectId(clientIds[i])}
            }, {
                $match: {'type': type}
            }, {
                $match: {
                    $or: [{
                        'year': {$eq: beginYear},
                        'month': {$gte: beginMonth}
                    }, {
                        'year': {$eq: endYear},
                        'month': {$lte: endMonth}
                    }]
                }
            }, {
                $group: {_id: null, amount: {$sum: '$income'}}
            }, {
                $project: {_id: 0, amount: 1}
            }]);

            totalIncomeforDate.push({clientId: clientIds[i], amount: result[0].amount});
        }
        return totalIncomeforDate;
    }

    async totalChartAccountForDate(originId: string, clientIds: string[], type: number, coaIds: string[], beginYear: number, beginMonth: number, endYear: number, endMonth: number): Promise<{ clientId: string, coaId: string, amount: number }[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.CRUNCHER.claim.GET.code], originId, []);
        if (!products || !products.length)
            return [];
        if (!clientIds.length || !coaIds.length)
            return [];
        let totalIncomeforDate: { clientId: string, coaId: string, amount: number }[] = [];
        for (let i = 0; i < clientIds.length; i++) {
            for (let j = 0; j < coaIds.length; j++) {
                let result = await this.crunchRepository.aggregate([{
                    $match: {'userId': DataHelper.toObjectId(clientIds[i])}
                }, {
                    $match: {'type': type}
                }, {
                    $match: {
                        $or: [{
                            'year': {$eq: beginYear},
                            'month': {$gte: beginMonth}
                        }, {
                            'year': {$eq: endYear},
                            'month': {$lte: endMonth}
                        }]
                    }
                }, {
                    $unwind: '$coaAmounts'
                }, {
                    $match: {'coaAmounts.coaId': DataHelper.toObjectId(coaIds[j])}
                }, {
                    $group: {_id: null, amount: {$sum: '$coaAmounts.amount'}}
                }, {
                    $project: {_id: 0, amount: 1}
                }]);

                totalIncomeforDate.push({clientId: clientIds[i], coaId: coaIds[j], amount: result[0].amount});
            }
        }
        return totalIncomeforDate;
    }

    async getDataReport(originId: string, productCode: number, managerId: string, clientIds: string[], beginYear: number, beginMonth: number, endYear: number, endMonth: number): Promise<any> {
        let crunchs: any;
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.REPORT.claim.GET.code], originId, []);
        if (!products || !products.length)
            return {};
        let connectBanks = await BusinessLoader.connectBankBusiness.getConnectBankByUserIds(originId, clientIds);
        if (!connectBanks.length) {
            return {
                crunchs: [],
                budgets: []
            };
        }
        const accountIds = connectBanks.map(item => item.accountId);
        if (managerId)
            crunchs = await this.getCrunchsByTime(managerId, clientIds, accountIds, endYear, endMonth);
        else
            crunchs = await this.getCrunchsByTime(originId, clientIds, accountIds, endYear, endMonth);
        let coaIds: string[] = [];

        if (!crunchs.length) {
            return {
                crunchs: [],
                budgets: []
            };
        }
        // throw new ErrorCommon(101, 'Data report\'s filter criteria');

        let dataReports = clientIds.map(userId => {
            let crunchReports = crunchs.filter(crunch => {
                return crunch.userId.toString() === userId.toString();
            });

            if (crunchReports.length === 0)
                return {userId, data: []};
            // begin to end time not full year
            crunchReports.sort((a: Crunch, b: Crunch) => {
                if (compareTime(a, b))
                    return 1;
                else
                    return 0;
            });

            let crunchReportFilter = crunchReports.filter(crunch => {
                let checkTime = compareTime(crunch, {year: beginYear, month: beginMonth});
                return checkTime === true || (crunch.month === beginMonth && crunch.year === beginYear);
            });
            let totalCoaAmounts: any = [];
            let monthlyReports = crunchReportFilter.map(crunchReport => {
                crunchReport.coaAmounts.forEach(b => {
                    if (!coaIds.find(c => c === b.coaId._id.toString()))
                        coaIds.push(b.coaId._id);

                    let coaTotalAmount = 0;
                    for (let index = 0; index < crunchReports.length; index++) {
                        let totalCoaAmount = totalCoaAmounts.find(coaTotalItem => coaTotalItem.coaId._id.toString() === b.coaId._id.toString());
                        if (totalCoaAmount)
                            break;

                        if (crunchReports[index].completedAt) {
                            let coaAmounts = crunchReports[index].coaAmounts;
                            let coaAmount = coaAmounts.find(item => {
                                return item.coaId._id.toString() === b.coaId._id.toString();
                            });
                            if (coaAmount)
                                coaTotalAmount += coaAmount.amount ? coaAmount.amount : 0;
                        }
                        if (index === (crunchReports.length - 1))
                            totalCoaAmounts.push({coaId: b.coaId, amount: coaTotalAmount});
                    }
                });

                let totalIncome = 0;
                // correct
                for (let index = 0; index < crunchReports.length; index++) {
                    if (crunchReports[index].completedAt) {
                        let income = crunchReports[index].income ? crunchReports[index].income : 0;
                        totalIncome += income ? income : 0;
                    }
                }
                totalIncome = parseFloat(totalIncome.toFixed(2));
                return {
                    ...crunchReport,
                    totalIncome: totalIncome,
                    totalCoaAmounts: totalCoaAmounts
                };
            });

            return {
                userId: userId,
                data: monthlyReports
            };
        });
        let budgets = await BusinessLoader.budgetBusiness.getBudgetForCrunch(originId, productCode, clientIds, coaIds, beginYear, beginMonth, endYear, endMonth);
        return {
            crunchs: dataReports,
            budgets: budgets
        };
    }

    async getUsersCompletedCrunch(originId: string, productCode: ProductCode, page: number, limit: number): Promise<User[]> {
        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     return [];
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, [productCode]);
        if (!products || !products.length)
            return [];

        let pagination = new Pagination(page, limit);
        let nowDay = moment().subtract(1, 'month');
        let nowMonth = parseInt(nowDay.format('M'));
        let nowYear = parseInt(nowDay.format('YYYY'));
        let query: any = {};
        if (nowMonth > 6)
            query = {
                month: {
                    $lte: nowMonth
                },
                year: nowYear
            };
        else {
            let beginMonth = 6 + nowMonth;
            query = {
                $or: [{
                    month: {
                        $gte: beginMonth
                    },
                    year: {
                        $eq: nowYear - 1
                    }
                }, {
                    month: {
                        $lte: nowMonth
                    },
                    year: {
                        $eq: nowYear
                    }
                }]
            };
        }

        let userCrunch = await this.crunchRepository.aggregate([
            {
                $match: query
            },
            {
                $group: {
                    '_id': '$userId',
                    'completedAt': {
                        $push: '$completedAt'
                    }
                }
            },
            {
                $match: {
                    'completedAt': {
                        $ne: null
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            // {
            //     $match: {
            //         'user.permission.product': DataHelper.toObjectId(product._id)
            //     }
            // },
            {
                $skip: pagination.skip
            },
            {
                $limit: pagination.limit
            }
        ]);
        return userCrunch.map(user => {
            return new User(user.user);
        });
    }

    async getCountUsersCompletedCrunch(originId: string, productCode: ProductCode): Promise<number> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, [productCode]);
        if (!products || !products.length)
            return 0;
        let nowDay = moment().subtract(1, 'month');
        let nowMonth = parseInt(nowDay.format('M'));
        let nowYear = parseInt(nowDay.format('YYYY'));
        let query: any = {};
        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     return 0;
        if (nowMonth > 6)
            query = {
                month: {
                    $lte: nowMonth
                },
                year: nowYear
            };
        else {
            let beginMonth = 6 + nowMonth;
            query = {
                $or: [{
                    month: {
                        $gte: beginMonth
                    },
                    year: {
                        $eq: nowYear - 1
                    }
                }, {
                    month: {
                        $lte: nowMonth
                    },
                    year: {
                        $eq: nowYear
                    }
                }]
            };
        }

        let userCrunch:any = await this.crunchRepository.aggregate([
            {
                $match: query
            },
            {
                $group: {
                    '_id': '$userId',
                    'completedAt': {
                        $push: '$completedAt'
                    }
                }
            },
            {
                $match: {
                    'completedAt': {
                        $ne: null
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $match: {
                    'user.permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))}
                }
            },
            {
                $count: 'count'
            }

        ]);
        return (Array.isArray(userCrunch) && userCrunch.length !== 0) ? userCrunch[0].count : 0;
    }

    async getUsersNotCrunch(originId: string, productCode: ProductCode, page: number, limit: number): Promise<any[]> {
        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     return [];
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, [productCode]);
        if (!products || !products.length)
            return [];

        // get role Supervisor
        let roleId = '';
        let role = await BusinessLoader.roleBusiness.getByCode(RoleCode.Supervisor);
        if (role)
            roleId = role._id;
        let pagination = new Pagination(page, limit);
        let nowDay = moment().subtract(1, 'month');
        let nowMonth = parseInt(nowDay.format('M'));
        let nowYear = parseInt(nowDay.format('YYYY'));
        let query: any = {};
        if (nowMonth > 6)
            query = {
                month: {
                    $lte: nowMonth
                },
                year: nowYear
            };
        else {
            let beginMonth = 6 + nowMonth;
            query = {
                $or: [{
                    month: {
                        $gte: beginMonth
                    },
                    year: {
                        $eq: nowYear - 1
                    }
                }, {
                    month: {
                        $lte: nowMonth
                    },
                    year: {
                        $eq: nowYear
                    }
                }]
            };
        }
        query.completedAt = {'$eq': null};

        let userCrunch = await this.crunchRepository.aggregate([
            {
                $match: query
            },
            {
                $group: {
                    _id: '$userId'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            }, {
                $lookup: {
                    from: 'files',
                    localField: 'user.avatar',
                    foreignField: '_id',
                    as: 'user.avatar'
                }
            }, {
                $unwind: '$user.avatar'
            }, {
                $lookup: {
                    from: 'products',
                    localField: 'user.permission.product',
                    foreignField: '_id',
                    as: 'user.permission.product'
                }
            }, {
                $unwind: '$user.permission.product'
            }, {
                $lookup: {
                    from: 'roles',
                    localField: 'user.permission.role',
                    foreignField: '_id',
                    as: 'user.permission.role'
                }
            }, {
                $unwind: '$user.permission.role'
            }, {
                $skip: pagination.skip
            },
            {
                $limit: pagination.limit
            }
        ]);
        return await Promise.all(userCrunch.map(async (user): Promise<any> => {
            user.user.SupervisorManager = await BusinessLoader.userBusiness.getUsersByRole(user.user.permission.managers, roleId);
            return user.user;
        }));
    }

    async getCountUsersNotCrunch(originId: string, productCode: ProductCode): Promise<number> {
        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     return 0;
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.MANAGER.claim.GET_CLIENT.code], originId, [productCode]);
        if (!products || !products.length)
            return 0;
        let nowDay = moment().subtract(1, 'month');
        let nowMonth = parseInt(nowDay.format('M'));
        let nowYear = parseInt(nowDay.format('YYYY'));
        let query: any = {};
        if (nowMonth > 6)
            query = {
                month: {
                    $lte: nowMonth
                },
                year: nowYear
            };
        else {
            let beginMonth = 6 + nowMonth;
            query = {
                $or: [{
                    month: {
                        $gte: beginMonth
                    },
                    year: {
                        $eq: nowYear - 1
                    }
                }, {
                    month: {
                        $lte: nowMonth
                    },
                    year: {
                        $eq: nowYear
                    }
                }]
            };
        }
        query.completedAt = {'$eq': null};

        let userCrunch:any = await this.crunchRepository.aggregate([
            {
                $match: query
            },
            {
                $group: {
                    _id: '$userId'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $match: {
                    'user.permission.product': {$in: products.map(product => DataHelper.toObjectId(product._id))}
                }
            },
            {
                $count: 'count'
            }
        ]);
        return (Array.isArray(userCrunch) && userCrunch.length !== 0) ? userCrunch[0].count : 0;
    }

    async getCrunchFilters(userId: string): Promise<CrunchFilter[] > {
        if (!userId)
            return [];

        let params = {
            query: {
                $and: [{
                    $or: [{deletedAt: {$exists: false}}, {deletedAt: null}]
                }, {
                    $or: [{userId: DataHelper.toObjectId(userId)}, {isGlobal: true}]
                }]
            }
        };
        let result = await this.crunchFilterRepository.findAll(params);
        return result;
    }

    async getCrunchFilterById(originId: string, _id: string): Promise<CrunchFilter | null> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.AUTOCRUNCHER.claim.GET.code], originId);
        if (!products || !products.length)
            return null;

        let subParams = {
            query: <any> {
                _id: DataHelper.toObjectId(_id),
                userId: DataHelper.toObjectId(originId),
                deletedAt: null
            }
        };

        let crunchFilter = await this.crunchFilterRepository.findOne(subParams);

        if (crunchFilter && crunchFilter.userId)
            crunchFilter.userId = await BusinessLoader.userBusiness.get(crunchFilter.userId);

        if (crunchFilter && crunchFilter.bankId) {
            let bankIds = await BusinessLoader.yodleeBusiness.getProvidersByBankIds([crunchFilter.bankId]);
            crunchFilter.bankId = bankIds.length && bankIds[0];
        }

        return crunchFilter;
    }

    async getCrunchFilter(productCode: number, originId: string, userId?: string, isGlobal?: boolean, startDate?: string, endDate?: string, searchText?: string, page?: number, limit?: number): Promise<CrunchFilter[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.AUTOCRUNCHER.claim.GET.code], originId, [productCode]);
        if (!products || !products.length)
            return [];

        if (userId) {
            let targetUser: any = await AuthorizationHelper.userService.get(userId);
            if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
                return [];
        }

        let pagination: any;
        if (page && limit)
            pagination = new Pagination(page, limit);

        let params: any = [];
        params.push({$match: {deletedAt: null}});
        params.push({$sort: {createdAt: -1}});

        if (startDate && endDate) {
            let dateBegin = new Date(startDate);
            let dateEnd = new Date(endDate);
            params.push({$match: {createdAt: {$gte: dateBegin, $lte: dateEnd}}});
        }
        params.push({$match: {isGlobal: {$eq: isGlobal}}});
        if (userId)
            params.push({$match: {userId: DataHelper.toObjectId(userId)}});

        params.push({
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        }, {
            $unwind: '$user'
        }, {
            $lookup: {
                from: 'providers',
                localField: 'bankId',
                foreignField: 'bankId',
                as: 'bank'
            }
        });

        if (searchText)
            params.push({$match: {'conditions.description': {$regex: new RegExp(searchText, 'i')}}});

        params.push({
            $project: {
                'user.paymentInfo': 0,
                'user.forgotKey': 0,
                'user.paymentCard': 0,
                'user.tradingQuestion': 0,
                'user.token': 0,
                'user.yodleeAccount': 0,
                'user.status': 0,
                'user.businessInfo': 0,
                'user.connectedBanks': 0,
                'user.subContractors': 0,
                'user.personalInfo': 0,
                'user.activationKey': 0
            }
        });

        if (pagination)
            params.push({
                $skip: pagination.skip
            }, {
                $limit: pagination.limit
            });

        let crunchFilter = await this.crunchFilterRepository.aggregate(params);
        return crunchFilter;
    }

    async getCountCrunchFilter(productCode: number, originId: string, userId?: string, isGlobal?: boolean, startDate?: string, endDate?: string, searchText?: string): Promise<number> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.AUTOCRUNCHER.claim.GET.code], originId, [productCode]);
        if (!products || !products.length)
            return 0;
        if (userId) {
            let targetUser: any = await AuthorizationHelper.userService.get(userId);
            if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
                return 0;
        }

        let params: any = [];
        params.push({$match: {deletedAt: null}});

        if (startDate && endDate) {
            let dateBegin = new Date(startDate);
            let dateEnd = new Date(endDate);
            params.push({$match: {createdAt: {$gte: dateBegin, $lte: dateEnd}}});
        }

        if (isGlobal) {
            let a = JSON.parse(isGlobal + '');
            params.push({$match: {isGlobal: a}});
        }

        if (userId)
            params.push({$match: {userId: userId}});

        if (searchText)
            params.push({$match: {'conditions.description': {$regex: new RegExp(searchText, 'i')}}});

        params.push({$count: 'count'});

        let crunchFilter = await this.crunchFilterRepository.aggregate(params);

        return Array.isArray(crunchFilter) && crunchFilter.length > 0 ? crunchFilter[0].count : 0;
    }

    async create(data: CrunchCreate): Promise<any> {
        return await this.crunchRepository.create(data);
    }

    async createCrunchFilter(originId: string, data: CrunchFilterCreate): Promise<any> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        // if (data && data.conditions && data.groupName !== 'Income')
        //     for (let i = 0; i < data.conditions.length; i++) {
        //         if (data.conditions[i].operation.length === 0 || data.conditions[i].description.length === 0)
        //             throw new ErrorCommon(101, 'Request');
        //     }
        // else if (!data || !data.conditions && data.groupName !== 'Income')
        //     throw new ErrorCommon(101, 'Request');

        if (!data)
            throw new ErrorCommon(101, 'Request');

        if (data.groupName !== 'Income') {
            if (!data.conditions || !data.conditions.length)
                throw new ErrorCommon(101, 'Request');

            for (let i = 0; i < data.conditions.length; i++) {
                if (data.conditions[i].operation.length === 0 || data.conditions[i].description.length === 0)
                    throw new ErrorCommon(101, 'Request');
            }
        }

        // if ((data.baseType === 'CREDIT' && data.groupName !== 'Income') || (data.baseType === 'DEBIT' && data.groupName === 'Income'))
        //     throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.AUTOCRUNCHER.claim.CREATE.code], originId);
        if (!products || !products.length)
            return;

        return await this.crunchFilterRepository.create(data);
    }

    async updateUseCrunchFilter(originId: string, crunchFilterId: string, useNumber: number): Promise<any> {
        if (!originId || !crunchFilterId || !useNumber)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.AUTOCRUNCHER.claim.UPDATE.code], originId);
        if (!products || !products.length)
            return;

        let query: any = {'_id': DataHelper.toObjectId(crunchFilterId)};
        let crunchFilter = await this.crunchFilterRepository.findOne(query);
        if (!crunchFilter)
            return null;

        let count = crunchFilter.used + useNumber;
        return await this.crunchFilterRepository.update(crunchFilterId, {used: count});
    }

    async updateCrunchFilter(originId: string, _id: string, data: any): Promise<any> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        if (!data)
            throw new ErrorCommon(101, 'Request');

        if (data.groupName !== 'Income') {
            if (!data.conditions || !data.conditions.length)
                throw new ErrorCommon(101, 'Request');

            for (let i = 0; i < data.conditions.length; i++) {
                if (data.conditions[i].operation.length === 0 || data.conditions[i].description.length === 0)
                    throw new ErrorCommon(101, 'Request');
            }
        }

        // if ((data.baseType === 'CREDIT' && data.groupName !== 'Income') || (data.baseType === 'DEBIT' && data.groupName === 'Income'))
        //     throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.AUTOCRUNCHER.claim.UPDATE.code], originId);
        if (!products || !products.length)
            return undefined;

        let body = await this.crunchFilterRepository.get(_id);
        if (!body)
            return undefined;

        let user = await AuthorizationHelper.userService.get(originId);
        if (user && user.permission && user.permission.role && user.permission.role.code === RoleCode.CaseManager && (user._id.toString() !== body.userId.toString()))
            return undefined;

        return await this.crunchFilterRepository.update(_id, data);
    }

    async updateNameFiled(): Promise<boolean> {
        let crunch = await this.crunchRepository.updateNameField();
        if (!crunch)
            return false;
        return true;
    }

    async deleteCunchFilter(originId: string, _id: string): Promise<boolean> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.AUTOCRUNCHER.claim.DELETE.code], originId);
        if (!products || !products.length)
            return false;

        let data = await this.crunchFilterRepository.get(_id);
        if (!data)
            return false;

        let user = await AuthorizationHelper.userService.get(originId);
        if (user && user.permission && user.permission.role && user.permission.role.code === RoleCode.CaseManager && (user._id.toString() !== data.userId.toString()))
            return false;

        let result = await this.crunchFilterRepository.delete(_id, true);
        if (result) {
            LogHelper.logService.create({system: Project.PROJECT_NAME, module: null, method: 'DELETE', path: `/api/crunch/crunch-filter?_id=${_id}`, description: 'Remove crunch filter!', status: 1});
            return true;
        }
        LogHelper.logService.create({system: Project.PROJECT_NAME, module: null, method: 'DELETE', path: `/api/crunch/crunch-filter?_id=${_id}`, description: 'Not remove crunch filter!', status: 2});
        return false;
    }

    async started(originId: string, _id: string): Promise<boolean> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.CRUNCHER.claim.UPDATE.code], originId, []);
        if (!products || !products.length)
            return false;
        let result = this.crunchRepository.findOneAndUpdate({
            _id: DataHelper.toObjectId(_id)
        }, {
            'startedAt': new Date()
        });

        return result ? true : false;
    }

    async unStarted(originId: string, _id: string): Promise<boolean> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.CRUNCHER.claim.UPDATE.code], originId, []);
        if (!products || !products.length)
            return false;
        let result = this.crunchRepository.findOneAndUpdate({
            _id: DataHelper.toObjectId(_id)
        }, {
            'startedAt': null
        });

        return result ? true : false;
    }

    async completedAllUser() {
        let crunchs = await this.crunchRepository.findAll({query: {completedAt: {$ne: null}}});
        for (let index = 0; index < crunchs.length; index++) {
            const crunch = crunchs[index];
            try {
                await this.completed('5b4dc268968d3a484eb59c10', crunch.userId, crunch.accountId, crunch.type, crunch.year, crunch.month);
            }
            catch (error) {
            }
        }
    }

    async completed(originId: string, clientId: string, accountId: string, type: number, year: number, month: number): Promise<boolean> {
        if (!clientId || !type || !year || !month || !accountId)
            return false;
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.CRUNCHER.claim.UPDATE.code], originId, []);
        if (!products || !products.length)
            return false;

        let targetUser: any = await AuthorizationHelper.userService.get(clientId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return false;
        let coaAmounts: { coaId: string, amount: number }[] = [];
        let transactions = await BusinessLoader.transactionBusiness.getAllTransactionToCrunch(originId, clientId, accountId, type, year, month, true);
        let coaIncome = await BusinessLoader.chartAccountBusiness.getByCodeAndName('4-1000', 'Sales Income');
        let coaOther = await BusinessLoader.chartAccountBusiness.getByCodeAndName('4-2000', 'Misc/Other Income');
        let coaDrawings = await BusinessLoader.chartAccountBusiness.getByCodeAndName('2-2200', 'Drawings');
        let incomeCoa = coaIncome ? {coaId: coaIncome._id, amount: 0} : null;
        let otherCoa = coaOther ? {coaId: coaOther._id, amount: 0} : null;
        let drawingsCoa = coaDrawings ? {coaId: coaDrawings._id, amount: 0} : null;
        for (let i = 0; i < transactions.length; i++) {
            if (!transactions[i].typeCrunch) {
                return false;
            }
            else if (transactions[i].typeCrunch === CrunchType.Expenses && !transactions[i].coaId) {
                return false;
            }

            let transactionAmount = transactions[i].amount && transactions[i].amount.amount ? transactions[i].amount.amount : 0;
            transactionAmount = parseFloat(transactionAmount.toFixed(2));
            if (incomeCoa && transactions[i].typeCrunch === CrunchType.Income) {
                incomeCoa.amount = incomeCoa.amount + transactionAmount;
                incomeCoa.amount = parseFloat(incomeCoa.amount.toFixed(2));
            }

            if (otherCoa && transactions[i].typeCrunch === CrunchType.Other) {
                otherCoa.amount = otherCoa.amount + transactionAmount;
                otherCoa.amount = parseFloat(otherCoa.amount.toFixed(2));
            }

            if (drawingsCoa && transactions[i].typeCrunch === CrunchType.Drawings) {
                drawingsCoa.amount = drawingsCoa.amount + transactionAmount;
                drawingsCoa.amount = parseFloat(drawingsCoa.amount.toFixed(2));
            }
        }

        if (incomeCoa)
            coaAmounts.push(incomeCoa);
        if (otherCoa)
            coaAmounts.push(otherCoa);
        if (drawingsCoa)
            coaAmounts.push(drawingsCoa);

        let income = await BusinessLoader.transactionBusiness.totalAmountTransactionCruch(originId, clientId, type, 'CREDIT', year, month);

        let chartAccountAmounts = await BusinessLoader.transactionBusiness.totalAmountTransactionChartAccount(originId, clientId, type, year, month);

        if (chartAccountAmounts.length) {
            for (let i = 0; i < chartAccountAmounts.length; i++) {
                let index;
                for (let j = 0; j < coaAmounts.length; j++) {
                    if (coaAmounts[j].coaId.toString() === chartAccountAmounts[i].coaId.toString()) {
                        index = j;
                        break;
                    }
                }
                if (index >= 0) {
                    if (chartAccountAmounts[i].baseType === 'DEBIT')
                        coaAmounts[index].amount = coaAmounts[index].amount - chartAccountAmounts[i].amount.amount;
                    else if (chartAccountAmounts[i].baseType === 'CREDIT')
                        coaAmounts[index].amount = coaAmounts[index].amount + chartAccountAmounts[i].amount.amount;
                }
                else {
                    if (chartAccountAmounts[i].baseType === 'DEBIT')
                        coaAmounts.push({coaId: chartAccountAmounts[i].coaId, amount: -chartAccountAmounts[i].amount.amount});
                    else if (chartAccountAmounts[i].baseType === 'CREDIT')
                        coaAmounts.push({coaId: chartAccountAmounts[i].coaId, amount: chartAccountAmounts[i].amount.amount});
                }
            }
        }

        let result = await this.crunchRepository.createOrUpdate({
            userId: DataHelper.toObjectId(clientId),
            type: type,
            year: year,
            month: month,
            accountId: accountId
        }, {
            'completedAt': new Date(),
            'coaAmounts': coaAmounts,
            'income': income
        });

        return result ? true : false;
    }

    async unComplete(originId: string, clientId: string, type: number, year: number, month: number) {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.CRUNCHER.claim.UPDATE.code], originId, []);
        if (!products || !products.length)
            return false;
        let targetUser: any = await AuthorizationHelper.userService.get(clientId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return false;

        let result = await this.crunchRepository.findOneAndUpdate({
            userId: DataHelper.toObjectId(clientId),
            type: type,
            year: year,
            month: month
        }, {
            'completedAt': null
        });
        return result ? true : false;
    }

    async approve(originId: string, clientId: string, type: number, year: number, month: number, msg: any) {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.CRUNCHER.claim.APPROVE.code], originId, []);
        if (!products || !products.length)
            return false;
        let targetUser: any = await AuthorizationHelper.userService.get(clientId);
        if (!targetUser || !targetUser.permission || !targetUser.permission.product || !products.find(item => item._id === targetUser.permission.product._id))
            return false;

        let result = await this.crunchRepository.findOneAndUpdate({
            userId: DataHelper.toObjectId(clientId),
            type: type,
            year: year,
            month: month
        }, {
            'approvedAt': new Date()
        });
        if (msg && msg.fromEmail) {
            // get ids product admin and product manager
            let receiverIds = await BusinessLoader.managerBusiness.getManagersByIds(msg.listManagers, msg.productId);
            await LogHelper.notificationService.createMultipleToReceiverIds({title: 'Approve Cruncher', message: `Approve Cruncher <a href="/client-management" target="_blank">${msg.fromEmail}</a>`, receiverIds});
        }
        return result ? true : false;
    }

    async deleteAllByUser(originId: string, clientId: string): Promise<boolean> {
        if (!originId)
            return false;

        let manager = await AuthorizationHelper.userService.get(originId);
        let roleSuperAdmin = await BusinessLoader.roleBusiness.getByCode(RoleCode.SuperAdmin);
        if (!manager || !manager.permission || !manager.permission.role || !roleSuperAdmin || manager.permission.role.toString() !== roleSuperAdmin._id)
            return false;

        let results = await this.crunchFilterRepository.findAll({query: {userId: DataHelper.toObjectId(clientId)}});
        for (let i = 0; i < results.length; i++) {
            await this.crunchRepository.delete(results[i]._id, true);
        }
        return false;
    }
}

function compareTime(time1: any, time2: any): boolean {
    let year1 = parseInt(time1.year);
    let year2 = parseInt(time2.year);
    let month1 = parseInt(time1.month);
    let month2 = parseInt(time2.month);

    if (year1 === year2)
        return month1 > month2;
    else
        return year1 > year2;
}

function caculatorOverdue(month: number, year: number): number {
    let dayBegin = moment([year, month - 1]).endOf('month');
    let numberDays = moment().diff(dayBegin, 'day');
    if (numberDays < 8)
        return 0;
    else
        return numberDays - 8;
}

Object.seal(CrunchBusiness);
export default CrunchBusiness;
