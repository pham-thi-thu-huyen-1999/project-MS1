import BaseController from './base/BaseController';
import InitialData from '../system/InitialData';
import SystemHelper from 'justdone-system-package/dest/helpers/SystemHelper';

class SystemController extends BaseController {
    constructor() {
        super();

        if (process.env.NODE_ENV !== 'Production')
            this.post('/init-data', this.initData.bind(this));
        this.get('/get-log-infor', this.getLogInfor.bind(this));
    }

    async initData(req): Promise<any> {
        await (new InitialData()).init(true);
        return true;
    }

    async getLogInfor(req): Promise<any> {
        return await SystemHelper.getSytemInfo();
    }
}

Object.seal(SystemController);
export default SystemController;
