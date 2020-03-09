import IUser from './interfaces/IUser';
import UserPermission from './UserPermission';
declare class ManagerAccount {
    _id: string;
    fullName: string;
    email: string;
    avatar?: string;
    permission?: UserPermission;
    createdAt?: Date;
    lastAccess?: Date;
    constructor(model: IUser);
    static parseArray(list: IUser[]): ManagerAccount[];
}
export default ManagerAccount;
