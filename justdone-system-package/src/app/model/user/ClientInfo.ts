import IUser from '../../model/user/interfaces/IUser'; // eslint-disable-line
import UserProfile from '../../model/user/UserProfile';
import UserPermission from '../../model/user/UserPermission';
import DataHelper from '../../../helpers/DataHelper';

class ClientInfo {
    _id: string;
    profile: UserProfile;
    permission?: UserPermission;

    constructor(model: IUser) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.profile = new UserProfile(model);
        this.permission = model.permission && new UserPermission(model.permission);

        // if (this.permission && this.permission.product)
        //     delete this.permission.product;
        // if (this.permission && this.permission.role)
        //     delete this.permission.role;
    }

    static parseArray(list: IUser[]): ClientInfo[] {
        return list && Array.isArray(list) ? list.map(item => new ClientInfo(item)) : [];
    }
}

Object.seal(ClientInfo);
export default ClientInfo;
