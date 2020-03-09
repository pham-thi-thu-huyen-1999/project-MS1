import ILogBusiness from '../business/interfaces/ILogBusiness'; // eslint-disable-line
import Log from '../model/log/Log';
import LogCreate from '../model/log/LogCreate'; // eslint-disable-line
import LogUpdate from '../model/log/LogUpdate'; // eslint-disable-line
import LogRepository from '../repository/LogRepository';
import DataHelper from '../../helpers/DataHelper';
import {ErrorCommon} from '../model/common/Error';

class LogBusiness implements ILogBusiness {
    private logRepository: LogRepository;

    constructor() {
        this.logRepository = new LogRepository();
    }

    async get(_id: string): Promise<Log | null> {
        if (!_id)
            return null;

        let result = await this.logRepository.get(_id);
        return result && new Log(result);
    }

    async getList(system: string, module: number, method: string, status: number, page: number, limit: number): Promise<Log[]> {
        let params = <any>{query: {}};

        if (system)
            params.query.system = system;

        if (module)
            params.query.system = module;

        if (method)
            params.query.method = method;

        if (status)
            params.query.status = status;

        return await this.logRepository.find(params, {createdAt: -1}, page, limit);
    }
    async create(data: LogCreate): Promise<Log> {
        if (!data)
            throw new ErrorCommon(101, 'Log');

        let result = await this.logRepository.create(data);

        return result && new Log(result);
    }

    async update(_id: string, data: LogUpdate): Promise<Log | null> {
        if (!_id || !data)
            return null;

        let params = {
            query: {
                _id: DataHelper.toObjectId(_id)
            }
        };
        let result = await this.logRepository.findOneAndUpdate(params, data);
        return result && new Log(result);
    }

    async delete(_id: string): Promise<boolean> {
        if (!_id)
            return false;

        return await this.logRepository.delete(_id);
    }

    async deleteMultiple(ids: string[]): Promise<boolean> {
        if (!ids.length)
            return false;

        for (let i = 0; i < ids.length; i++) {
            this.logRepository.delete(ids[i]);
        }

        return true;
    }
}

Object.seal(LogBusiness);
export default LogBusiness;
