import Crunch from 'justdone-system-package/dest/app/model/crunch/Crunch'; // eslint-disable-line
import CrunchFilterCreate from 'justdone-system-package/dest/app/model/crunchFilter/CrunchFilterCreate';// eslint-disable-line
import CrunchCreate from 'justdone-system-package/dest/app/model/crunch/CrunchCreate';// eslint-disable-line
import CrunchStatus from 'justdone-system-package/dest/app/model/crunch/CrunchStatus';

interface ICrunchBusiness {
    getTotalIncome(originId: string): Promise<{ total: number }>;
    getReportAvailable(userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<any>;
    getStatusCrunch: (originId: string, userId: string[]) => Promise<{ userId: string, status: CrunchStatus | null, details: CrunchStatus[] }[]>;
    getCrunchsFinish(userId: string, beginMonth: number, beginYear: number, endMonth: number, endYear: number): Promise<Crunch[]>;
    getCrunchsByTime: (managerId: string, userIds: any[], accountIds: any[], endYear: number, endMonth: number) => Promise<any>
    totalIncomeForDate: (originId: string, userIds: string[], type: number, beginYear: number, beginMonth: number, endYear: number, endMonth: number) => Promise<{ clientId: string, amount: number }[]>;
    totalChartAccountForDate: (originId: string, userIds: string[], type: number, coaIds: string[], beginYear: number, beginMonth: number, endYear: number, endMonth: number) => Promise<{ clientId: string, coaId: string, amount: number }[]>;
    getDataReport: (originId: string, productCode: number, managerId: string, clientIds: string[], beginYear: number, beginMonth: number, endYear: number, endMonth: number) => Promise<any>;
    create: (data: CrunchCreate) => Promise<any>;
    getCrunchCompleted(originId: string, userId: string, startMonth: number, startYear: number, endMonth: number, endYear: number): Promise<any>;
    getCrunchNotCompleted(originId: string, userId: string, month: number, year: number): Promise<any>
}

export default ICrunchBusiness;

