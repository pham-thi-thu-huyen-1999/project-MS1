import IUser from '../model/user/interfaces/IUser';
import BaseRepository from './base/BaseRepository';
import UserCreate from '../model/user/UserCreate';
declare class UserRepository extends BaseRepository<IUser> {
    constructor();
    create(data: UserCreate): Promise<IUser>;
    updateManyFinancialStart(data: any): Promise<any>;
    findConnectBankUsers(param: any): Promise<any>;
}
export default UserRepository;
