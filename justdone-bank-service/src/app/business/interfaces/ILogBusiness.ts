import Log from 'justdone-system-package/dest/app/model/log/Log';
import LogCreate from 'justdone-system-package/dest/app/model/log/LogCreate'; // eslint-disable-line

interface ILogBusiness {
    create: (data: LogCreate) => Promise<Log>;
}

export default ILogBusiness;
