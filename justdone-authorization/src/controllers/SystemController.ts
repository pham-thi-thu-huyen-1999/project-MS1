import BaseController from './base/BaseController';
import SystemHelper from 'justdone-system-package/dest/helpers/SystemHelper';
// import {exec} from 'child_process';

class SystemController extends BaseController {
    constructor() {
        super();
        this.get('/getAuthorizationInfor', this.getAuthorizationInfor.bind(this));
    }

    async getAuthorizationInfor(req): Promise<any> {
        return await SystemHelper.getSytemInfo();
    }
}

Object.seal(SystemController);
export default SystemController;
