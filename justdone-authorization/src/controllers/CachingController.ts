import Permission from 'justdone-system-package/dest/app/model/permission/Permission'; // eslint-disable-line
import CustomPermission from 'justdone-system-package/dest/app/model/permission/CustomPermission'; // eslint-disable-line
import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import SystemHelper from 'justdone-system-package/dest/helpers/SystemHelper';

class CachingController extends BaseController {
    constructor() {
        super();
        // Permission
        this.get('/permission/:_id', this.getPermissionById.bind(this));
        this.get('/permission/claim-permissions', this.validateData({field: 'productCode', type: 'NUM'}, {field: 'fromRoleCode', type: 'NUM'}), this.getClaimPermissions.bind(this));
        this.get('/permission/product-codes-permission', this.getProductCodesPermission.bind(this));
        this.get('/permission/role-codes-permission', this.getRoleCodesPermission.bind(this));
        // Product
        this.get('/product/all', this.getAllProducts.bind(this));
        this.get('/product/:_id', this.getProductById.bind(this));
        this.get('/product/name', this.getProductByName.bind(this));
        this.get('/product/code', this.getProductByCode.bind(this));
        this.get('/product/codes', this.getProductsByCodes.bind(this));
        this.get('/product/types', this.getByTypes.bind(this));
        this.get('/product/get-by-ids', this.getProductsByIds.bind(this));
        // Role
        this.get('/role/all', this.getAllRoles.bind(this));
        this.get('/role/ids', this.getRolesByIds.bind(this));
        this.get('/role/product-code', this.getRolesByProductCode.bind(this));
        this.get('/role/name', this.getRoleByName.bind(this));
        this.get('/role/code', this.getRoleByCode.bind(this));
        this.get('/role/codes', this.getRolesByCodes.bind(this));
        // System
        this.get('/getDataCachingInfor', this.getDataCachingInfor.bind(this));
        // User
        this.get('/user/:_id', this.getUserById.bind(this));
        this.get('/user/access-token', this.getUserByToken.bind(this));
        this.get('/user/email', this.getByEmail.bind(this));
        this.get('/user/invite/:_id', this.getUserInvite.bind(this));
        this.get('/user/invite/token', this.getUserInviteByToken.bind(this));

        // Permission
        this.post('/permission/check-permission', this.checkPermission.bind(this));
        this.post('/permission/multiple', this.createMultiplePermissions.bind(this));
        this.post('/permission', this.createPermission.bind(this));
        // Product
        this.post('/product/multiple', this.createMultipleProducts.bind(this));
        this.post('/product', this.createProduct.bind(this));
        // Role
        this.post('/role/multiple', this.createMultipleRoles.bind(this));
        this.post('/role', this.createRole.bind(this));
        // System
        this.post('/check-and-create-all-data-caching', this.checkAndCreateAllDataCaching.bind(this));
        // User
        this.post('/user', this.createUser.bind(this));
        this.post('/user/invite', this.createUserInvite.bind(this));
        this.post('/user/verify-invite', this.verifyUserInvite.bind(this));
        this.post('/user/expire-invite', this.expireUserInvite.bind(this));
        this.post('/user/multiple-invites', this.createMultipleUserInvite.bind(this));
        this.post('/lastAccess/:_id', this.validateData({target: 'body', field: 'lastAccess', type: 'DATE'}), this.updateLastAccessUser.bind(this));

        // Permission
        this.put('/permission/:_id', this.updatePermission.bind(this));
        // Product
        this.put('/product/:_id', this.updateProduct.bind(this));
        // Role
        this.put('/role/:_id', this.updateRole.bind(this));
        // User
        this.put('/user/:_id', this.updateUser.bind(this));
        this.put('/invite/:_id', this.updateUserInvite.bind(this));

        // Permission
        this.delete('/permission/:_id', this.deletePermission.bind(this));
        this.delete('/permission/all', this.deleteAllPermission.bind(this));
        // Product
        this.delete('/product/:_id', this.deleteProduct.bind(this));
        this.delete('/product/all', this.deleteAllProducts.bind(this));
        // Role
        this.delete('/role/:_id', this.deleteRole.bind(this));
        this.delete('/role/all', this.deleteAllRole.bind(this));
        // User
        this.delete('/user/:_id', this.deleteUser.bind(this));
        this.delete('/user/all', this.deleteAllUser.bind(this));
        this.delete('/user/invite/:_id', this.deleteUserInvite.bind(this));
    }
    /** *************************** PERMISSION ***************************** */
    /** ******************************************************************** */
    async getPermissionById(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.getPermission(req.params._id);
    }

    async getClaimPermissions(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.getClaimPermissions(req.query.productCode, req.query.fromRoleCode);
    }

    async getProductCodesPermission(req): Promise<any> {
        req.query.claimCodes = req.query.claimCodes ? req.query.claimCodes.split(',').map(item => Number(item)) : [];
        req.query.fromRoleCodes = req.query.fromRoleCodes ? req.query.fromRoleCodes.split(',').map(item => Number(item)) : [];
        req.query.toRoleCodes = req.query.toRoleCodes ? req.query.toRoleCodes.split(',').map(item => Number(item)) : null;
        return await BusinessLoader.cachingBusiness.getProductCodesPermission(req.query.claimCodes, req.query.fromRoleCodes, req.query.toRoleCodes);
    }

