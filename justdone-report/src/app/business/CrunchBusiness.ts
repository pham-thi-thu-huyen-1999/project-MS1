import * as moment from 'moment';
import BusinessLoader from '../../system/BusinessLoader';// eslint-disable-line
import ICrunchBusiness from './interfaces/ICrunchBusiness'; // eslint-disable-line
import CrunchRepository from 'justdone-system-package/dest/app/repository/CrunchRepository';
import Crunch from 'justdone-system-package/dest/app/model/crunch/Crunch';// eslint-disable-line
import CrunchCreate from 'justdone-system-package/dest/app/model/crunch/CrunchCreate';// eslint-disable-line
import CrunchStatus from 'justdone-system-package/dest/app/model/crunch/CrunchStatus';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import module from 'justdone-system-package/dest/resources/permission/module';
import * as groupArray from 'group-array';

class CrunchBusiness implements ICrunchBusiness {
    private crunchRepository: CrunchRepository;

    constructor() {
        this.crunchRepository = new CrunchRepository();
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

    async getCrunchCompleted(originId: string, userId: string, startMonth: number, startYear: number, endMonth: number, endYear: number): Promise<any> {
        if (!originId)
            throw new ErrorCommon(101, 'originId');
        if (!userId)
            throw new ErrorCommon(101, 'userId');
        if (!startYear)
            throw new ErrorCommon(101, 'startYear');
        if (!endYear)
            throw new ErrorCommon(101, 'endYear');
        if (!startMonth)
            throw new ErrorCommon(101, 'startMonth');
        if (!endMonth)
            throw new ErrorCommon(101, 'endMonth');
        let beginMonth: string;
        let finishMonth: string;
        if (startMonth < 10)
            beginMonth = '0' + startMonth;
        else
            beginMonth = String(startMonth);
        if (endMonth < 10)
            finishMonth = '0' + endMonth;
        else
            finishMonth = String(endMonth);

        let products = await Authenticator.filterProductsPermission([module.CRUNCHER.claim.GET.code], originId, []);
        if (!products || !products.length)
            throw new ErrorCommon(101, 'Request');

        const transactionQuery = [{
            $sort: {
                year: -1
            }
        },
        {
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
                    '$lte': new Date(String(endYear) + '-' + finishMonth + '-' + '01'),
                    '$gte': new Date(String(startYear) + '-' + beginMonth + '-' + '01')
                },
                'userId': DataHelper.toObjectId(userId),
                'completedAt': {$ne: null},
            }
        }];

