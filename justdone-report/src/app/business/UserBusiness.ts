import UserRepository from 'justdone-system-package/dest/app/repository/UserRepository';
import IUserBusiness from './interfaces/IUserBusiness'; // eslint-disable-line
import User from 'justdone-system-package/dest/app/model/user/User';
import UserChartAccountOpeningBalance from 'justdone-system-package/dest/app/model/user/UserChartAccountOpeningBalance'; // eslint-disable-line
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';

class UserBusiness implements IUserBusiness {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async get(_id: string): Promise<User | null> {
        if (!_id)
            return null;

        let user = (await this.userRepository.get(_id));
        return user;
    }

    async getListUser(ids: string[]): Promise<User[]> {
        let query = {
            _id: {
                $in: ids.map(id => id.toString())
            }
        };
        let users = await this.userRepository.findAll({query: query});
        return User.parseArray(users);
    }

    async getAllUserByProductAndManager(managerId: string, productId: string): Promise<User[]> {
        let params = {
            query: <any>{
                'permission.product': DataHelper.toObjectId(productId),
                'permission.managers': {$in: [DataHelper.toObjectId(managerId)]},
                'deletedAt': null
            }
        };
        let users = await this.userRepository.findAll(params);
        return User.parseArray(users);
    }

    async getUserChartAccountOpeningBalance(_id: string): Promise<any> {
        if (!_id)
            return null;

        let populate = {
            path: 'chartAccountOpeningBalance.dataCoaOpeningBalance.coaId',
            select: '_id name code gstType'
        };

        let user = await this.userRepository.get(_id, populate);
        return user && user.chartAccountOpeningBalance!;
    }

    create(data: any): any {}

    update(_id: string, data: any): any {}

    delete(_id: string, isRealDelete?: boolean): any {}
}

Object.seal(UserBusiness);
export default UserBusiness;
