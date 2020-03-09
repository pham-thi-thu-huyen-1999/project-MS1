import BaseController from './base/BaseController';
import GroupReportBusiness from '../app/business/GroupReportBusiness';
import IGroupReportBusiness from '../app/business/interfaces/IGroupReportBusiness';

class GroupReportController extends BaseController {
    private groupReportBusiness: IGroupReportBusiness = new GroupReportBusiness();

    constructor() {
        super();

        // this.post('/groups-by-coa', Authenticator.isAuthenticated, this.getGroupsByChartAccounts.bind(this));
        this.post('/', this.create.bind(this));
    }

    // async getGroupsByChartAccounts(req): Promise<any> {
    //     return await this.GroupReportBusiness.getGroupsByChartAccounts(req.body.coaIds);
    // }

    async create(req): Promise<any> {
        return await this.groupReportBusiness.create(req.body);
    }
}

Object.seal(GroupReportController);
export default GroupReportController;
