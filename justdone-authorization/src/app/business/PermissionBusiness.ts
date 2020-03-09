import * as fs from 'fs';
import BusinessLoader from '../../system/BusinessLoader'; // eslint-disable-line
import IPermissionBusiness from './interfaces/IPermissionBusiness'; // eslint-disable-line
import PermissionRepository from 'justdone-system-package/dest/app/repository/PermissionRepository';
import Permission from 'justdone-system-package/dest/app/model/permission/Permission'; // eslint-disable-line
import ClaimPermission from 'justdone-system-package/dest/app/model/permission/ClaimPermission'; // eslint-disable-line
import PermissionCreate from 'justdone-system-package/dest/app/model/permission/PermissionCreate'; // eslint-disable-line
import PermissionUpdate from 'justdone-system-package/dest/app/model/permission/PermissionUpdate'; // eslint-disable-line
import CustomPermission from 'justdone-system-package/dest/app/model/permission/CustomPermission'; // eslint-disable-line
import User from 'justdone-system-package/dest/app/model/user/User'; // eslint-disable-line
import {RoleCode, ProductType} from 'justdone-system-package/dest/app/model/common/CommonType';
import module from 'justdone-system-package/dest/resources/permission/module';
import CachingHelper from 'justdone-system-package/dest/helpers/CachingHelper';

class PermissionBusiness implements IPermissionBusiness {
    private permissionRepository: PermissionRepository;

    constructor() {
        this.permissionRepository = new PermissionRepository();
    }

    // Use for permission defination page (not use data caching)
    async getPermissions(productCode?: number, moduleCode?: number): Promise<Permission[]> {
        let modulesObject = module;
        if (Object.keys(modulesObject).length <= 0)
            return [];

        let param = {
            query: <any>{
                product: productCode,
            },
        };

        if (moduleCode)
            param.query.claim = {$gt: moduleCode, $lt: (moduleCode + 1000)};

        let permissionDB = await this.permissionRepository.findAll(param);
        // storage caching
        CachingHelper.post('/check-and-create-all-data-caching').catch(error => {
            console.log('server.checkAndCreateAllDataCaching\n', error);
        });
        return Permission.parseArray(permissionDB);
    }

    async get(_id: string): Promise<Permission | null> {
        if (!_id)
            return null;

        let permission;
        try {
            permission = await CachingHelper.get(`/permission/${_id}`);
        }
        catch (error) {
            console.log('PermissionBusiness.get.1\n', error);
            permission = await this.permissionRepository.get(_id).catch(error => {
                console.log('PermissionBusiness.get.2\n', error);
                return Promise.resolve(null);
            });
        }
        return permission && new Permission(permission);
    }

    async checkPermission(data: any): Promise<boolean> {
        if (!data || !data.product || !data.claim || !data.fromRole)
            return false;

        let permission;
        try {
            permission = await CachingHelper.post(`/permission/check-permission`, data);
        }
        catch (error) {
            console.log('PermissionBusiness.checkPermission.1\n', error);
            let param = {
                query: <any> {
                    product: data.product,
                    claim: data.claim,
                    fromRole: data.fromRole,
                }
            };
            if (data.toRole || data.toRole === null)
                param.query.toRole = data.toRole;

            permission = await this.permissionRepository.findOne(param).catch(error => {
                console.log('PermissionBusiness.checkPermission.2\n', error);
                return Promise.resolve(null);
            });
        }
        return permission ? true : false;
    }

    async getAllModule(): Promise<any> {
        let modulesObject = module;
        if (Object.keys(modulesObject).length <= 0)
            return;
        let roles = await BusinessLoader.roleBusiness.getAll();

        Object.keys(modulesObject).forEach(m => {
            Object.keys(modulesObject[m].claim).forEach(c => {
                if (!modulesObject[m].claim[c] || !modulesObject[m].claim[c].roleCodes) {
                    // console.log(c);
                    // console.log(modulesObject[m].claim[c]);
                    delete modulesObject[m].claim[c];
                }
                else {
                    for (let i = 0; i < modulesObject[m].claim[c].roleCodes.length; i++) {
                        let role = roles.find(r => r.code === modulesObject[m].claim[c].roleCodes[i]);
                        if (role)
                            modulesObject[m].claim[c].roleCodes[i] = role;
                        else if (modulesObject[m].claim[c].roleCodes[i] === RoleCode.Self)
                            modulesObject[m].claim[c].roleCodes[i] = {name: 'Self', code: null};
                    }
                }
            });
        });
        return modulesObject;
    }

