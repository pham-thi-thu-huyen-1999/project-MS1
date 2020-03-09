import ILog from '../model/log/interfaces/ILog'; // eslint-disable-line
import LogSchema from '../dataAccess/schemas/LogSchema';
import BaseRepository from './base/BaseRepository';
import LogCreate from '../model/log/LogCreate'; // eslint-disable-line
import LogUpdate from '../model/log/LogUpdate'; // eslint-disable-line

class LogRepository extends BaseRepository<ILog> {
    constructor() {
        super(LogSchema);
    }

    async create(data: LogCreate): Promise<ILog> {
        return await super.create(data);
    }

    async update(_id: string, data: LogUpdate): Promise<boolean> {
        return await super.update(_id, data);
    }
}

Object.seal(LogRepository);
export default LogRepository;