    async getRoleCodesPermission(req): Promise<any> {
        req.query.claimCodes = req.query.claimCodes ? req.query.claimCodes.split(',').map(item => Number(item)) : [];
        req.query.productCodes = req.query.productCodes ? req.query.productCodes.split(',').map(item => Number(item)) : [];
        req.query.fromRoleCodes = req.query.fromRoleCodes ? req.query.fromRoleCodes.split(',').map(item => Number(item)) : [];
        return await BusinessLoader.cachingBusiness.getRoleCodesPermission(req.query.claimCodes, req.query.productCodes, req.query.fromRoleCodes);
    }

    async checkPermission(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.checkPermission(req.body);
    }

    async createPermission(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.createPermission(req.body);
    }

    async createMultiplePermissions(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.createMultiplePermissions(req.body);
    }

    async updatePermission(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.updatePermission(req.params._id, req.body);
    }

    async deletePermission(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.deletePermission(req.params._id);
    }

    async deleteAllPermission(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.deleteAllPermissions();
    }

    /** *************************** PRODUCT ***************************** */
    /** *******************************************************************/
    async getAllProducts(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.getAllProducts();
    }

    async getProductById(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.getProduct(req.params._id);
    }

    async getProductByName(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.getProductByName(req.query.name);
    }

    async getProductByCode(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.getProductByCode(Number(req.query.code));
    }

    async getProductsByCodes(req): Promise<any> {
        req.query.codes = req.query.codes ? req.query.codes.split(',').map(item => Number(item)) : [];
        return await BusinessLoader.cachingBusiness.getProductsByCodes(req.query.codes);
    }

    async getByTypes(req): Promise<any> {
        req.query.types = req.query.types ? req.query.types.split(',').map(item => Number(item)) : [];
        return await BusinessLoader.cachingBusiness.getProductsByTypes(req.query.types);
    }

    async getProductsByIds(req): Promise<any> {
        req.query.ids = req.query.ids ? req.query.ids.split(',') : [];
        return await BusinessLoader.cachingBusiness.getProductsByIds(req.query.ids);
    }

    async createMultipleProducts(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.createMultipleProducts(req.body);
    }

    async createProduct(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.createProduct(req.body);
    }

    async updateProduct(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.updateProduct(req.params._id, req.body);
    }

    async deleteProduct(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.deleteProduct(req.params._id);
    }

    async deleteAllProducts(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.deleteAllProducts();
    }

    /** *************************** ROLE ***************************** */
    /** ****************************************************************/
    async getAllRoles(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.getAllRoles();
    }

    async getRolesByIds(req): Promise<any> {
        req.query.ids = req.query.ids ? req.query.ids.split(',') : [];
        return await BusinessLoader.cachingBusiness.getRolesByIds(req.query.ids);
    }

    async getRolesByProductCode(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.getRolesByProductCode(Number(req.query.productCode));
    }

    async getRoleByName(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.getRoleByName(req.query.name);
    }

    async getRoleByCode(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.getRoleByCode(Number(req.query.code));
    }

    async getRolesByCodes(req): Promise<any> {
        req.query.codes = req.query.codes ? req.query.codes.split(',').map(item => Number(item)) : [];
        return await BusinessLoader.cachingBusiness.getRolesByCodes(req.query.codes);
    }

    async createMultipleRoles(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.createMultipleRoles(req.body);
    }

    async createRole(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.createRole(req.body);
    }

    async updateRole(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.updateRole(req.params._id, req.body);
    }

    async deleteRole(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.deleteRole(req.params._id);
    }

    async deleteAllRole(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.deleteAllRoles();
    }

    /** *************************** SYSTEM ***************************** */
    /** ****************************************************************/
    checkAndCreateAllDataCaching(req): any {
        return BusinessLoader.cachingBusiness.checkAndCreateAllDataCaching();
    }

    async getDataCachingInfor(req): Promise<any> {
        return await SystemHelper.getSytemInfo();
    }
    /** *************************** USER ***************************** */
    /** ****************************************************************/
    async getUserById(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.getUser(req.params._id);
    }

    async getUserByToken(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.getByToken(req.query.token);
    }

    async getByEmail(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.getByEmail(req.query.email);
    }

    async getUserInvite(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.getInvite(req.params._id);
    }

    async getUserInviteByToken(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.getInviteByToken(req.query.token);
    }

    async verifyUserInvite(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.verifyInvite(req.body.inviterId, req.body.token);
    }

    async expireUserInvite(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.expireInvite(req.body.inviterId, req.body.token);
    }

    async createUser(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.createUser(req.body);
    }

    async createMultipleUserInvite(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.createMultipleInvites(req.body);
    }

    async createUserInvite(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.createInvite(req.body);
    }

    async updateUser(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.updateUser(req.params._id, req.body);
    }

    async updateLastAccessUser(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.updateLastAccessUser(req.params._id, req.body.lastAccess);
    }

    async updateUserInvite(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.updateInvite(req.params._id, req.body);
    }

    async deleteUser(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.deleteUser(req.params._id);
    }

    async deleteAllUser(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.deleteAllUsers();
    }

    async deleteUserInvite(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.deleteInvite(req.params._id);
    }
}

Object.seal(CachingController);
export default CachingController;
