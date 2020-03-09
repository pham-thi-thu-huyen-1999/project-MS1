import IBaseBusiness from './base/IBaseBusiness';
import ChartAccount from 'justdone-system-package/dest/app/model/chartAccount/ChartAccount';
import ChartAccountStatistic from 'justdone-system-package/dest/app/model/chartAccount/ChartAccountStatistic'; // eslint-disable-line
import ChartAccountCreate from 'justdone-system-package/dest/app/model/chartAccount/ChartAccountCreate'; // eslint-disable-line
import ChartAccountUpdate from 'justdone-system-package/dest/app/model/chartAccount/ChartAccountUpdate'; // eslint-disable-line

interface IChartAccountBusiness extends IBaseBusiness<ChartAccount> {
    getAll: () => Promise<ChartAccount[]>;
    getByCodeAndName: (code: string, name: string) => Promise<ChartAccount | null>;
    getById: (originId: string, _ids: string[]) => Promise<ChartAccount[]>;
    getList: (page: number, limit: number) => Promise<ChartAccountStatistic[]>;
    getCount: (keyword?: string) => Promise<number>;
    // getByGroupId: (groupId: string) => Promise<ChartAccount[]>;
    getStatusChartAccount: (originId: string, ids: string[]) => Promise<any[]>;
    searchWithProduct: (userId: string, productCode: number, page?: number, limit?: number, keyword?: string) => Promise<any[]>;
    getCountWithProduct: (userId: string, productCode: number, keyword?: string) => Promise<number>
    search: (originId: string, page?: number, limit?: number, keyword?: string) => Promise<ChartAccountStatistic[]>;
    assignClients: (originId: string, _id: string, productCode: number, clientIds: string[], actionSelectedAll: boolean) => Promise<boolean>;
    removeClientAssigned: (originId: string, coaId: string, productCode: number, clientIds: string[]) => Promise<boolean>;
    checkDataExists: (code: string, name: string) => Promise<boolean>;
    update: (_id: string, data: ChartAccountUpdate) => Promise<ChartAccount | null>;
    removeProduct:(originId: string, _id: string, productCode: number)=>Promise<boolean>;
    delete: (_id: string) => Promise<boolean>;
    createChartAccount: (originId: string, data: ChartAccountCreate) => Promise<ChartAccount | boolean>;
    updateChartAccount: (originId: string, chartAccounId: string, data: ChartAccountUpdate) => Promise<ChartAccount | null>;
    deleteChartAccount: (originId: string, chartAccounId: string) => Promise<boolean>;
}

export default IChartAccountBusiness;
