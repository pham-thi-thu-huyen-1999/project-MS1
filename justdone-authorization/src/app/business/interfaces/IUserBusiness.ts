import IBaseBusiness from './base/IBaseBusiness';
import User from 'justdone-system-package/dest/app/model/user/User';

interface IUserBusiness extends IBaseBusiness<User> {
    getUserByEmail: (email: string) => Promise<User | null>;
    getUserByToken: (token: string) => Promise<User | null>;
    authenticate: (productCode: number, email: string, password: string) => Promise<User | null>;
    updateLastAccessUser: (_id: string) => Promise<boolean>;
}

export default IUserBusiness;
