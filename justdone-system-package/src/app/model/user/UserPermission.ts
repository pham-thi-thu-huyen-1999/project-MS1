import IUser from '../../model/user/interfaces/IUser'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

class UserPermission {
    product: any;
    role: any;
    managers: any[];

    constructor(model: UserPermission) {
        if (!model)
            return;

        this.product = DataHelper.handleIdDataModel(model.product);
        this.role = DataHelper.handleIdDataModel(model.role);
        this.managers = model.managers && Array.isArray(model.managers) ? model.managers.map(manager => DataHelper.handleIdDataModel(manager)) : [];
    }
}

Object.seal(UserPermission);
export default UserPermission;
