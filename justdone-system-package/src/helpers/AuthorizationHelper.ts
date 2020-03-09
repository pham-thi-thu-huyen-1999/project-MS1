import * as request from 'request-promise';
import {Config} from '../config';
import User from '../app/model/user/User'; // eslint-disable-line
import DataHelper from './DataHelper';
import Permission from '../app/model/permission/Permission'; // eslint-disable-line
import PermissionUpdate from '../app/model/permission/PermissionUpdate'; // eslint-disable-line
import CustomPermission from '../app/model/permission/CustomPermission'; // eslint-disable-line

class AuthorizationHelper {
    static userService = {
        async get(_id: string): Promise<User | null> {
            return await AuthorizationHelper.get(`/api/user/${_id}`);
        },
        async getByToken(token: string): Promise<User | null> {
            return await AuthorizationHelper.get(`/api/user/access-token?token=${token}`);
        },
        async getByEmail(email: string): Promise<User | null> {
            return await AuthorizationHelper.get(`/api/user/email?email=${email}`);
        },
        async create(data: User): Promise<void> {
            await AuthorizationHelper.post(`/api/user`, data);
        },
        async delete(_id: string): Promise<void> {
            await AuthorizationHelper.delete(`/api/user/${_id}`);
        },
        async updateLastAccessUser(_id: string): Promise<void> {
            await AuthorizationHelper.post(`/api/user/lastAccess/${_id}`);
        }
    };

    static permissionService = {
        async get(_id: string): Promise<Permission | null> {
            return await AuthorizationHelper.get(`/api/permission/${_id}`);
        },
        async getClaimPermissions(productCode: number, fromRoleCode: number): Promise<Permission[]> {
            return await AuthorizationHelper.get(`/api/permission/claim-permissions?productCode=${productCode}&fromRoleCode=${fromRoleCode}`);
        },
        async getCustomPermissions(userId: string): Promise<CustomPermission[]> {
            return await AuthorizationHelper.get(`/api/permission/custom-permissions/${userId}`);
        },
        async create(data: Permission): Promise<void> {
            await AuthorizationHelper.post(`/api/permission`, data);
        },
        async update(_id: string, data: PermissionUpdate): Promise<void> {
            await AuthorizationHelper.put(`/api/permission/${_id}`, data);
        },
        async delete(_id: string): Promise<void> {
            await AuthorizationHelper.delete(`/api/permission/${_id}`);
        }
    };

    static systemService = {
        async getSytemInfo(): Promise<any> {
            return await AuthorizationHelper.get(`/api/system/getAuthorizationInfor`);
        },
    }

    static get(url): Promise<any> {
        return DataHelper.handlePromiseRequest(request({
            method: 'GET',
            uri: `${Config.PROJECT.SERVER.AUTHORIZATION.PROTOTYPE}://${Config.PROJECT.SERVER.AUTHORIZATION.DOMAIN}` + url,
            json: true
        }));
    }

    static post(url, data?: any): Promise<any> {
        return DataHelper.handlePromiseRequest(request({
            method: 'POST',
            uri: `${Config.PROJECT.SERVER.AUTHORIZATION.PROTOTYPE}://${Config.PROJECT.SERVER.AUTHORIZATION.DOMAIN}` + url,
            body: data,
            json: true
        }));
    }

    static put(url, data: any): Promise<any> {
        return DataHelper.handlePromiseRequest(request({
            method: 'PUT',
            uri: `${Config.PROJECT.SERVER.AUTHORIZATION.PROTOTYPE}://${Config.PROJECT.SERVER.AUTHORIZATION.DOMAIN}` + url,
            body: data,
            json: true
        }));
    }

    static patch(url, data: any): Promise<any> {
        return DataHelper.handlePromiseRequest(request({
            method: 'PATCH',
            uri: `${Config.PROJECT.SERVER.AUTHORIZATION.PROTOTYPE}://${Config.PROJECT.SERVER.AUTHORIZATION.DOMAIN}` + url,
            body: data,
            json: true
        }));
    }

    static delete(url): Promise<any> {
        return DataHelper.handlePromiseRequest(request({
            method: 'DELETE',
            uri: `${Config.PROJECT.SERVER.AUTHORIZATION.PROTOTYPE}://${Config.PROJECT.SERVER.AUTHORIZATION.DOMAIN}` + url,
            json: true
        }));
    }
}

Object.seal(AuthorizationHelper);
export default AuthorizationHelper;
