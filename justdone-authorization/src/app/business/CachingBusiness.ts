import ICachingBusiness from './interfaces/ICachingBusiness'; // eslint-disable-line
import CachingAccess from '../dataAccess/CachingAccess';
import BusinessLoader from '../../system/BusinessLoader';
import AuthorizationHelper from 'justdone-system-package/dest/helpers/AuthorizationHelper';
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
/** PERMISION */
import IPermissionBusiness from './interfaces/IPermissionBusiness'; // eslint-disable-line
import Permission from 'justdone-system-package/dest/app/model/permission/Permission'; // eslint-disable-line
/** PRODUCT */
import IProductBusiness from './interfaces/IProductBusiness'; // eslint-disable-line
import Product from 'justdone-system-package/dest/app/model/product/Product'; // eslint-disable-line
/** ROLE */
import IRoleBusiness from './interfaces/IRoleBusiness'; // eslint-disable-line
import Role from 'justdone-system-package/dest/app/model/role/Role'; // eslint-disable-line
/** USER */
import IUserBusiness from './interfaces/IUserBusiness'; // eslint-disable-line

class CachingBusiness implements ICachingBusiness {
    private permissionRepository: any;
    private productRepository: any;
    private roleRepository: any;
    private userRepository: any;
    private inviteRepository: any;

    constructor() {
        this.permissionRepository = CachingAccess.db.permissions;
        this.productRepository = CachingAccess.db.products;
        this.roleRepository = CachingAccess.db.roles;
        this.userRepository = CachingAccess.db.users;
        this.inviteRepository = CachingAccess.db.invites;
    }

    /** *************************** SYSTEM ***************************** */
    /** ******************************************************************/
    checkAndCreateAllDataCaching(): void {
        this.checkRealDataPermission();
        this.checkRealDataProduct();
        this.checkRealDataRole();
    }

    /** *************************** PERMISSION ***************************** */
    /** *******************************************************************/
    getPermission(_id: string): Promise<Permission | null> {
        return new Promise<Permission>((resolve, reject) => {
            if (!_id)
                return resolve(undefined);

            this.permissionRepository.findOne({_id}, (err, doc) => {
                if (err) {
                    console.log('PermissionBusiness.get\n', err);
                    return resolve();
                }

                if (doc) {
                    doc.cachingExpire = Date.now();
                    this.updatePermission(_id, doc);
                }
                resolve(doc);
            });
        });
    }

    getClaimPermissions(productCode: number, fromRoleCode: number): Promise<Permission[]> {
        return new Promise<Permission[]>((resolve, reject) => {
            if (!productCode || !fromRoleCode)
                return resolve([]);

            let query = {
                product: productCode,
                fromRole: fromRoleCode
            };
            this.permissionRepository.find(query, (err, docs) => {
                if (err) {
                    console.log('PermissionBusiness.getClaimPermissions\n', err);
                    return resolve([]);
                }
                return resolve(docs);
            });
        });
    }

    getProductCodesPermission(claims: number[], fromRoleCodes: number[], toRoleCodes?: number[]): Promise<number[]> {
        return new Promise<number[]>((resolve, reject) => {
            if (!claims || !claims.length || !fromRoleCodes || !fromRoleCodes.length)
                return resolve([]);

            let query = <any>{
                claim: {
                    $in: claims
                },
                fromRole: {
                    $in: fromRoleCodes
                }
            };
            if (toRoleCodes) {
                query.toRole = {
                    $in: toRoleCodes
                };
            }
            this.permissionRepository.find(query, (err, docs) => {
                if (err) {
                    console.log('PermissionBusiness.getProductCodesPermission\n', err);
                    return resolve([]);
                }
                let list: number[] = [];
                for (let doc of docs) {
                    if (!list.find(item => item === doc.product))
                        list.push(doc.product);
                }
                return resolve(list);
            });
        });
    }

