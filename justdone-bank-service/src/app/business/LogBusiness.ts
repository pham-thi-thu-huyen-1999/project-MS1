import Log from 'justdone-system-package/dest/app/model/log/Log';
import LogCreate from 'justdone-system-package/dest/app/model/log/LogCreate'; // eslint-disable-line
import ILogBusiness from './interfaces/ILogBusiness'; // eslint-disable-line
import LogRepository from 'justdone-system-package/dest/app/repository/LogRepository';

class LogBusiness implements ILogBusiness {
    private logRepository: LogRepository;

    constructor() {
        this.logRepository = new LogRepository();
    }

    async create(data: LogCreate): Promise<Log> {
        let log;
        log = await this.logRepository.create(data);

        return log && new Log(log);
    }
}

Object.seal(LogBusiness);
export default LogBusiness;
