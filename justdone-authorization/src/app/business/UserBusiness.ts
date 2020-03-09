import * as crypto from 'crypto';
import * as validator from 'validator';
import Project from '../../config/Project';
import IUserBusiness from './interfaces/IUserBusiness'; // eslint-disable-line
import UserRepository from 'justdone-system-package/dest/app/repository/UserRepository';
import User from 'justdone-system-package/dest/app/model/user/User';
import UserToken from 'justdone-system-package/dest/app/model/user/UserToken';
import DateHelper from 'justdone-system-package/dest/helpers/DateHelper';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import CachingHelper from 'justdone-system-package/dest/helpers/CachingHelper';
import {LoginProvider} from 'justdone-system-package/dest/app/model/common/CommonType';

class UserBusiness implements IUserBusiness {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async get(_id: string): Promise<User | null> {
        if (!_id)
            return null;

        let getRealData = async () => {
            let param = {
                query: {
                    _id: DataHelper.toObjectId(_id)
                },
                populate: populateInfoCommon()
            };
            let user = await this.userRepository.findOne(param).catch(error => {
                console.log('UserBusiness.get', error);
                return Promise.resolve(null);
            });
            return user && new User(user);
        };

        let user;
        try {
            // user = await DataCachingHelper.get(`/api/user/${_id}`);
            user = await CachingHelper.get(`/user/${_id}`);
            if (!user) {
                user = await getRealData();
                if (user)
                    // await DataCachingHelper.post(`/api/user`, user);
                    await CachingHelper.post(`/user`, user);
            }
        }
        catch (error) {
            console.log('UserBusiness.get\n', error);
            user = await getRealData();
        }
        return user;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        if (!email)
            return null;
        email = email.trim().toLowerCase();

        let getRealData = async () => {
            let param = {
                query: {email},
                populate: populateInfoCommon()
            };
            let user = await this.userRepository.findOne(param).catch(error => {
                console.log('UserBusiness.getUserByEmail', error);
                return Promise.resolve(null);
            });
            return user && new User(user);
        };

        let user;
        try {
            // user = await DataCachingHelper.get(`/api/user/email?email=${email}`);
            user = await CachingHelper.get(`/user/email?email=${email}`);
            if (!user) {
                user = await getRealData();
                if (user)
                    // await DataCachingHelper.post(`/api/user`, user);
                    await CachingHelper.post(`/user`, user);
            }
        }
        catch (error) {
            console.log('UserBusiness.getUserByEmail\n', error);
            user = await getRealData();
        }
        return user;
    }

    async getUserByToken(token: string): Promise<User | null> {
        if (!token)
            return null;

        let getRealData = async () => {
            let param = {
                query: {
                    'token.accessToken': token,
                    'token.tokenExpire': {
                        $gt: new Date()
                    }
                },
                populate: populateInfoCommon()
            };
            let user = await this.userRepository.findOne(param).catch(error => {
                console.log('UserBusiness.getUserByToken.1', error);
                return Promise.resolve(null);
            });

            return user && new User(user);
        };

        let user;
        try {
            // user = await DataCachingHelper.get(`/api/user/access-token?token=${token}`);
            user = await CachingHelper.get(`/user/access-token?token=${token}`);
            if (!user) {
                user = await getRealData();
                if (user)
                    // await DataCachingHelper.post(`/api/user`, user);
                    await CachingHelper.post(`/user`, user);
            }
        }
        catch (error) {
            console.log('UserBusiness.getUserByToken.2', error);
            user = await getRealData();
        }

        if (user) {
            try {
                let lastAccess = user && (<User>user).lastAccess;
                if (!lastAccess || DateHelper.addMinutes(new Date(lastAccess), 2) < new Date()) {
                    lastAccess = new Date();
                    this.userRepository.update(user._id, {lastAccess});
                    user.lastAccess = lastAccess;
                    // DataCachingHelper.post(`/api/user`, user);
                    CachingHelper.post(`/user`, user);
                }
            }
            catch (error) {
                console.log('UserBusiness.getUserByToken.3');
            }
        }
        return user;
    }

    async authenticate(productCode: number, email: string, password: string): Promise<User | null> {
        if (!email || !validator.isEmail(email) || !password)
            return null;

        let params = {
            query: <any>{
                email: email.trim().toLowerCase(),
                password: hashPassword(password)
            },
            populate: populateInfoCommon()
        };

        let user = await this.userRepository.findOne(params);
        if (!user || !user.permission || !user.permission.product || !user.permission.role || !user.permission.product._id || user.permission.product.code !== productCode)
            return null;

        if (!user.token || user.token.provider !== LoginProvider.Local || !user.token.accessToken || !user.token.tokenExpire || user.token.tokenExpire < new Date())
            user.token = await this.updateUserToken(user._id, new UserToken(<any>{provider: LoginProvider.Local}));

        let data = user && new User(user);
        if (data) {
            // await DataCachingHelper.post('/api/user', data).catch(error => {
            //     console.log('UserBusiness.authenticate\n', error);
            // });
            await CachingHelper.post('/user', data).catch(error => {
                console.log('UserBusiness.authenticate\n', error);
            });
        }
        return data;
    }

    create(): any {}
    update(): any {}

    async updateLastAccessUser(_id: string): Promise<boolean> {
        if (!_id)
            return false;
        let lastAccess = new Date();
        let result = await this.userRepository.update(_id, {lastAccess});
        if (result) {
            // update caching
            await CachingHelper.post(`/lastAccess/${_id}`, {lastAccess});
            return true;
        }
        return false;
    }

    private async updateUserToken(_id: string, token: UserToken): Promise<UserToken> {
        token.accessToken = createAccessToken();
        token.tokenExpire = DateHelper.addDays(new Date(), Project.EXPIRE_DAYS);

        await this.userRepository.update(_id, {token});
        this.delete(_id);
        return token;
    }

    async delete(_id: string): Promise<boolean> {
        if (!_id)
            return false;
        // return await DataCachingHelper.delete(`/api/user/${_id}`).catch(error => {
        //     console.log('UserBusiness.delete\n', error);
        //     return Promise.resolve(false);
        // });
        return await CachingHelper.delete(`/user/${_id}`).catch(error => {
            console.log('UserBusiness.delete\n', error);
            return Promise.resolve(false);
        });
    }
}

function populateInfoCommon() {
    return [{
        path: 'permission.product',
        select: 'code name type logo config',
    }, {
        path: 'permission.role',
        select: 'code name',
    }, {
        path: 'avatar',
        select: '_id url',
    }];
}

function hashPassword(password: string) {
    if (password)
        return crypto.createHash('md5').update('$$' + password).digest('hex');
    return '';
}

function createAccessToken() {
    return crypto.randomBytes(64).toString('hex').substr(0, 128);
}

Object.seal(UserBusiness);
export default UserBusiness;
