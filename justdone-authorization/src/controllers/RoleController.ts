import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IRoleBusiness from '../app/business/interfaces/IRoleBusiness';

class RoleController extends BaseController {
    private roleBusiness: IRoleBusiness = BusinessLoader.roleBusiness;

    constructor() {
        super();

        this.get('/all', this.getAll.bind(this));
        this.get('/codes', this.getRolesByCodes.bind(this));
        this.get('/product-code', this.getByProductCode.bind(this));
        this.post('/check-real-data-with-cached', this.checkAndCreateDataCaching.bind(this));
    }

    async getAll(req): Promise<any> {
        return await this.roleBusiness.getAll();
    }

    async getRolesByCodes(req): Promise<any> {
        req.query.codes = req.query.codes ? req.query.codes.split(',').map(item => Number(item)) : [];
        return await this.roleBusiness.getByCodes(req.query.codes);
    }

    async getByProductCode(req): Promise<any> {
        return await this.roleBusiness.getByProductCode(Number(req.query.productCode));
    }

    async checkAndCreateDataCaching(req): Promise<any> {
        return await this.roleBusiness.checkAndCreateDataCaching(req.body.count);
    }
}

Object.seal(RoleController);
export default RoleController;
