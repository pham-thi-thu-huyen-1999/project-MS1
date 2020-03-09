import ILog from '../model/log/interfaces/ILog';
import BaseRepository from './base/BaseRepository';
import LogCreate from '../model/log/LogCreate';
import LogUpdate from '../model/log/LogUpdate';
declare class LogRepository extends BaseRepository<ILog> {
    constructor();
    create(data: LogCreate): Promise<ILog>;
    update(_id: string, data: LogUpdate): Promise<boolean>;
}
export default LogRepository;
