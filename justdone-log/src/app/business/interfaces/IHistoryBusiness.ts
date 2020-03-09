import IBaseBusiness from './base/IBaseBusiness';
import History from './../../model/history/History'; // eslint-disable-line
import HistoryCreate from './../../model/history/HistoryCreate'; // eslint-disable-line

interface IHistoryBusiness extends IBaseBusiness<History> {
    getListSignIn(originId: string, isChoice: number, productCode: number): Promise<History[]>;
    getList: (userId: string, module: number, type: number, page: number, limit: number) => Promise<History[]>;
    getCountByUserId: (userId: string) => Promise<number>;

    create: (data: HistoryCreate) => Promise<History>;

    delete: (_id: string) => Promise<boolean>;
    deleteMultiple: (ids: string[]) => Promise<boolean>;
}

export default IHistoryBusiness;
