import Permission from 'justdone-system-package/dest/app/model/permission/Permission'; // eslint-disable-line
import Product from 'justdone-system-package/dest/app/model/product/Product'; // eslint-disable-line
import Role from 'justdone-system-package/dest/app/model/role/Role'; // eslint-disable-line
interface ICachingBusiness {
     /** *************************** PERMISSION ***************************** */
    getPermission: (_id: string) => Promise<Permission | null>;
    getClaimPermissions: (productCode: number, fromRoleCode: number) => Promise<Permission[]>;
    getProductCodesPermission: (claimCodes: number[], fromRoleCodes: number[], toRoleCodes?: number[]) => Promise<number[]>;
    getRoleCodesPermission: (claimCodes: number[], productCodes: number[], fromRoleCodes: number[]) => Promise<number[]>;
    checkPermission: (data: Permission) => Promise<Permission | null>;
    checkRealDataPermission: () => void;
    createMultiplePermissions: (data: Permission[]) => Promise<boolean>;
    createPermission: (data: Permission) => Promise<Permission | null>;
    updatePermission: (_id: string, data: any) => Promise<any>;
    deletePermission: (_id: string) => Promise<any>;
    deleteAllPermissions: () => Promise<any>;
    /** *************************** PRODUCT ***************************** */
    getAllProducts: () => Promise<Product[]>;
    getProduct: (_id: string) => Promise<Product | null>;
    getProductByName: (name: string) => Promise<Product | null>;
    getProductByCode: (code: number) => Promise<Product | null>;
    getProductsByCodes: (codes: number[]) => Promise<Product[]>;
    getProductsByTypes: (types: number[]) => Promise<Product[]>;
    getProductsByIds: (ids: string[]) => Promise<Product[]>;
    checkRealDataProduct: () => void;
    createMultipleProducts: (data: Product[]) => Promise<boolean>;
    createProduct: (data: Product) => Promise<Product | null>;
    updateProduct: (_id: string, data: any) => Promise<any>;
    deleteProduct: (_id: string) => Promise<any>;
    deleteAllProducts: () => Promise<any>;
    /** *************************** ROLE ***************************** */
    getAllRoles: () => Promise<Role[]>;
    getRole: (_id: string) => Promise<Role | null>;
    getRolesByIds: (ids: string[]) => Promise<Role[]>;
    getRolesByProductCode: (productCode: number) => Promise<Role[]>;
    getRoleByName: (name: string) => Promise<Role | null>;
    getRoleByCode: (code: number) => Promise<Role | null>;
    getRolesByCodes: (codes: number[]) => Promise<Role[]>;
    checkRealDataRole: () => void;
    createMultipleRoles: (data: Role[]) => Promise<boolean>;
    createRole: (data: Role) => Promise<Role | null>;
    updateRole: (_id: string, data: any) => Promise<any>;
    deleteRole: (_id: string) => Promise<any>;
    deleteAllRoles: () => Promise<any>;
    /** *************************** SYSTEM *************************** */
    checkAndCreateAllDataCaching(): void;
    /** *************************** USER ***************************** */
    getUser: (_id: string) => Promise<any>;
    getByToken: (token: string) => Promise<any>;
    getByEmail: (email: string) => Promise<any>;
    getInvite: (_id: string) => Promise<any>;
    getInviteByToken: (token: string) => Promise<any>;
    createInvite: (data: any) => Promise<any>;
    verifyInvite: (inviterId: string, token: string) => Promise<boolean>;
    expireInvite: (inviterId: string, token: string) => Promise<boolean>;
    createUser: (data: any) => Promise<any>;
    createMultipleInvites: (data: any) => Promise<any>;
    updateUser: (_id: string, data: any) => Promise<any>;
    updateInvite: (_id: string, data: any) => Promise<any>;
    deleteUser: (_id: string) => Promise<any>;
    deleteAllUsers: () => Promise<any>;
    deleteInvite: (_id: string) => Promise<any>;
    removeExpiredInvites: () => Promise<any>;
    updateLastAccessUser: (_id: string, lastAccess: any) => Promise<any>;
}

export default ICachingBusiness;
