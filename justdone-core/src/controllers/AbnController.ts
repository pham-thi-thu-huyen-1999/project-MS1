import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IAbnBusiness from '../app/business/interfaces/IAbnBusiness';
import Authenticator from 'justdone-system-package/dest/system/Authenticator'; // eslint-disable-line

class AbnController extends BaseController {
    private abnBusiness: IAbnBusiness = BusinessLoader.abnBusiness;

    constructor() {
        super();

        this.get('/abn-lookup', this.lookupABN.bind(this));
        this.get('/abn-uk-lookup', this.lookupUKABN.bind(this));
    }

    async lookupABN(req): Promise<any> {
        // let productCodeAuth = req[Authenticator.userKey].permission.product.code;
        // let fromRoleCodeAuth = req[Authenticator.userKey].permission.role.code;

        // return await this.abnBusiness.abnLookUp(productCodeAuth, fromRoleCodeAuth, req.query.keyword);

        // alow this abn vi precis khong yeu cau user register
        return await this.abnBusiness.abnLookUp(1, 1, req.query.keyword);
    }

    async lookupUKABN(req): Promise<any> {
        return await this.abnBusiness.abnUKLookUp(req.query.keyword);
    }
}

Object.seal(AbnController);
export default AbnController;
