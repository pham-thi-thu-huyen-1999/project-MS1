import IBaseBusiness from './base/IBaseBusiness';
import ChartAccountAssignment from 'justdone-system-package/dest/app/model/chartAccountAssignment/ChartAccountAssignment';
import ChartAccountAssignmentCreate from 'justdone-system-package/dest/app/model/chartAccountAssignment/ChartAccountAssignmentCreate'; // eslint-disable-line
import ChartAccountAssignmentUpdate from 'justdone-system-package/dest/app/model/chartAccountAssignment/ChartAccountAssignmentUpdate'; // eslint-disable-line

interface IChartAccountAssignmentBusiness extends IBaseBusiness<ChartAccountAssignment> {
    getUserByProductCoa: (originId: string, productCode: number, coaId: string) => Promise<any[]>
    getCountUserByProductCoa: (originId: string, productCode: number, coaId: string) => Promise<number>;
    getGroupProductByCOA: (coaId: string) => Promise<any[]>;
    getWithAllField: (originId: string, productCode: number, coaId: string, clientId: string) => Promise<ChartAccountAssignment | null>;
    getAllCoaByClient: (originId: string, userId: string) => Promise<ChartAccountAssignment[]>;
    getCoaByClient: (originId: string, productCode: number, userId: string, keyword: string, page: number, limit: number) => Promise<any>;
    getCountCoaByClient: (originId: string, productCode: number, userId: string, keyword: string) => Promise<number>;
    checkCoaExistByClient: (originId: string, productCode: number, clientId: string, coaId: string) => Promise<boolean>;
    getClientAssignedByProduct: (originId: string, productCode: number, coaId: string) => Promise<string[]>;
    searchWithProduct: (userId: string, productCode: number, page?: number, limit?: number, keyword?: string) => Promise<any[]>;
    getCountWithProduct: (userId: string, productCode: number, keyword?: string) => Promise<number>;
    assignAllCoas: (productId: string, clientId: string) => Promise<boolean>;
    create: (data: ChartAccountAssignmentCreate) => Promise<ChartAccountAssignment>;
    moveClientInProduction(client:string, product: string): Promise<boolean>;
    deleteByCoa: (coaId: string) => Promise<boolean>;
    deleteWithAllField: (originId: string, productCode: number, coaId: string, clientId: string) => Promise<boolean>;
    deleteAllByUser: (originId: string, clientId: string) => Promise<boolean>;
}

export default IChartAccountAssignmentBusiness;