    getRoleCodesPermission(claims: number[], productCodes: number[], fromRoleCodes: number[]): Promise<number[]> {
        return new Promise<number[]>((resolve, reject) => {
            if (!claims || !claims.length || !productCodes || !productCodes.length || !fromRoleCodes || !fromRoleCodes.length)
                return resolve([]);

            let query = {
                claim: {
                    $in: claims
                },
                product: {
                    $in: productCodes
                },
                fromRole: {
                    $in: fromRoleCodes
                }
            };
            this.permissionRepository.find(query, (err, docs) => {
                if (err) {
                    console.log('PermissionBusiness.getRoleCodesPermission\n', err);
                    return resolve([]);
                }
                let list: number[] = [];
                for (let doc of docs) {
                    let role;
                    if (doc.toRole === null)
                        role = doc.fromRole;
                    else
                        role = doc.toRole;

                    if (!list.find(item => item === role))
                        list.push(role);
                }
                return resolve(list);
            });
        });
    }

    checkPermission(data: Permission): Promise<Permission | null> {
        return new Promise<Permission | null>((resolve, reject) => {
            if (!data.product || !data.claim || !data.fromRole)
                return resolve(null);

            let query: any = {
                claim: data.claim,
                product: data.product,
                fromRole: data.fromRole
            };
            if (data.toRole || data.toRole === null)
                query.toRole = data.toRole;

            this.permissionRepository.findOne(query, (err, doc) => {
                if (err) {
                    console.log('PermissionBusiness.checkPermission\n', err);
                    return resolve(null);
                }
                return resolve(doc);
            });
        });
    }

    checkRealDataPermission(): void {
        this.permissionRepository.count({}, async (err, count) => {
            if (err)
                console.log('PermissionBusiness.checkRealDataPermission.1\n', err);

            await AuthorizationHelper.post('/api/permission/check-real-data-with-cached', {count}).catch(error => {
                console.log('PermissionBusiness.checkRealDataPermission.2\n', error);
            });
        });
    }

