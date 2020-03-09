import BaseController from './base/BaseController';
import SystemHelper from 'justdone-system-package/dest/helpers/SystemHelper';

class SystemController extends BaseController {
    constructor() {
        super();
        this.get('/get-bank-infor', this.getBankInfor.bind(this));
    }

    async getBankInfor(req): Promise<any> {
        return await SystemHelper.getSytemInfo();
    }
}

Object.seal(SystemController);
export default SystemController;
