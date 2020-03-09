import IUser from './interfaces/IUser';
import UserBusinessInfo from './UserBusinessInfo';
import UserPermission from './UserPermission';
declare class ClientAccount {
    _id: string;
    fullName: string;
    email: string;
    avatar?: string;
    businessInfo?: UserBusinessInfo;
    permission?: UserPermission;
    createdAt?: Date;
    lastAccess?: Date;
    constructor(model: IUser);
    static parseArray(list: IUser[]): ClientAccount[];
}
export default ClientAccount;
