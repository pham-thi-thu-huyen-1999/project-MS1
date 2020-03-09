import IPermission from './interfaces/IPermission'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

class Permission {
    _id: string;
    product: number;
    claim: number;
    fromRole: number;
    toRole: number;

    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IPermission) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.product = model.product;
        this.claim = model.claim;
        this.fromRole = model.fromRole;
        this.toRole = model.toRole ? model.toRole : null;

        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IPermission[]): Permission[] {
        return list && Array.isArray(list) ? list.map(item => new Permission(item)) : [];
    }
}

Object.seal(Permission);
export default Permission;
