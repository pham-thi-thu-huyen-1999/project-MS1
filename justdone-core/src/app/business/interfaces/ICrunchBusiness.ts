import Crunch from 'justdone-system-package/dest/app/model/crunch/Crunch'; // eslint-disable-line
import CrunchFilter from 'justdone-system-package/dest/app/model/crunchFilter/CrunchFilter';// eslint-disable-line
import CrunchFilterCreate from 'justdone-system-package/dest/app/model/crunchFilter/CrunchFilterCreate';// eslint-disable-line
import CrunchCreate from 'justdone-system-package/dest/app/model/crunch/CrunchCreate';// eslint-disable-line
import CrunchStatus from 'justdone-system-package/dest/app/model/crunch/CrunchStatus';
import User from 'justdone-system-package/dest/app/model/user/User';
import { ProductCode } from 'justdone-system-package/dest/app/model/common/CommonType';// eslint-disable-line

interface ICrunchBusiness {
    getByEmail: (email: string) => Promise<any>;
    getByUserId: (userId: string) => Promise<any>;
    getCrunchFilters: (userId: string) => Promise<CrunchFilter[]>;
    getCrunchFilterById:(originId: string, _id: string) => Promise<CrunchFilter | null>;
    getCrunchFilter: (productCode: number, originId: string, userId?: string, isGlobal?: boolean, startDate?: string, endDate?: string, searchText?: string, page?: number, limit?: number) => Promise<CrunchFilter[]>;
    getCountCrunchFilter: (productCode: number, originId: string, userId?: string, isGlobal?: boolean, startDate?: string, endDate?: string, searchText?: string) => Promise<number>;
    getCrunchs: (originId: string, userId: string, type: number, beginYear: number) => Promise<Crunch[]>;
    getFinalYearCrunchs : (userId: string, accountId: string, type: number, beginYear: number) => Promise<Crunch[]>
    getUsersNotCrunch(originId: string, productCode: ProductCode, page: number, limit: number): Promise<any[]>
    getCountUsersNotCrunch(originId: string, productCode: ProductCode): Promise<number>;
    getUsersCompletedCrunch(originId: string, productCode: ProductCode, page: number, limit: number): Promise<User[]>;
    getCountUsersCompletedCrunch(originId: string, productCode: ProductCode): Promise<number>;
    getTotalIncome(originId: string): Promise<{ total: number }>;
    getStatusCrunch: (originId: string, userId: string[]) => Promise<{ userId: string, status: CrunchStatus | undefined, details: CrunchStatus[] }[]>;

    getCrunchsByTime: (managerId: string, userIds: any[], accountIds: any[], endYear: number, endMonth: number) => Promise<any>

    totalIncomeForDate: (originId: string, userIds: string[], type: number, beginYear: number, beginMonth: number, endYear: number, endMonth: number) => Promise<{ clientId: string, amount: number }[]>;
    totalChartAccountForDate: (originId: string, userIds: string[], type: number, coaIds: string[], beginYear: number, beginMonth: number, endYear: number, endMonth: number) => Promise<{ clientId: string, coaId: string, amount: number }[]>;
    getDataReport: (originId: string, productCode: number, managerId: string, clientIds: string[], beginYear: number, beginMonth: number, endYear: number, endMonth: number) => Promise<any>;
    completed: (originId: string, clientId: string, accountId: string, type: number, year: number, month: number) => Promise<boolean>;
    completedAllUser :() => Promise<any>;
    unComplete: (originId: string, clientId: string, type: number, year: number, month: number) => Promise<boolean>;
    started: (originId: string, _id: string) => Promise<boolean>;
    unStarted: (originId: string, _id: string) => Promise<boolean>;
    approve: (originId: string, clientId: string, type: number, year: number, month: number, msg: any) => Promise<boolean>;
    create: (data: CrunchCreate) => Promise<any>;
    createCrunchFilter(originId: string, data: CrunchFilterCreate): Promise<any>;
    updateUseCrunchFilter(originId: string, crunchFilterId: string, useNumber: number): Promise<any>;
    updateCrunchFilter(originId: string, _id: string, data: CrunchCreate): Promise<any>
    updateNameFiled:()=> Promise<boolean>;
    deleteCunchFilter(originId: string, _id: string): Promise<any>;
    deleteAllByUser(originId: string, clientId: string): Promise<boolean>;
}

export default ICrunchBusiness;

