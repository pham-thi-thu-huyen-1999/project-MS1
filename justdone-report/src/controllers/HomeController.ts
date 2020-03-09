import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IAnalyticBussiness from '../app/business/interfaces/IAnalyticBusiness'; // eslint-disable-line

class HomeController extends BaseController {
    private analyticBusiness: IAnalyticBussiness = BusinessLoader.analyticBusiness;

    constructor() {
        super();

        this.get('/', this.getAnalyticAccessPage.bind(this));
    }

    async getAnalyticAccessPage(req, res) {
        let data = await this.analyticBusiness.getAnalyticAccess();
        res.render('analytic-access', {data});
    }
}

Object.seal(HomeController);
export default HomeController;
