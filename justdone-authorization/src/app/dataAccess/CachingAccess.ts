import * as Nedb from 'nedb';
import * as path from 'path'; // eslint-disable-line

class CachingAccess {
    static db: {
        users: any,
        roles: any,
        products: any,
        modules: any,
        claims: any,
        permissions: any,
        customPermissions: any
        invites: any } = {
            users: null,
            roles: null,
            products: null,
            modules: null,
            claims: null,
            permissions: null,
            customPermissions: null,
            invites: null
        };

    static init() {
        // CachingAccess.db.users = new Nedb({filename: path.join(__dirname, '../../../database/users.db'), autoload: true});
        // CachingAccess.db.roles = new Nedb({filename: path.join(__dirname, '../../../database/roles.db'), autoload: true});
        // CachingAccess.db.products = new Nedb({filename: path.join(__dirname, '../../../database/products.db'), autoload: true});
        // CachingAccess.db.permissions = new Nedb({filename: path.join(__dirname, '../../../database/permissions.db'), autoload: true});
        // CachingAccess.db.customPermissions = new Nedb({filename: path.join(__dirname, '../../../database/customPermissions.db'), autoload: true});
        // CachingAccess.db.invites = new Nedb({filename: path.join(__dirname, '../../../database/invites.db'), autoload: true});

        CachingAccess.db.users = new Nedb();
        CachingAccess.db.roles = new Nedb();
        CachingAccess.db.products = new Nedb();
        CachingAccess.db.permissions = new Nedb();
        CachingAccess.db.customPermissions = new Nedb();
        CachingAccess.db.invites = new Nedb();

        CachingAccess.db.users.ensureIndex({fieldName: 'email', unique: true});
        CachingAccess.db.users.ensureIndex({fieldName: 'cachingExpire', expireAfterSeconds: 1800});

        CachingAccess.db.roles.ensureIndex({fieldName: 'level', unique: true});
        CachingAccess.db.roles.ensureIndex({fieldName: 'name', unique: true});

        CachingAccess.db.products.ensureIndex({fieldName: 'name', unique: true});
        CachingAccess.db.permissions.ensureIndex({fieldName: '_id', unique: true});
        CachingAccess.db.customPermissions.ensureIndex({fieldName: '_id', unique: true});

        CachingAccess.db.invites.ensureIndex({fieldName: 'token', unique: true});
        CachingAccess.db.invites.ensureIndex({fieldName: 'cachingExpire', expireAfterSeconds: 900});
    }
}

Object.seal(CachingAccess);
export default CachingAccess;

