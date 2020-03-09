import User from '../app/model/user/User';
import Permission from '../app/model/permission/Permission';
import PermissionUpdate from '../app/model/permission/PermissionUpdate';
import CustomPermission from '../app/model/permission/CustomPermission';
declare class AuthorizationHelper {
    static userService: {
        get(_id: string): Promise<User | null>;
        getByToken(token: string): Promise<User | null>;
        getByEmail(email: string): Promise<User | null>;
        create(data: User): Promise<void>;
        delete(_id: string): Promise<void>;
        updateLastAccessUser(_id: string): Promise<void>;
    };
    static permissionService: {
        get(_id: string): Promise<Permission | null>;
        getClaimPermissions(productCode: number, fromRoleCode: number): Promise<Permission[]>;
        getCustomPermissions(userId: string): Promise<CustomPermission[]>;
        create(data: Permission): Promise<void>;
        update(_id: string, data: PermissionUpdate): Promise<void>;
        delete(_id: string): Promise<void>;
    };
    static systemService: {
        getSytemInfo(): Promise<any>;
    };
    static get(url: any): Promise<any>;
    static post(url: any, data?: any): Promise<any>;
    static put(url: any, data: any): Promise<any>;
    static patch(url: any, data: any): Promise<any>;
    static delete(url: any): Promise<any>;
}
export default AuthorizationHelper;
