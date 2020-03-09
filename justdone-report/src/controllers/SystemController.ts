import BaseController from './base/BaseController';
import SystemHelper from 'justdone-system-package/dest/helpers/SystemHelper';
// import {exec} from 'child_process';

class SystemController extends BaseController {
    constructor() {
        super();
        this.get('/get-report-infor', this.getReportInfor.bind(this));
    }

    async getReportInfor(req): Promise<any> {
        return await SystemHelper.getSytemInfo();
    }
}

Object.seal(SystemController);
export default SystemController;
