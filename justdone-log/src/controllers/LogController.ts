import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import ILogBusiness from '../app/business/interfaces/ILogBusiness';

class LogController extends BaseController {
    private logBusiness: ILogBusiness = BusinessLoader.logBusiness;

    constructor() {
        super();

        this.get('/', this.validatePagination(10), this.getList.bind(this));

        this.post('/', this.create.bind(this));

        this.delete('/:_id', this.delele.bind(this));
        this.delete('/', this.deleteMultiple.bind(this));
    }

    async getList(req): Promise<any> {
        return await this.logBusiness.getList(req.query.system, req.query.module, req.query.method, req.query.status, req.query.page, req.query.limit);
    }

    async create(req): Promise<any> {
        return await this.logBusiness.create(req.body);
    }

    async delele(req): Promise<any> {
        return await this.logBusiness.delete(req.params._id);
    }

    async deleteMultiple(req): Promise<any> {
        req.query.ids = req.query.ids ? req.query.ids.split(',') : [];
        return await this.logBusiness.deleteMultiple(req.query.ids);
    }
}

Object.seal(LogController);
export default LogController;
