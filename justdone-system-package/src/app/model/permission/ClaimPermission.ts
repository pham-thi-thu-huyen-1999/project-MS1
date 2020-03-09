import IPermission from './interfaces/IPermission'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

class ClaimPermission {
    _id: string;
    product: number;
    claim: number;
    fromRole: number;
    toRole: number;

    constructor(model: IPermission) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.product = model.product;
        this.claim = model.claim;
        this.fromRole = model.fromRole;
        if (model.toRole)
            this.toRole = model.toRole;
    }

    static parseArray(list: IPermission[]): ClaimPermission[] {
        return list && Array.isArray(list) ? list.map(item => new ClaimPermission(item)) : [];
    }
}

Object.seal(ClaimPermission);
export default ClaimPermission;
