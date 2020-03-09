import IUser from './interfaces/IUser'; // eslint-disable-line
import UserBusinessInfo from './UserBusinessInfo';
import UserPermission from './UserPermission';
import DataHelper from '../../../helpers/DataHelper';

class ClientAccount {
    _id: string;
    fullName: string;
    email: string;
    avatar?: string;
    businessInfo?: UserBusinessInfo;
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
        this.businessInfo = model.businessInfo && new UserBusinessInfo(model.businessInfo);
        this.permission = model.permission && new UserPermission(model.permission);
        this.createdAt = model.createdAt;
        this.lastAccess = model.lastAccess;
    }

    static parseArray(list: IUser[]): ClientAccount[] {
        return list && Array.isArray(list) ? list.map(item => new ClientAccount(item)) : [];
    }
}

Object.seal(ClientAccount);
export default ClientAccount;
