import * as express from 'express';
import Product from '../app/model/product/Product'; // eslint-disable-line
import Role from '../app/model/role/Role'; // eslint-disable-line
import AuthorizationHelper from '../helpers/AuthorizationHelper';

class Authenticator {
    private app: any;
    static readonly userKey = 'authUser';
    static lastAPI: number = 0;
    static lastAccess: any = new Date();
    static timeOut: number = 0;
    static invalid: boolean = false;
    constructor() {
        this.app = express();

        this.app.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                let userAuth;
                let token = <string>req.headers['authorization'];

                if (token && token.length === 128) {
                    userAuth = await AuthorizationHelper.userService.getByToken(token).catch(error => {
                        console.log('Authenticator.middleware\n', error);
                        return Promise.resolve(null);
                    });
                }

                req[Authenticator.userKey] = userAuth || null;
            }
            catch (err) {
                console.error(err.message);
            }
            next();
        });
    }

    getConfig() {
        return this.app;
    }

    static accessDenied(res: express.Response): void {
        res.status(403);
        res.send({error: {message: 'Access denied!'}});
    }

    // static isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction): void {
    //     if (req[Authenticator.userKey]) {
    //         next();
    //     }
    //     else {
    //         res.status(401);
    //         res.send({error: {message: 'Unauthorized'}});
    //     }
    // }
    static setTimeoutRequestAPI() {
        Authenticator.timeOut = 0;
        let countTimeOut = setInterval(() => {
            Authenticator.timeOut = Authenticator.timeOut + 1;
            if (Authenticator.timeOut === 10) {
                clearInterval(countTimeOut);
            }
        }, 1000);
    }

    static async isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        if (req[Authenticator.userKey]) {
            let targetUser = await AuthorizationHelper.userService.get(req[Authenticator.userKey]._id).catch(error => {
                return Promise.resolve(null);
            });
            // time now convert to milisecion.
            let dateNowMilisec = new Date().getTime();
            let userLastAccessMilisec = targetUser && targetUser.lastAccess ? new Date(targetUser.lastAccess).getTime() : new Date().getTime();
            // compare time between DB and request time
            if (dateNowMilisec - userLastAccessMilisec >= 60000 ) { // 1m = 60000ms
                await AuthorizationHelper.userService.updateLastAccessUser(req[Authenticator.userKey]._id).catch(error => {
                    console.log('Authenticator last access\n', error);
                    // return Promise.resolve(null);
                });
            }
            // if (Authenticator.lastAPI === 0) {
            //     // update lastAccess
            //     let _id = req[Authenticator.userKey]._id;
            //     await AuthorizationHelper.userService.updateLastAccessUser(_id).catch(error => {
            //         console.log('Authenticator last access\n', error);
            //         // return Promise.resolve(null);
            //     });
            //     Authenticator.lastAPI++;
            //     Authenticator.setTimeoutRequestAPI();
            // }
            // else if (Authenticator.timeOut >= 10) {
            //     console.log('last API: ', Authenticator.lastAPI);
            //     Authenticator.lastAPI = 0; ;
            // }
            // else {
            //     Authenticator.lastAPI++;
            // }
            next();
        }
        else {
            res.status(401);
            res.send({error: {message: 'Unauthorized'}});
        }
    }

    static async authenticate(productCode: number, email: string, password: string): Promise<any> {
        if (productCode && email && password) {
            let data = {
                productCode,
                email,
                password
            };
            return await AuthorizationHelper.post(`/api/user/authenticate`, data).catch(error => {
                console.log('Authenticator.authenticate\n', error);
                return Promise.resolve(null);
            });
        }
        return null;
    }

    static async removeAuthenticator(userId: string): Promise<boolean> {
        if (!userId)
            return false;

        return await AuthorizationHelper.delete(`/api/user/${userId}`).catch(error => {
            console.log('Authenticator.removeAuthenticator\n', error);
            return Promise.resolve(false);
        });
    }

    static async checkPermission(claimCode: number, productCode: number, fromRoleCode: number, targetId?: any): Promise<boolean> {
        let toRole;
        if (targetId) {
            let targetUser = await AuthorizationHelper.userService.get(targetId).catch(error => {
                console.log('Authenticator.checkPermission\n', error);
                return Promise.resolve(null);
            });
            if (!targetUser)
                return false;

            toRole = targetUser.permission && targetUser.permission.role;
            if (!toRole || !toRole.code)
                return false;
        }
        let data = <any> {
            product: productCode,
            claim: claimCode,
            fromRole: fromRoleCode,
        };
        if (toRole)
            data.toRole = toRole.code === fromRoleCode ? null : toRole.code;

        return await AuthorizationHelper.post(`/api/permission/check-permission`, data).catch(error => {
            console.log('Authenticator.checkPermission\n', error);
            return Promise.resolve(false);
        });
    }

    // return the product codes that allowed to use by permission
    static async filterProductCodesPermission(claimCodes: number[], fromRoleCodes: number[], toRoleCodes?: number[]): Promise<number[]> {
        if (!claimCodes || !claimCodes.length || !fromRoleCodes || !fromRoleCodes.length)
            return [];
        return await AuthorizationHelper.get(`/api/permission/product-codes-permission?claimCodes=${claimCodes.join(',')}&fromRoleCodes=${fromRoleCodes.join(',')}&toRoleCodes=${toRoleCodes ? toRoleCodes.join(',') : ''}`).catch(error => {
            console.log('Authenticator.filterProductCodesPermission\n', error);
            return Promise.resolve([]);
        });
    }

    // return the role codes (to role) that allowed to use by permission
    static async filterRoleCodesPermission(claimCodes: number[], productCodes: number[], fromRoleCodes: number[]): Promise<number[]> {
        if (!claimCodes || !claimCodes.length || !productCodes || !productCodes.length || !fromRoleCodes || !fromRoleCodes.length)
            return [];
        return await AuthorizationHelper.get(`/api/permission/role-codes-permission?claimCodes=${claimCodes.join(',')}&productCodes=${productCodes.join(',')}&fromRoleCodes=${fromRoleCodes.join(',')}`).catch(error => {
            console.log('Authenticator.filterRoleCodesPermission\n', error);
            return Promise.resolve([]);
        });
    }

    // return products that allowed to use by permission
    static async filterProductsPermission(claimCodes: number[], originId: string, productCodes?: number[], toRoleCodes?: number[]): Promise<Product[]> {
        if (!claimCodes || !claimCodes.length || !originId)
            return [];

        let originUser = await AuthorizationHelper.userService.get(originId).catch(error => {
            console.log('Authenticator.filterProductsPermission.1\n', error);
            return Promise.resolve(null);
        });
        if (!originUser)
            return [];

        let fromRole = originUser.permission && originUser.permission.role;
        if (!fromRole || !fromRole.code)
            return [];

        let productCodesPermission = await Authenticator.filterProductCodesPermission(claimCodes, [fromRole.code], toRoleCodes);
        if (productCodes && productCodes.length)
            productCodesPermission = productCodesPermission.filter(productCode => productCodes.find(code => code === productCode));

        if (!productCodesPermission || !productCodesPermission.length)
            return [];
        return await AuthorizationHelper.get(`/api/product/codes?codes=${productCodesPermission.join(',')}`).catch(error => {
            console.log('Authenticator.filterProductsPermission.2\n', error);
            return Promise.resolve([]);
        });
    }

    // return products and roles (to role) that allowed to use by permission
    static async filterPermission(claimCodes: number[], originId: string, productCodes?: number[], toRoleCodes?: number[]): Promise<{products: Product[], roles: Role[]}> {
        let result = {products: <Product[]>[], roles: <Role[]>[]};
        if (!claimCodes || !claimCodes.length || !originId)
            return result;

        let originUser = await AuthorizationHelper.userService.get(originId).catch(error => {
            console.log('Authenticator.filterPermission.1\n', error);
            return Promise.resolve(null);
        }); ;
        if (!originUser)
            return result;

        let fromRole = originUser.permission && originUser.permission.role;
        if (!fromRole || !fromRole.code)
            return result;

        let productCodesPermission = await Authenticator.filterProductCodesPermission(claimCodes, [fromRole.code], toRoleCodes);
        if (productCodes && productCodes.length)
            productCodesPermission = productCodesPermission.filter(productCode => productCodes.find(code => code === productCode));

        if (!productCodesPermission || !productCodesPermission.length)
            return result;

        let roleCodesPermission = await Authenticator.filterRoleCodesPermission(claimCodes, productCodesPermission, [fromRole.code]);
        if (toRoleCodes && toRoleCodes.length)
            roleCodesPermission = roleCodesPermission.filter(roleCode => toRoleCodes.find(code => code === roleCode));

        result.products = await AuthorizationHelper.get(`/api/product/codes?codes=${productCodesPermission.join(',')}`).catch(error => {
            console.log('Authenticator.filterPermission.2\n', error);
            return Promise.resolve([]);
        });
        if (roleCodesPermission && roleCodesPermission.length) {
            result.roles = await AuthorizationHelper.get(`/api/role/codes?codes=${roleCodesPermission.join(',')}`).catch(error => {
                console.log('Authenticator.filterPermission.3\n', error);
                return Promise.resolve([]);
            });
        }

        return result;
    }
}

Object.seal(Authenticator);
export default Authenticator;
