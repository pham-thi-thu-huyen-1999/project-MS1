import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IRoleBusiness from '../app/business/interfaces/IRoleBusiness';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';

class RoleController extends BaseController {
    private roleBusiness: IRoleBusiness = BusinessLoader.roleBusiness;

    constructor() {
        super();
        this.get('/', Authenticator.isAuthenticated, this.getRoleLookup.bind(this));
        // this.post('/get-by-codes', this.getByCodes.bind(this));
    }

    async getRoleLookup(req): Promise<any> {
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(productCode => Number(productCode)) : [];
        req.query.roleCodes = req.query.roleCodes ? req.query.roleCodes.split(',').map(roleCode => Number(roleCode)) : [];
        return await this.roleBusiness.getRoleLookup(req[Authenticator.userKey]._id, req.query.productCodes, req.query.roleCodes);
    }

    // async getByCodes(req): Promise<any> {
    //     return await this.roleBusiness.getByCodes(req.body.codes);
    // }
}

Object.seal(RoleController);
export default RoleController;
