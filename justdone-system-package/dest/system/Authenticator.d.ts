import * as express from 'express';
import Product from '../app/model/product/Product';
import Role from '../app/model/role/Role';
declare class Authenticator {
    private app;
    static readonly userKey: string;
    static lastAPI: number;
    static lastAccess: any;
    static timeOut: number;
    static invalid: boolean;
    constructor();
    getConfig(): any;
    static accessDenied(res: express.Response): void;
    static setTimeoutRequestAPI(): void;
    static isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;
    static authenticate(productCode: number, email: string, password: string): Promise<any>;
    static removeAuthenticator(userId: string): Promise<boolean>;
    static checkPermission(claimCode: number, productCode: number, fromRoleCode: number, targetId?: any): Promise<boolean>;
    static filterProductCodesPermission(claimCodes: number[], fromRoleCodes: number[], toRoleCodes?: number[]): Promise<number[]>;
    static filterRoleCodesPermission(claimCodes: number[], productCodes: number[], fromRoleCodes: number[]): Promise<number[]>;
    static filterProductsPermission(claimCodes: number[], originId: string, productCodes?: number[], toRoleCodes?: number[]): Promise<Product[]>;
    static filterPermission(claimCodes: number[], originId: string, productCodes?: number[], toRoleCodes?: number[]): Promise<{
        products: Product[];
        roles: Role[];
    }>;
}
export default Authenticator;