    async getClaimPermissions(productCode: number, fromRoleCode: number): Promise<ClaimPermission[]> {
        if (!productCode || !fromRoleCode)
            return [];

        let permissions = <any[]>[];
        try {
            permissions = await CachingHelper.get(`/permission/claim-permissions?productCode=${productCode}&fromRoleCode=${fromRoleCode}`);
        }
        catch (error) {
            console.log('PermissionBusiness.getClaimPermissions.1\n', error);
            let param = {
                query: {
                    product: productCode,
                    fromRole: fromRoleCode
                }
            };
            permissions = await this.permissionRepository.findAll(param).catch(error => {
                console.log('PermissionBusiness.getClaimPermissions.2\n', error);
                return Promise.resolve([]);
            });
        }
        permissions = ClaimPermission.parseArray(permissions);
        permissions.forEach(permisison => {
            delete permisison._id;
        });
        return permissions;
    }

    async getProductCodesPermission(claimCodes: number[], fromRoleCodes: number[], toRoleCodes?: number[]): Promise<number[]> {
        if (!claimCodes || !claimCodes.length || !fromRoleCodes || !fromRoleCodes.length)
            return [];

        let productCodes = <number[]>[];
        try {
            productCodes = await CachingHelper.get(`/permission/product-codes-permission?claimCodes=${claimCodes.join(',')}&fromRoleCodes=${fromRoleCodes.join(',')}&toRoleCodes=${toRoleCodes ? toRoleCodes.join(',') : ''}`);
        }
        catch (error) {
            console.log('PermissionBusiness.getProductCodesPermission.1\n', error);
            let param = {
                query: <any>{
                    claim: {
                        $in: claimCodes
                    },
                    fromRole: {
                        $in: fromRoleCodes
                    }
                }
            };
            if (toRoleCodes) {
                param.query.toRole = {
                    $in: toRoleCodes
                };
            }
            productCodes = await this.permissionRepository.findAll(param).then(docs => {
                let list: number[] = [];
                for (let doc of docs) {
                    if (!list.find(item => item === doc.product))
                        list.push(doc.product);
                }
                return Promise.resolve(list);
            }).catch(error => {
                console.log('PermissionBusiness.getProductCodesPermission.2\n', error);
                return Promise.resolve([]);
            });
        }
        return productCodes;
    }

    async getRoleCodesPermission(claimCodes: number[], productCodes: number[], fromRoleCodes: number[]): Promise<number[]> {
        if (!claimCodes || !claimCodes.length || !productCodes || !productCodes.length || !fromRoleCodes || !fromRoleCodes.length)
            return [];

        let roleCodes = <number[]>[];
        try {
            roleCodes = await CachingHelper.get(`/permission/role-codes-permission?claimCodes=${claimCodes.join(',')}&productCodes=${productCodes.join(',')}&fromRoleCodes=${fromRoleCodes.join(',')}`);
        }
        catch (error) {
            console.log('PermissionBusiness.getRoleCodesPermission.1\n', error);
            let param = {
                query: {
                    claim: {
                        $in: claimCodes
                    },
                    product: {
                        $in: productCodes
                    },
                    fromRole: {
                        $in: fromRoleCodes
                    }
                }
            };
            roleCodes = await this.permissionRepository.findAll(param).then(docs => {
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
                return Promise.resolve(list);
            }).catch(error => {
                console.log('PermissionBusiness.getRoleCodesPermission.2\n', error);
                return Promise.resolve([]);
            });
        }
        return roleCodes;
    }

