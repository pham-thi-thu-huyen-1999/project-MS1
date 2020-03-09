import IBaseBusiness from './base/IBaseBusiness';
import Product from 'justdone-system-package/dest/app/model/product/Product'; // eslint-disable-line
import User from 'justdone-system-package/dest/app/model/user/User';
import ClientAccount from 'justdone-system-package/dest/app/model/user/ClientAccount';
import Invitation from 'justdone-system-package/dest/app/model/invitation/Invitation'; // eslint-disable-line

interface IAnalyticBusiness extends IBaseBusiness<User> {
    getAnalyticAccess: () => Promise<{_id: string, productName: string, count: number}[]>;
    getClientNotAssigned: (originId: string, productCodes?: number[], page?: number, limit?: number) => Promise<ClientAccount[]>;
    getCountClientNotAssigned: (originId: string, ProductCode?: number[]) => Promise<number>;
    getUserInvited: (originId: string, productCodes: number[], page?: number, limit?: number) => Promise<Invitation[]>;
    getCountUserInvited: (originId: string, productCodes: number[]) => Promise<number>;
    getClients: (originId: string, productCodes?: number[], roleCodes?: number[], keyword?: string, isDeleted?: boolean, page?: number, limit?: number) => Promise<ClientAccount[]>;
    getCountClients: (originId: string, productCodes?: number[], roleCodes?: number[], keyword?: string, isDeleted?: boolean) => Promise<number>;
    getCrunchClients: (originId: string, productCodes?: number[], roleCodes?: number[], keyword?: string, isDeleted?: boolean, page?: number, limit?: number) => Promise<ClientAccount[] | null>;
    getSummaryClients: (originId: string, productCodes: number[]) => Promise<{productCode: number, summary: {totalClients: number, totalInvited: number, totalNotConnect: number}}[]>
    getSummaryManagers: (originId: string, productCodes: number[]) => Promise<{productCode: number, summary: {totalManagers: number, totalProductManager: number, totalSupervisor: number}}[]>
    getUsersNotCrunch(originId: string, productCodes: number[], page: number, limit: number): Promise<User[]>
    getCountUsersNotCrunch(originId: string, productCodes: number[]): Promise<number>;
    getUsersCompletedCrunch(originId: string, productCodes: number[], page: number, limit: number): Promise<User[]>;
    getCountUsersCompletedCrunch(originId: string, productCodes: number[]): Promise<number>;
    getProductStatistics: (originId: string) => Promise<{product: Product, productAdmins: any[], countManagers: number, countClients: number, countCancelClients: number}[]>;
}

export default IAnalyticBusiness;