        let crunchs = await this.crunchRepository.aggregate(transactionQuery);
        let dataCrunchs = groupArray(crunchs, 'month', 'year');
        return dataCrunchs;
    }

    async getCrunchNotCompleted(originId: string, userId: string, month: number, year: number): Promise<boolean> {
        if (!originId)
            throw new ErrorCommon(101, 'originId');
        if (!userId)
            throw new ErrorCommon(101, 'userId');
        if (!month)
            throw new ErrorCommon(101, 'month');
        if (!year)
            throw new ErrorCommon(101, 'year');
        let beginMonth: string;
        if (month < 10)
            beginMonth = '0' + month;
        else
            beginMonth = String(month);

        let products = await Authenticator.filterProductsPermission([module.CRUNCHER.claim.GET.code], originId, []);
        if (!products || !products.length)
            throw new ErrorCommon(101, 'Request');

        let params = {query: {}};

        params.query = {
            userId: DataHelper.toObjectId(userId),
            month: beginMonth,
            year: year,
            completedAt: null
        }

        let crunchs = await this.crunchRepository.find(params);
        return crunchs && crunchs.length === 0 ? false : true;
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
                    $lte: nowMonth
                },
                year: nowYear
            };
        else {
            let beginMonth = 6 + nowMonth;
            params.query = {
                userId: {$in: userIds},
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

        let crunchs = await this.crunchRepository.find(params);

        return crunchs;
    }

    async getStatusCrunch(originId: string, userIds: string[]): Promise<{ userId: string, status: CrunchStatus | null, details: CrunchStatus[] }[]> {
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
        // });//comment code doan a boi den

        let userStatus = crunchs.map(userCrunch => {
            let status: CrunchStatus | null = null;
            let details: CrunchStatus[] = [];
            userCrunch.crunchs.forEach(crunch => {
                // console.log(crunch);
                let overDay = caculatorOverdue(crunch.month, crunch.year);
                let detail = new CrunchStatus(crunch);

                if (!crunch.completedAt)
                    detail.overdue = overDay;
                details.push(detail);

                if (!status)
                    status = detail;
                else {
                    if (status.completedAt && compareTime(status, crunch))
                        status = detail;
                    if (!detail.completedAt && compareTime(status, crunch))
                        status = detail;
                }
            });

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
                if (coa.coaId && !coaIds.includes(coa.coaId._id))
                    coaIds.push(coa.coaId._id);
            });
        });

        let unGroupExpense = {
            _id: '6969696969696969696969696969',
            code: 696969,
            name: 'Ungroup Expense',
            order: -696969,
            coas: []
        };

        let results = <any[]>[];
        let groups = await BusinessLoader.groupExpenseBusiness.getGroupsByChartAccounts(managerId, coaIds);

        if (groups.length) {
            for (let i = 0; i < crunches.length; i++) {
                for (let j = 0; j < crunches[i].coaAmounts.length; j++) {
                    let isNotInGroup = true;
                    if (crunches[i].coaAmounts[j].coaId) {
                        for (let y = 0; y < groups.length; y++) {
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

    async getCrunchsFinish(userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<Crunch[]> {
        // if ((endYear - beginYear) > 1 || (endYear - beginYear) < 0 || (endYear === beginYear && endMonth < beginMonth))
        //     throw new Error('invalid time query !');

        const statementTime = [{
            month: {$gte: beginMonth},
            year: beginYear
        }, {
            month: {$lte: endMonth},
            year: endYear
        }];
        const statementWhenEqualYear = {
            userId,
            completedAt: {$exists: true, $ne: null},
            $and: statementTime
        };
        const statementWhenNotEqualYear = {
            userId,
            completedAt: {$exists: true, $ne: null},
            $or: statementTime
        };
        const query = beginYear === endYear ? statementWhenEqualYear : statementWhenNotEqualYear;
        const params = {
            query
        };

        const crunchs = await this.crunchRepository.findAll(params);
        return Crunch.parseArray(crunchs);
    }

    async getCrunchs(userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<Crunch[]> {
        // if ((endYear - beginYear) > 1 || (endYear - beginYear) < 0 || (endYear === beginYear && endMonth < beginMonth))
        //     throw new Error('invalid time query !');

        const statementTime = [{
            month: {$gte: beginMonth},
            year: beginYear
        }, {
            month: {$lte: endMonth},
            year: endYear
        }];
        const statementWhenEqualYear = {
            userId,
            $and: statementTime
        };
        const statementWhenNotEqualYear = {
            userId,
            $or: statementTime
        };
        const query = beginYear === endYear ? statementWhenEqualYear : statementWhenNotEqualYear;
        const params = {
            query
        };

        const crunchs = await this.crunchRepository.findAll(params);
        return Crunch.parseArray(crunchs);
    }

    async getReportAvailable(userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<any> {
        const crunchs = await this.getCrunchs(userId, beginMonth, beginYear, endMonth, endYear);
        console.log(crunchs);
        const timeFilter = this.timeFilter(beginMonth, beginYear, endMonth, endYear);
        if (!crunchs.length) {
            timeFilter.finalYearReport.status = false;
        }
        for (const monthly of timeFilter.monthlyReport) {
            const crunchMonths = crunchs.filter(crunch => crunch.month === monthly.month && crunch.year === monthly.year && crunch.completedAt);
            let isNotCrunch = false;
            if (crunchMonths.length === 0)
                isNotCrunch = true;
            crunchMonths.forEach(item => {
                if (!item.completedAt)
                    isNotCrunch = true;
            });
            if (isNotCrunch) {
                monthly.status = false;
                // timeFilter.finalYearReport.status = false;
                const targetItem = {month: monthly.month, year: monthly.year};
                const indexQuater = timeFilter.quarterReport.findIndex(item => this.isRangeTime(
                    targetItem, {
                        beginMonth: item.startMonth,
                        beginYear: item.startYear,
                        endMonth: item.endMonth,
                        endYear: item.endYear
                    }
                ));
                if (indexQuater >= 0)
                    timeFilter.quarterReport[indexQuater].status = false;
            }
        }
        return timeFilter;
    }

    timeFilter(beginMonth: number, beginYear: number, endMonth: number, endYear: number) {
        const beginMonthInFinalYear = 7;
        let beginFinalYear = beginYear;
        if (beginMonth < beginMonthInFinalYear)
            beginFinalYear = beginFinalYear - 1;
        // const statusFinalYear = (beginMonth === 7 && endMonth === 6 && beginYear === endYear - 1) ? true : false;
        const statusFinalYear = true;
        let fromDate = moment([beginFinalYear, beginMonthInFinalYear - 2]);
        const monthlyReport:{
        month:number,
        year:number,
        status:boolean}[] = [];
        const quarterReport:{
        startMonth: number,
        startYear: number,
        endMonth: number,
        endYear: number,
        status: boolean}[] = [];
        let startQuarter:any = null;
        let endQuarter:any = null;
        const now = moment([moment().format('Y'), parseInt(moment().format('M')) - 1]);
        for (let index = 0; index < 12; index++) {
            const divQuarter = index % 3;
            fromDate.add(1, 'month');
            const month = parseInt(fromDate.format('M'));
            const year = parseInt(fromDate.format('Y'));
            if (this.isRangeTime({month, year}, {beginMonth, beginYear, endMonth, endYear}) && fromDate < now) {
                const status = true;
                const itemMonthly = {month, year, status};
                monthlyReport.push(itemMonthly);

                if (divQuarter === 0)
                    startQuarter = {
                        month,
                        year
                    };

                if (divQuarter === 2 && startQuarter) {
                    endQuarter = {
                        month,
                        year
                    };

                    quarterReport.push({
                        startMonth: startQuarter.month,
                        startYear: startQuarter.year,
                        endMonth: endQuarter.month,
                        endYear: endQuarter.year,
                        status
                    });
                    startQuarter = null;
                }
            }
        }
        return {
            monthlyReport,
            quarterReport,
            finalYearReport: {
                beginYear,
                endYear: beginYear + 1,
                status: statusFinalYear
            }
        };
    }

    isRangeTime(
        targetTime:
        {month: number, year: number},
        rangeTime:{
        beginMonth: number,
        beginYear: number,
        endMonth: number,
        endYear: number
        }) {
        const startDate = moment([rangeTime.beginYear, rangeTime.beginMonth - 1]);
        const endDate = moment([rangeTime.endYear, rangeTime.endMonth - 1]);
        const targetDate = moment([targetTime.year, targetTime.month - 1]);
        if (startDate <= targetDate && endDate >= targetDate)
            return true;
        return false;
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

    async create(data: CrunchCreate): Promise<any> {
        return await this.crunchRepository.create(data);
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
