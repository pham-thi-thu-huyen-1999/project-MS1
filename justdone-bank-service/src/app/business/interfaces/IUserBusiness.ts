import User from 'justdone-system-package/dest/app/model/user/User';// eslint-disable-line
import UserConnectedBank from 'justdone-system-package/dest/app/model/user/UserConnectedBank'; // eslint-disable-line
import IRead from '../interfaces/common/IRead';
interface IUserBusiness extends IRead<User> {
    getYodleeAccountByUserId: (_id: string) => Promise<any>;
    getConnectedBanksByUserId: (_id: string) => Promise<UserConnectedBank[]>;
    updateConnectedBanks: (_id: string, UserConnectedBanks: UserConnectedBank) => Promise<boolean>;
}

export default IUserBusiness;
