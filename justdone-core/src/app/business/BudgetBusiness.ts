import * as _ from 'lodash';// eslint-disable-line
import * as moment from 'moment';// eslint-disable-line
import BusinessLoader from '../../system/BusinessLoader';// eslint-disable-line
import IBudgetBusiness from './interfaces/IBudgetBusiness'; // eslint-disable-line
import { ErrorYodlee, ErrorCommon } from 'justdone-system-package/dest/app/model/common/Error';// eslint-disable-line
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';// eslint-disable-line
import BudgetRepository from 'justdone-system-package/dest/app/repository/BudgetRepository';
import Budget from 'justdone-system-package/dest/app/model/budget/Budget';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import module from 'justdone-system-package/dest/resources/permission/module';
class BudgetBusiness implements IBudgetBusiness {
    private BudgetRepository: BudgetRepository;
    constructor() {
        this.BudgetRepository = new BudgetRepository();
    }

    async getBudgets(originId: string, productCode: number, clientId: string, beginYear: number, beginMonth: number, endYear: number, endMonth: number, keyword : string, page: number, limit:number): Promise<{coa:any, budgets:any[]}[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.BUDGET.claim.GET.code], originId, [productCode]);
        if (!products || !products.length)
            return [];
        let product = products.find(product => product.code === productCode);
        let proCode = product && product.code || 0;
        let query: any = {
            userId: DataHelper.toObjectId(clientId),
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

        let order = {
            coaId: 1,
            year: -1,
            month: -1
        };
        let coasAssigned:any[] = [];

        coasAssigned = await BusinessLoader.chartAccountAssignmentBusiness.getCoaByClient(originId, proCode, clientId, keyword, page, limit);
        query.coaId = {$in: coasAssigned.map(item => {
            let coaId = item.coaRef._id ? item.coaRef._id : item.coaRef;
            return DataHelper.toObjectId(coaId);
        } )};

        let budgets = await this.BudgetRepository.findAll({query: query}, order);
        let result:any[] = [];

        coasAssigned.forEach(element => {
            let coaBudgets = budgets.filter(b => {
                return b.coaId.toString() === element.coaRef._id.toString();
            });
            result.push({coa: element.coaRef, budgets: coaBudgets});
        });
        return result;
    }

    async getCountBudget(originId: string, productCode: number, clientId: string, keyword : string): Promise<number> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.BUDGET.claim.GET.code], originId, [productCode]);
        if (!products || !products.length)
            return 0;
        let product = products.find(product => product.code === productCode);
        let proCode = product && product.code || 0;
        return await BusinessLoader.chartAccountAssignmentBusiness.getCountCoaByClient(originId, proCode, clientId, keyword);
    }

    async getBudgetForCrunchTime(originId: string, productCode: number, clientIds: string[], coaIds: string[], endYear: number, endMonth: number): Promise<Budget[]> {
        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     return [];
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.BUDGET.claim.GET.code], originId, [productCode]);
        if (!products || !products.length)
            return [];

        let product = products[0];
        let beginMonth = product.config.financialYear.beginMonth;
        let beginYear;
        if (beginMonth > endMonth)
            beginYear = endYear - 1;
        else
            beginYear = endYear;

        let coas = coaIds.map(_id => DataHelper.toObjectId(_id));
        let clients = clientIds.map(_id => DataHelper.toObjectId(_id));

        let params = {
            query: {
                userId: {$in: clients},
                coaId: {$in: coas},
                $or: [{
                    year: {
                        $eq: beginYear
                    },
                    month: {
                        $gte: beginMonth
                    }
                }, {
                    year: {
                        $eq: endYear
                    },
                    month: {
                        $lte: endMonth
                    }
                }]
            }
        };
        let budgets = await this.BudgetRepository.findAll(params);
        return Budget.parseArray(budgets);
    }

    async getBudgetForCrunch(originId: string, productCode: number, clientIds: string[], coaIds: string[], beginYear: number, beginMonth: number, endYear: number, endMonth: number): Promise<any> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.BUDGET.claim.GET.code], originId, [productCode]);
        if (!products || !products.length)
            return [];

        let product = products.find(product => product.code === productCode);
        let proCode = product && product.code || 0;

        // coaIds no duplicate.
        if (!clientIds.length || !beginYear || !beginMonth || !endYear || !endMonth)
            return {userId: {}, data: {}};

        if (beginMonth <= endMonth && beginYear !== endYear)
            return {userId: {}, data: {}};

        // if (beginMonth > endMonth && beginYear >= endMonth)
        //     return {userId: {}, data: {}};

        let budgets = await this.getBudgetForCrunchTime(originId, proCode, clientIds, coaIds, endYear, endMonth);

        let dataReports = clientIds.map(u => {
            let budgetReports = budgets.filter(b => {
                return b.userId.toString() === u.toString();
            });

            if (budgetReports.length === 0)
                return {userId: u, data: {}};

            budgetReports.sort((a: Budget, b: Budget) => {
                if (compareTime(a, b))
                    return 1;
                else
                    return 0;
            });

            // let budgerReportFilter = budgetReports.filter(b => {
            //     let checkTime = compareTime(b, {year: beginYear, month: beginMonth});
            //     return checkTime === true || (b.month === beginMonth && b.year === beginYear);
            // });

            let totalAmounts: {coaId: string, amount: number}[] = [];
            let totalCoaAmountRange: {coaId: string, amount: number}[] = [];
            budgetReports.forEach(b => {
                if (compareTime(b, {year: beginYear, month: beginMonth}) || (b.month === beginMonth && b.year === beginYear)) {
                    let position = totalCoaAmountRange.findIndex(t => t.coaId.toString() === b.coaId.toString());
                    if (position >= 0)
                        totalCoaAmountRange[position].amount += b.amount;
                    else
                        totalCoaAmountRange.push({coaId: b.coaId, amount: b.amount});
                }
                let position = totalAmounts.findIndex(t => t.coaId.toString() === b.coaId.toString());
                if (position >= 0)
                    totalAmounts[position].amount += b.amount;
                else
                    totalAmounts.push({coaId: b.coaId, amount: b.amount});
            });
            return {
                userId: u,
                data: {
                    totalAmount: totalAmounts,
                    totalCoaAmountRange: totalCoaAmountRange
                }
            };
        });
        return dataReports;
    }

    async getTotalAmountBudget(originId: string, productCode: number, clientIds: {_id: string, coaIds: string[]}[], currentYear: number, currentMonth: number): Promise<{clientId: string, coas: any[]}[]> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        if (!productCode || !clientIds.length || !currentYear || !currentMonth)
            return [];

        let products = await Authenticator.filterProductsPermission([module.BUDGET.claim.GET.code], originId, [productCode]);
        if (!products || !products.length)
            return [];

        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     return [];
        let product = products[0];

        let beginYear;
        if (product.config.financialYear.beginMonth > currentMonth)
            beginYear = currentYear - 1;
        else
            beginYear = currentYear;

        let totalAmountBudget: any[] = [];
        let y = 0;
        do {
            let i = 0;
            let coaIds = clientIds[i].coaIds.map(_id => DataHelper.toObjectId(_id));
            let params = [{
                $match: {'userId': DataHelper.toObjectId(clientIds[y]._id)}
            }, {
                $match: {'coaId': {$in: coaIds}}
            }, {
                $match: {
                    $or: [{
                        year: {
                            $eq: beginYear
                        },
                        month: {
                            $gte: product.config.financialYear.beginMonth
                        }
                    }, {
                        year: {
                            $eq: currentYear
                        },
                        month: {
                            $lte: currentMonth
                        }
                    }]
                }
            }, {
                $group: {_id: '$coaId', totalAmount: {$sum: '$amount'}}
            }];

            let totalChartAccount = await this.BudgetRepository.aggregate(params);
            totalAmountBudget.push({clientId: clientIds[y]._id, coas: totalChartAccount});
            y++;
        } while (y < clientIds.length);

        return totalAmountBudget;
    }

    async createAndUpdate(originId: string, productCode: number, clientId: string, coaId: string, budgets: any[]): Promise<any> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');

        let products = await Authenticator.filterProductsPermission([module.BUDGET.claim.CREATE.code], originId, [productCode]);
        if (!products || !products.length)
            return [];
        let product = products.find(product => product.code === productCode);
        let proCode = product && product.code || 0;

        let isAssigned = await BusinessLoader.chartAccountAssignmentBusiness.checkCoaExistByClient(originId, proCode, clientId, coaId);
        if (!isAssigned || !budgets || !Array.isArray(budgets) || budgets.length > 12)
            throw new ErrorCommon(101, 'Request');

        let result: any[] = [];
        for (let i = 0; i < budgets.length; i++) {
            let a = await this.BudgetRepository.createOrUpdate(
                {userId: clientId, coaId, year: budgets[i].year, month: budgets[i].month},
                {userId: clientId, coaId, year: budgets[i].year, month: budgets[i].month, amount: budgets[i].amount}
            );
            result.push(a);
        }
        return result;
    }
}

// function checkFinanical(beginYear: number, beginMonth: number, endYear: number, endMonth: number, financialYear: {beginMonth: number, endMonth: number}) {
//     if (beginMonth !== financialYear.beginMonth)
//         return false;

//     if (beginYear <= endYear)
//         return true;

//     if (beginMonth > endMonth && beginYear < endYear)
//         return true;

//     if (beginMonth >= financialYear.beginMonth && beginYear === endYear)
//         return true;

//     if (beginMonth < financialYear.beginMonth && beginYear === (endYear - 1))
//         return true;

//     return true;
// }
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

Object.seal(BudgetBusiness);
export default BudgetBusiness;