    async getAllShortModule(): Promise<boolean> {
        let objModule = {};
        Object.keys(module).forEach(key1 => {
            objModule[key1] = {};
            objModule[key1].claim = {};
            Object.keys(module[key1].claim).forEach(key2 => {
                objModule[key1].claim[key2] = {};
                Object.keys(module[key1].claim[key2]).forEach(key3 => {
                    if (key3 === 'code') {
                        objModule[key1].claim[key2].code = module[key1].claim[key2]['code'];
                    }
                });
            });
        });
        let outputModule = JSON.stringify(objModule, null, 4)
            .replace(/:"/g, ': ')
            .replace(/,"/g, ', ')
            .replace(/"/g, '');
        fs.writeFile('./dest/short-module.json', outputModule, function(err) {
            console.log(err);
            return false;
        });
        return true;
    }

    async exportPermission(productCode: number): Promise<boolean> {
        let permissions = await this.getPermissions(productCode);
        permissions = permissions.sort((a, b) => a.claim > b.claim ? 1 : -1);

        // let product = await CachingHelper.productService.getByCode(productCode);
        let product = await CachingHelper.get(`/product/code?code=${productCode}`);
        if (!product || !product.type || !permissions.length)
            return false;

        let productType;
        Object.keys(ProductType).forEach(type => {
            if (ProductType[type] === product!.type)
                productType = 'ProductType.' + type;
        });

        let permissionExport = <any[]>[];
        for (let i = 0; i < permissions.length; i++) {
            let claim;
            let fromRole;
            let toRole;

            Object.keys(module).forEach(m => {
                Object.keys(module[m].claim).forEach(c => {
                    if (module[m].claim[c].code === permissions[i].claim)
                        claim = 'module.' + m + '.claim.' + c + '.code';
                });
            });

            Object.keys(RoleCode).forEach(role => {
                if (RoleCode[role] === permissions[i].fromRole)
                    fromRole = 'RoleCode.' + role;
            });

            Object.keys(RoleCode).forEach(role => {
                if (RoleCode[role] === permissions[i].toRole)
                    toRole = 'RoleCode.' + role;
            });
            let permission = {
                claim,
                fromRole,
                toRole: toRole ? toRole : null
            };

            permissionExport.push(permission);
        }

        let permissionText = JSON.stringify(permissionExport)
            .replace(/\[/g, '[\n')
            .replace(/\]/g, '\n]')
            .replace(/},{/g, '},\n{')
            .replace(/\n{/g, '\n\t{')
            .replace(/:"/g, ': ')
            .replace(/,"/g, ', ')
            .replace(/"/g, '')
            .replace(/null/g, ' null');
        fs.writeFile(`./dest/permission-${productType}.txt`, permissionText, function(err) {
            console.log(err);
            return false;
        });
        return true;
    }

    async checkAndCreateDataCaching(countPermissionsCached: number): Promise<boolean> {
        let countPermissions = await this.permissionRepository.getCount();

        if (countPermissions !== countPermissionsCached) {
            let permissions = await this.permissionRepository.findAll();
            CachingHelper.post(`/permission/multiple`, ClaimPermission.parseArray(permissions)).catch(error => {
                console.log('PermissionBusiness.checkAndCreateDataCaching\n', error);
            });
            return true;
        }
        return false;
    }

    async create(data: PermissionCreate): Promise<Permission | null> {
        if (!data || !data.product || !data.claim || !data.fromRole)
            return null;

        let permission;
        let result = await this.checkPermission(data);

        if (!result) {
            permission = await this.permissionRepository.create(data);
            if (permission) {
                permission = new Permission(permission);
                await CachingHelper.post(`/permission`, permission).catch(error => {
                    console.log('PermissionBusiness.create\n', error);
                });
            }
        }
        return permission;
    }

    async update(_id: string, data: PermissionUpdate): Promise<Permission | null> {
        if (!data || !data.product || !data.claim || !data.fromRole)
            return null;

        let result = await this.permissionRepository.update(_id, data);
        if (result) {
            await CachingHelper.put(`/permission/${_id}`, data).catch(error => {
                console.log('PermissionBusiness.update\n', error);
            });
        }
        return await this.get(_id);
    }

    async delete(_id: string): Promise<boolean> {
        await CachingHelper.delete(`/permission/${_id}`).catch(error => {
            console.log('PermissionBusiness.delete\n', error);
        });
        return await this.permissionRepository.delete(_id, true);
    }
}

Object.seal(PermissionBusiness);
export default PermissionBusiness;
