import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IPermissionBusiness from '../app/business/interfaces/IPermissionBusiness';
import PermissionCreate from 'justdone-system-package/dest/app/model/permission/PermissionCreate';
import PermissionUpdate from 'justdone-system-package/dest/app/model/permission/PermissionUpdate';

class PermissionController extends BaseController {
    private permissionBusiness: IPermissionBusiness = BusinessLoader.permissionBusiness;

    constructor() {
        super();

        /* Begin: Use for Oshin page */
        this.get('/', this.getPermissionPage.bind(this));
        this.get('/list', this.validateData({field: 'module', type: 'NUM'}, {field: 'productCode', type: 'NUM'}), this.getPermissions.bind(this));
        this.get('/all-module', this.getAllModule.bind(this));
        /* End: Use for Oshin page */

        // Export module structure for frontend
        this.get('/all-short-module', this.getAllShortModule.bind(this));

        // Export permission for initData
        this.get('/export', this.validateData({field: 'productCode', type: 'NUM'}), this.exportPermission.bind(this));

        this.get('/:_id', this.getPermission.bind(this));
        this.get('/claim-permissions', this.validateData({field: 'productCode', type: 'NUM'}, {field: 'fromRoleCode', type: 'NUM'}), this.getClaimPermissions.bind(this));
        this.get('/product-codes-permission', this.getProductCodesPermission.bind(this));
        this.get('/role-codes-permission', this.getRoleCodesPermission.bind(this));

        this.post('/check-permission', this.checkPermission.bind(this));
        this.post('/check-real-data-with-cached', this.checkAndCreateDataCaching.bind(this));
        this.post('/', this.createPermission.bind(this));

        this.put('/:_id', this.updatePermission.bind(this));

        this.delete('/:_id', this.deletePermission.bind(this));
    }

    async getPermissionPage(req, res) {
        res.render('system-rule/create.ejs');
    }

    async getPermissions(req): Promise<any> {
        return await this.permissionBusiness.getPermissions(req.query.productCode, req.query.module);
    }

    async getAllModule(req): Promise<any> {
        return await this.permissionBusiness.getAllModule();
    }

    async getPermission(req): Promise<any> {
        return await this.permissionBusiness.get(req.params._id);
    }

    async getAllShortModule(req): Promise<any> {
        return await this.permissionBusiness.getAllShortModule();
    }

    async exportPermission(req): Promise<any> {
        return await this.permissionBusiness.exportPermission(req.query.productCode);
    }

    async getClaimPermissions(req): Promise<any> {
        return await this.permissionBusiness.getClaimPermissions(req.query.productCode, req.query.fromRoleCode);
    }

    async getProductCodesPermission(req): Promise<any> {
        req.query.claimCodes = req.query.claimCodes ? req.query.claimCodes.split(',').map(item => Number(item)) : [];
        req.query.fromRoleCodes = req.query.fromRoleCodes ? req.query.fromRoleCodes.split(',').map(item => Number(item)) : [];
        req.query.toRoleCodes = req.query.toRoleCodes ? req.query.toRoleCodes.split(',').map(item => Number(item)) : null;
        return await this.permissionBusiness.getProductCodesPermission(req.query.claimCodes, req.query.fromRoleCodes, req.query.toRoleCodes);
    }

    async getRoleCodesPermission(req): Promise<any> {
        req.query.claimCodes = req.query.claimCodes ? req.query.claimCodes.split(',').map(item => Number(item)) : [];
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(item => Number(item)) : [];
        req.query.fromRoleCodes = req.query.fromRoleCodes ? req.query.fromRoleCodes.split(',').map(item => Number(item)) : [];
        return await this.permissionBusiness.getRoleCodesPermission(req.query.claimCodes, req.query.productCodes, req.query.fromRoleCodes);
    }

    async checkPermission(req): Promise<any> {
        return await this.permissionBusiness.checkPermission(req.body);
    }

    async checkAndCreateDataCaching(req): Promise<any> {
        return await this.permissionBusiness.checkAndCreateDataCaching(req.body.count);
    }

    async createPermission(req): Promise<any> {
        return await this.permissionBusiness.create(new PermissionCreate(req.body));
    }

    async updatePermission(req): Promise<any> {
        return await this.permissionBusiness.update(req.params._id, new PermissionUpdate(req.body));
    }

    async deletePermission(req): Promise<any> {
        return await this.permissionBusiness.delete(req.params._id);
    }
}

Object.seal(PermissionController);
export default PermissionController;
