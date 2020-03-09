import IUser from '../../model/user/interfaces/IUser';
import UserProfile from '../../model/user/UserProfile';
import UserPermission from '../../model/user/UserPermission';
declare class ClientInfo {
    _id: string;
    profile: UserProfile;
    permission?: UserPermission;
    constructor(model: IUser);
    static parseArray(list: IUser[]): ClientInfo[];
}
export default ClientInfo;
