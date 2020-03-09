import IBaseBusiness from './base/IBaseBusiness';
import IUser from 'justdone-system-package/dest/app/model/user/interfaces/IUser';// eslint-disable-line
import User from 'justdone-system-package/dest/app/model/user/User';
import UserChartAccountOpeningBalance from 'justdone-system-package/dest/app/model/user/UserChartAccountOpeningBalance'; // eslint-disable-line

interface IUserBusiness extends IBaseBusiness<User> {
    getListUser:(ids: string[]) => Promise<User[]>;
    getAllUserByProductAndManager(managerId: string, productId: string): Promise<User[]>;
    getUserChartAccountOpeningBalance(_id: string): Promise<any>;
}

export default IUserBusiness;
