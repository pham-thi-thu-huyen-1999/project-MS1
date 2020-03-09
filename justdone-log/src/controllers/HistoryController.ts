import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IHistoryBusiness from '../app/business/interfaces/IHistoryBusiness';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';

class HistoryController extends BaseController {
    private historyBusiness: IHistoryBusiness = BusinessLoader.historyBusiness;

    constructor() {
        super();

        this.get('/', this.validatePagination(10), this.getList.bind(this));
        this.get('/count', this.getCountByUserId.bind(this));
        this.get('/list-sign-in', this.getListSignIn.bind(this));

        this.post('/', this.create.bind(this));

        this.delete('/:_id', this.delele.bind(this));
        this.delete('/', this.deleteMultiple.bind(this));
    }

    async getList(req): Promise<any> {
        return await this.historyBusiness.getList(req[Authenticator.userKey]._id, Number(req.query.claim), Number(req.query.status), req.query.page, req.query.limit);
    }

    async getCountByUserId(req): Promise<any> {
        return await this.historyBusiness.getCountByUserId(req[Authenticator.userKey]._id);
    }

    async getListSignIn(req): Promise<any[]> {
        return await this.historyBusiness.getListSignIn(req[Authenticator.userKey]._id, Number(req.query.isChoice), Number(req.query.productCode));
    }

    async create(req): Promise<any> {
        return await this.historyBusiness.create(req.body);
    }

    async delele(req): Promise<any> {
        return await this.historyBusiness.delete(req.params._id);
    }

    async deleteMultiple(req): Promise<any> {
        req.query.ids = req.query.ids ? req.query.ids.split(',') : [];
        return await this.historyBusiness.deleteMultiple(req.query.ids);
    }
}

Object.seal(HistoryController);
export default HistoryController;
