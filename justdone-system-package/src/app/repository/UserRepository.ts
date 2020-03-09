import IUser from '../model/user/interfaces/IUser'; // eslint-disable-line
import UserSchema from '../dataAccess/schemas/UserSchema';
import BaseRepository from './base/BaseRepository';
import UserCreate from '../model/user/UserCreate'; // eslint-disable-line

class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(UserSchema);
    }

    async create(data: UserCreate): Promise<IUser> {
        return await super.create(data);
    }

    async updateManyFinancialStart(data: any): Promise<any> {
        return await this.model.updateMany({}, data).exec();
    }

    async findConnectBankUsers(param: any): Promise<any> {
        return await this.model.find(param.query).exec();
    }
}

Object.seal(UserRepository);
export default UserRepository;
