import IBaseBusiness from './base/IBaseBusiness';
import Module from 'justdone-system-package/dest/app/model/permission/Module'; // eslint-disable-line
import Permission from 'justdone-system-package/dest/app/model/permission/Permission'; // eslint-disable-line
import PermissionCreate from 'justdone-system-package/dest/app/model/permission/PermissionCreate'; // eslint-disable-line
import PermissionUpdate from 'justdone-system-package/dest/app/model/permission/PermissionUpdate'; // eslint-disable-line
import CustomPermission from 'justdone-system-package/dest/app/model/permission/CustomPermission'; // eslint-disable-line
import User from 'justdone-system-package/dest/app/model/user/User'; // eslint-disable-line

interface IPermissionBusiness extends IBaseBusiness<Permission> {
    getPermissions: (productCode?: number, moduleCode?: number) => Promise<Permission[]>;
    getAllModule: () => Promise<any>;
    getAllShortModule: () => Promise<boolean>;
    exportPermission: (productCode: number) => Promise<boolean>;
    getClaimPermissions: (productCode: number, fromRoleCode: number) => Promise<Permission[]>;
    getProductCodesPermission: (claimCodes: number[], fromRoleCodes: number[], toRoleCodes?: number[]) => Promise<number[]>;
    getRoleCodesPermission: (claimCodes: number[], productCodes: number[], fromRoleCodes: number[]) => Promise<number[]>;
    checkAndCreateDataCaching: (countPermissionsCached: number) => Promise<boolean>;
    create: (data: PermissionCreate) => Promise<Permission | null>;
    update: (_id: string, data: PermissionUpdate) => Promise<Permission | null>;
    checkPermission: (data: any) => Promise<boolean>;
}

export default IPermissionBusiness;
