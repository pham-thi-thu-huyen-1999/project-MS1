import IUser from '../../model/user/interfaces/IUser'; // eslint-disable-line
import UserToken from './UserToken';
import UserProfile from '../../model/user/UserProfile';
import UserPermission from '../../model/user/UserPermission';
import DataHelper from '../../../helpers/DataHelper';

class UserAuthentication {
    _id: string;
    profile: UserProfile;
    permission?: UserPermission;
    token?: UserToken;

    constructor(model: IUser) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.profile = new UserProfile(model);
        this.permission = model.permission && new UserPermission(model.permission);
        this.token = model.token && new UserToken(model.token!);
    }
}

Object.seal(UserAuthentication);
export default UserAuthentication;
