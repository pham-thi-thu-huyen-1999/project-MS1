import IUser from '../../model/user/interfaces/IUser';
import UserToken from './UserToken';
import UserProfile from '../../model/user/UserProfile';
import UserPermission from '../../model/user/UserPermission';
declare class UserAuthentication {
    _id: string;
    profile: UserProfile;
    permission?: UserPermission;
    token?: UserToken;
    constructor(model: IUser);
}
export default UserAuthentication;
