import IBaseBusiness from './base/IBaseBusiness';
import Log from './../../model/log/Log'; // eslint-disable-line
import LogCreate from './../../model/log/LogCreate'; // eslint-disable-line

interface ILogBusiness extends IBaseBusiness<Log> {
    getList: (system: string, module: number, method: string, status: number, page: number, limit: number) => Promise<Log[]>;

    create: (data: LogCreate) => Promise<Log>;

    delete: (_id: string) => Promise<boolean>;
    deleteMultiple: (ids: string[]) => Promise<boolean>;
}

export default ILogBusiness;
