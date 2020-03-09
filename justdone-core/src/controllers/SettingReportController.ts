import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import ISettingReportBusiness from '../app/business/interfaces/ISettingReportBusiness';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';// eslint-disable-line
import UserAuthentication from 'justdone-system-package/dest/app/model/user/UserAuthentication'; // eslint-disable-line
// import Project from '../config/Project';
// import Project from '../config/Project';

class SettingReportController extends BaseController {
    private setttingReportBusiness: ISettingReportBusiness = BusinessLoader.settingReportBusiness;

    constructor() {
        super();
        this.get('/config', this.getConfigReport.bind(this));
        this.post('/', this.createSettingReport.bind(this));
    }

    async getConfigReport(req): Promise<any> {
        return await this.setttingReportBusiness.getConfig();
    }

    async createSettingReport(req): Promise<any> {
        return await this.setttingReportBusiness.create({code: req.body.code, groupId: req.body.groupId, reportType: req.body.reportType});
    }
}

Object.seal(SettingReportController);
export default SettingReportController;
