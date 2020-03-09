import DataHelper from '../../../helpers/DataHelper';

class UserBusinessInfo {
    abnCode: string;
    entityName?: string;
    entityType?: string;
    address?: string;
    type: number;
    avatar?: any;

    constructor(model: UserBusinessInfo) {
        if (!model)
            return;

        this.abnCode = model.abnCode;
        this.entityName = model.entityName;
        this.entityType = model.entityType;
        this.type = model.type;
        this.address = model.address;
        this.avatar = DataHelper.handleFileDataModel(model.avatar);
    }
}

Object.seal(UserBusinessInfo);
export default UserBusinessInfo;