    createMultiplePermissions(data: Permission[]): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!data || !data.length)
                return resolve(false);

            this.deleteAllPermissions().then(() => {
                this.permissionRepository.insert(data, (err, result) => {
                    if (err) {
                        console.log('PermissionBusiness.createMultiplePermissions.1\n', err);
                        return resolve(false);
                    }
                    console.log('\x1b[32m', '\ndata permission caching done.\n', '\x1b[0m');
                    resolve(true);
                });
            }).catch(error => {
                console.log('PermissionBusiness.createMultiplePermissions.2\n', error);
                return resolve(false);
            });
        });
    }

    createPermission(data: Permission): Promise<Permission | null> {
        return new Promise<Permission | null>(async (resolve, reject) => {
            if (!data || !data.product || !data.claim || !data.fromRole)
                return resolve(null);

            let result = await this.checkPermission(data);
            if (!result) {
                this.permissionRepository.insert(data, (err, result) => {
                    if (err) {
                        console.log('PermissionBusiness.create\n', err);
                        return resolve(null);
                    }
                    return resolve(result);
                });
            }
            else
                return resolve(result);
        });
    }

    updatePermission(_id: string, data: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!_id || !data)
                return resolve(false);

            this.permissionRepository.update({_id}, data, (err, numReplaced) => {
                if (err) {
                    console.log('PermissionBusiness.update\n', err);
                    return resolve(false);
                }
                resolve(numReplaced);
            });
        });
    }

    deletePermission(_id: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!_id)
                return resolve(false);

            this.permissionRepository.remove({_id}, {}, (err, numRemoved) => {
                if (err) {
                    console.log('PermissionBusiness.delete\n', err);
                    return resolve(false);
                }
                resolve(numRemoved);
            });
        });
    }

    deleteAllPermissions(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.permissionRepository.remove({}, {multi: true}, (err, numRemoved) => {
                if (err) {
                    console.log('PermissionBusiness.deleteAll\n', err);
                    return resolve(false);
                }
                resolve(numRemoved);
            });
        });
    }
    /** *************************** PRODUCT ***************************** */
    /** *******************************************************************/
    getAllProducts(): Promise<Product[]> {
        return new Promise<Product[]>((resolve, reject) => {
            this.productRepository.find({}).sort({type: 1, code: 1}).exec((err, doc) => {
                if (err) {
                    console.log('ProductBusiness.getAll\n', err);
                    return resolve([]);
                }
                resolve(doc);
            });
        });
    }

    getProduct(_id: string): Promise<Product | null> {
        return new Promise<Product | null>((resolve, reject) => {
            if (!_id)
                return resolve(null);

            this.productRepository.findOne({_id}, (err, doc) => {
                if (err) {
                    console.log('ProductBusiness.get\n', err);
                    return resolve(null);
                }
                resolve(doc);
            });
        });
    }

    getProductByName(name: string): Promise<Product | null> {
        return new Promise<Product | null>((resolve, reject) => {
            if (!name)
                return resolve(null);

            this.productRepository.findOne({name}, (err, doc) => {
                if (err) {
                    console.log('ProductBusiness.getByName\n', err);
                    return resolve(null);
                }
                resolve(doc);
            });
        });
    }

    getProductByCode(code: number): Promise<Product | null> {
        return new Promise<Product | null>((resolve, reject) => {
            if (!code)
                return resolve(null);

            this.productRepository.findOne({code}, (err, doc) => {
                if (err) {
                    console.log('ProductBusiness.getByCode\n', err);
                    return resolve(null);
                }
                resolve(doc);
            });
        });
    }

    getProductsByCodes(codes: number[]): Promise<Product[]> {
        return new Promise<Product[]>((resolve, reject) => {
            if (!codes.length)
                return resolve([]);

            codes = codes.map(code => Number(code));
            let query = {
                code: {
                    $in: codes
                }
            };
            this.productRepository.find(query).sort({type: 1, code: 1}).exec((err, doc) => {
                if (err) {
                    console.log('ProductBusiness.getByCodes\n', err);
                    return resolve([]);
                }
                resolve(doc);
            });
        });
    }

    getProductsByTypes(types: number[]): Promise<Product[]> {
        return new Promise<Product[]>((resolve, reject) => {
            if (!types || !types.length)
                return resolve([]);

            types = types.map(code => Number(code));
            let query = {
                type: {
                    $in: types
                }
            };
            this.productRepository.find(query).sort({type: 1, code: 1}).exec((err, doc) => {
                if (err) {
                    console.log('ProductBusiness.getByTypes\n', err);
                    return resolve([]);
                }
                resolve(doc);
            });
        });
    }

    getProductsByIds(ids: string[]): Promise<Product[]> {
        return new Promise<Product[]>((resolve, reject) => {
            if (!ids.length)
                return resolve([]);
            let query = {
                _id: {
                    $in: ids
                }
            };
            this.productRepository.find(query).sort({type: 1, code: 1}).exec((err, doc) => {
                if (err) {
                    console.log('ProductBusiness.getByIds\n', err);
                    return resolve([]);
                }
                resolve(doc);
            });
        });
    }

    checkRealDataProduct(): void {
        this.productRepository.count({}, async (err, count) => {
            if (err)
                console.log('ProductBusiness.checkRealDataProduct.1\n', err);
            else {
                await AuthorizationHelper.post('/api/product/check-real-data-with-cached', {count}).catch(error => {
                    console.log('ProductBusiness.checkRealDataProduct.2\n', error);
                });
            }
        });
    }

    createMultipleProducts(data: Product[]): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!data || !data.length)
                return resolve(false);

            this.deleteAllProducts().then(() => {
                this.productRepository.insert(data, (err, result) => {
                    if (err) {
                        console.log('ProductBusiness.createMultipleProducts.1\n', err);
                        return resolve(false);
                    }
                    console.log('\x1b[32m', '\ndata product caching done.\n', '\x1b[0m');
                    resolve(true);
                });
            }).catch(error => {
                console.log('ProductBusiness.createMultipleProducts.2\n', error);
                return resolve(false);
            });
        });
    }

    createProduct(data: Product): Promise<Product | null> {
        return new Promise<Product>((resolve, reject) => {
            if (!data || !data._id || !data.name)
                return resolve();

            this.productRepository.findOne({name: data.name}, async (err, doc) => {
                if (err) {
                    console.log('ProductBusiness.create.1\n', err);
                    return resolve();
                }

                if (doc)
                    await this.deleteProduct(doc._id);
                this.productRepository.insert(data, (err, result) => {
                    if (err) {
                        console.log('ProductBusiness.create.2\n', err);
                        return resolve();
                    }
                    resolve(result);
                });
            });
        });
    }

    updateProduct(_id: string, data: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!_id || !data)
                return resolve(null);

            this.productRepository.update({_id}, data, (err, numReplaced) => {
                if (err) {
                    console.log('ProductBusiness.update\n', err);
                    return resolve(null);
                }
                resolve(numReplaced);
            });
        });
    }

    deleteProduct(_id: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!_id)
                return resolve(null);

            this.productRepository.remove({_id}, {}, (err, numRemoved) => {
                if (err) {
                    console.log('ProductBusiness.delete\n', err);
                    return resolve(null);
                }
                resolve(numRemoved);
            });
        });
    }

    deleteAllProducts(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.productRepository.remove({}, {multi: true}, (err, numRemoved) => {
                if (err) {
                    console.log('ProductBusiness.deleteAll\n', err);
                    return resolve(null);
                }
                resolve(numRemoved);
            });
        });
    }

    /** *************************** ROLE ***************************** */
    /** ****************************************************************/
    getAllRoles(): Promise<Role[]> {
        return new Promise<Role[]>((resolve, reject) => {
            this.roleRepository.find({}).sort({level: 1}).exec((err, doc) => {
                if (err) {
                    console.log('RoleBusiness.getAll\n', err);
                    return resolve([]);
                }
                resolve(doc);
            });
        });
    }

    getRole(_id: string): Promise<Role | null> {
        return new Promise<Role | null>((resolve, reject) => {
            if (!_id)
                return resolve(null);

            this.roleRepository.findOne({_id: _id.trim().toString()}, (err, doc) => {
                if (err) {
                    console.log('RoleBusiness.get\n', err);
                    return resolve(null);
                }
                resolve(doc);
            });
        });
    }

    getRolesByIds(ids: string[]): Promise<Role[]> {
        return new Promise<Role[]>((resolve, reject) => {
            if (!ids || !ids.length)
                return resolve([]);

            let query = {
                _id: {
                    $in: ids
                }
            };
            this.roleRepository.find(query).sort({level: 1}).exec((err, doc) => {
                if (err) {
                    console.log('RoleBusiness.getByIds\n', err);
                    return resolve([]);
                }
                resolve(doc);
            });
        });
    }

    getRolesByProductCode(productCode: number): Promise<Role[]> {
        return new Promise<Role[]>((resolve, reject) => {
            if (!productCode)
                return resolve([]);

            return BusinessLoader.productBusiness.getByCode(productCode).then(product => {
                if (!product)
                    return resolve([]);

                this.roleRepository.find({products: product._id}).sort({level: 1}).exec((err, doc) => {
                    if (err) {
                        console.log('RoleBusiness.getByProductCode.1\n', err);
                        return resolve([]);
                    }
                    return resolve(doc);
                });
            }).catch(error => {
                console.log('RoleBusiness.getByProductCode.2\n', error);
                return resolve([]);
            });
        });
    }

    getRoleByName(name: string): Promise<Role | null> {
        return new Promise<Role | null>((resolve, reject) => {
            if (!name)
                return resolve(null);

            this.roleRepository.findOne({name}, (err, doc) => {
                if (err) {
                    console.log('RoleBusiness.getByName\n', err);
                    return resolve(null);
                }
                resolve(doc);
            });
        });
    }

    getRoleByCode(code: number): Promise<Role | null> {
        return new Promise<Role | null>((resolve, reject) => {
            if (!code)
                return resolve(null);

            this.roleRepository.findOne({code}, (err, doc) => {
                if (err) {
                    console.log('RoleBusiness.getByCode\n', err);
                    return resolve(null);
                }
                resolve(doc);
            });
        });
    }

    getRolesByCodes(codes: number[]): Promise<Role[]> {
        return new Promise<Role[]>((resolve, reject) => {
            if (!codes || !codes.length)
                return resolve([]);

            let query = {
                code: {
                    $in: codes
                }
            };
            this.roleRepository.find(query).sort({level: 1}).exec((err, doc) => {
                if (err) {
                    console.log('RoleBusiness.getByCodes\n', err);
                    return resolve([]);
                }
                resolve(doc);
            });
        });
    }

    checkRealDataRole(): void {
        this.roleRepository.count({}, async (err, count) => {
            if (err)
                console.log('RoleBusiness.checkRealDataRole.1\n', err);
            else {
                await AuthorizationHelper.post('/api/role/check-real-data-with-cached', {count}).catch(error => {
                    console.log('RoleBusiness.checkRealDataRole.2\n', error);
                });
            }
        });
    }

    createMultipleRoles(data: Role[]): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!data || !data.length)
                return resolve(false);

            this.deleteAllRoles().then(() => {
                this.roleRepository.insert(data, (err, result) => {
                    if (err) {
                        console.log('RoleBusiness.createMultipleRoles.1\n', err);
                        return resolve(false);
                    }
                    console.log('\x1b[32m', '\ndata role caching done.\n', '\x1b[0m');
                    resolve(true);
                });
            }).catch(error => {
                console.log('RoleBusiness.createMultipleRoles.2\n', error);
                return resolve(false);
            });
        });
    }

    createRole(data: Role): Promise<Role | null> {
        return new Promise<Role | null>((resolve, reject) => {
            if (!data || !data.name || !data.level)
                return resolve(null);

            this.roleRepository.findOne({name: data.name}, async (err, doc) => {
                if (err) {
                    console.log('RoleBusiness.create.1\n', err);
                    return resolve(null);
                }

                if (doc)
                    await this.deleteRole(doc._id);
                this.roleRepository.insert(data, (err, result) => {
                    if (err) {
                        console.log('RoleBusiness.create.2\n', err);
                        return resolve(null);
                    }
                    resolve(result);
                });
            });
        });
    }

    updateRole(_id: string, data: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!_id || !data)
                return resolve(null);

            this.roleRepository.update({_id}, data, (err, numReplaced) => {
                if (err) {
                    console.log('RoleBusiness.update\n', err);
                    return resolve(null);
                }
                resolve(numReplaced);
            });
        });
    }

    deleteRole(_id: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!_id)
                return resolve(null);

            this.roleRepository.remove({_id}, {}, (err, numRemoved) => {
                if (err) {
                    console.log('RoleBusiness.delete\n', err);
                    return resolve(null);
                }
                resolve(numRemoved);
            });
        });
    }

    deleteAllRoles(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.roleRepository.remove({}, {multi: true}, (err, numRemoved) => {
                if (err) {
                    console.log('RoleBusiness.deleteAll\n', err);
                    return resolve(null);
                }
                resolve(numRemoved);
            });
        });
    }

    /** *************************** USER ***************************** */
    /** ****************************************************************/
    getUser(_id: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!_id)
                return resolve(null);

            this.userRepository.findOne({_id}, (err, doc) => {
                if (err)
                    return reject(err);

                if (doc) {
                    doc.cachingExpire = Date.now();
                    this.updateUser(_id, doc);
                }
                resolve(doc);
            });
        });
    }

    getByToken(token: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!token)
                return resolve(null);

            this.userRepository.findOne({
                'token.accessToken': token,
            }, async (err, doc) => {
                if (err)
                    return reject(err);

                if (doc) {
                    doc.cachingExpire = new Date();
                    await this.updateUser(doc._id, doc);
                }
                return resolve(doc);
            });
        });
    }

    getByEmail(email: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!email)
                return resolve(null);

            email = email.trim().toLowerCase();
            this.userRepository.findOne({email}, (err, doc) => {
                if (err)
                    return reject(err);

                if (doc) {
                    doc.cachingExpire = Date.now();
                    this.updateUser(doc._id, doc);
                }
                resolve(doc);
            });
        });
    }

    getInvite(_id: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!_id)
                return resolve(null);

            this.inviteRepository.findOne({_id}, async (err, doc) => {
                if (err)
                    return reject(err);

                if (doc) {
                    if (isExpired(doc.cachingExpire)) {
                        await this.deleteInvite(doc._id);
                        return resolve('This invitation has expired!');
                    }
                    return resolve(doc);
                }
                return resolve(null);
            });
        });
    }

    getInviteByToken(token: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            if (!token)
                return resolve(null);

            let param = {
                token,
            };

            this.inviteRepository.findOne(param, async (err, doc) => {
                if (err)
                    return reject(err);

                if (doc) {
                    if (isExpired(doc.cachingExpire)) {
                        await this.deleteInvite(doc._id);
                        return resolve('This invitation has expired!');
                    }
                    return resolve(doc);
                }
                return resolve(null);
            });
        });
    }

    verifyInvite(inviterId: string, token: string): Promise<boolean> {
        return new Promise<any>((resolve, reject) => {
            if (!token || !inviterId)
                return resolve(false);

            let param = {
                inviterId,
                token
            };

            this.inviteRepository.findOne(param, async (err, doc) => {
                if (err)
                    return reject(false);

                if (doc) {
                    if (isExpired(doc.cachingExpire)) {
                        await this.deleteInvite(doc._id);
                        return resolve(false);
                    }
                    return resolve(true);
                }
                return resolve(false);
            });
        });
    }

    expireInvite(inviterId: string, token: string): Promise<boolean> {
        return new Promise<any>((resolve, reject) => {
            if (!token || !inviterId)
                return resolve(false);

            let param = {
                inviterId,
                token
            };

            this.inviteRepository.remove(param, {}, (err, numRemoved) => {
                if (err)
                    return reject(false);
                return resolve(true);
            });
        });
    }

    createUser(data: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!data)
                return resolve(null);
            if (!data._id)
                return reject(new ErrorCommon(101, 'Data'));

            this.userRepository.findOne({email: data.email}, async (err, doc) => {
                if (err)
                    return reject(err);

                data.cachingExpire = Date.now();
                if (doc)
                    await this.deleteUser(doc._id);

                this.userRepository.insert(data, (err, result) => {
                    if (err)
                        return reject(err);
                    return resolve(result);
                });
            });
        });
    }

    createInvite(data: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            if (!data || !validateInvites(data))
                return resolve(null);

            data.cachingExpire = addMinute(15);

            this.inviteRepository.insert(data, (err, result) => {
                if (err)
                    return reject(err);
                return resolve(result);
            });
        });
    }

    createMultipleInvites(data: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            let invites: any = [];
            if (!data || !data.length)
                return reject(new ErrorCommon(101, 'Data'));
            let index = 0;
            do {
                try {
                    let invite = await this.createInvite(data[index]);
                    if (invite)
                        invites.push(invite);
                }
                catch (error) {
                    console.log(`Error create invite for userId: ${data.inviterId}, invite: ${index}`);
                }
                index += 1;
            } while (index < data.length);
            return resolve(invites);
        });
    }

    updateUser(_id: string, data: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!_id || !data)
                return resolve(null);

            this.userRepository.update({_id}, data, (err, numReplaced) => {
                if (err)
                    return reject(err);
                resolve(numReplaced);
            });
        });
    }

    updateInvite(_id: string, data: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!_id || !data)
                return resolve(null);

            this.inviteRepository.update({_id}, data, (err, numReplaced) => {
                if (err)
                    return reject(err);
                resolve(numReplaced);
            });
        });
    }

    deleteUser(_id: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!_id)
                return resolve(null);

            this.userRepository.remove({_id}, {}, (err, numRemoved) => {
                if (err)
                    return reject(err);
                resolve(numRemoved);
            });
        });
    }

    deleteAllUsers(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.userRepository.remove({}, {multi: true}, (err, numRemoved) => {
                if (err)
                    return reject(err);
                resolve(numRemoved);
            });
        });
    }

    deleteInvite(_id: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!_id)
                return resolve(null);

            this.inviteRepository.remove({_id}, {}, (err, numRemoved) => {
                if (err)
                    return reject(err);
                resolve(numRemoved);
            });
        });
    }

    updateLastAccessUser(_id: string, lastAccess: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!_id)
                return resolve(null);
            this.userRepository.update({_id}, {$set: {lastAccess: lastAccess}}, {}, (err, numReplaced) => {
                if (err)
                    return reject(err);
                // resolve(numReplaced);
            });
            this.userRepository.findOne({_id}, (err, doc) => {
                if (err)
                    return reject(err);
                resolve(doc);
            });
        });
    }

    removeExpiredInvites(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let validTime = new Date();
            let param = {
                cachingExpire: {
                    $lt: validTime
                }
            };
            this.inviteRepository.remove(param, {}, (err, numRemoved) => {
                if (err)
                    return reject(err);
                console.log(`Removed ${numRemoved} expired invites!`);
                resolve(numRemoved);
            });
        });
    }
}

function isExpired(data: any): boolean {
    try {
        let t1 = new Date(data).getTime();
        let t2 = new Date().getTime();
        if (t1 < t2)
            return true;
        return false;
    }
    catch (error) {
        return false;
    }
}

function validateInvites(data: any): boolean {
    if (!data)
        return false;
    if (!data.token || !data.inviterId)
        return false;
    return true;
}

function addMinute(minute: number) {
    let date = new Date();
    date.setMinutes(date.getMinutes() + Number(minute));
    return date;
}

Object.seal(CachingBusiness);
export default CachingBusiness;
