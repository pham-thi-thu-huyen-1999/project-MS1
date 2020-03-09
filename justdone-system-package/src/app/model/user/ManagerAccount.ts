import IUser from './interfaces/IUser'; // eslint-disable-line
import UserPermission from './UserPermission';
import DataHelper from '../../../helpers/DataHelper';

class ManagerAccount {
    _id: string;
    fullName: string;
    email: string;
    avatar?: string;
    permission?: UserPermission;
    createdAt?: Date;
    lastAccess?: Date;

    constructor(model: IUser) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.fullName = model.fullName;
        this.email = model.email;
        this.avatar = DataHelper.handleFileDataModel(model.avatar);
        this.permission = model.permission && new UserPermission(model.permission);
        this.createdAt = model.createdAt;
        this.lastAccess = model.lastAccess;
    }

    static parseArray(list: IUser[]): ManagerAccount[] {
        return list && Array.isArray(list) ? list.map(item => new ManagerAccount(item)) : [];
    }
}

Object.seal(ManagerAccount);
export default ManagerAccount;
