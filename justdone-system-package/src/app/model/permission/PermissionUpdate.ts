import IPermission from "./interfaces/IPermission"; // eslint-disable-line

class PermissionUpdate {
    product: number;
    claim: number;
    fromRole: number;
    toRole: number;

    deletedAt?: any;

    constructor(model: IPermission) {
        if (!model)
            return;

        this.product = model.product;
        this.claim = model.claim;
        this.fromRole = model.fromRole;
        this.toRole = model.toRole ? model.toRole : null;
        this.deletedAt = model.deletedAt ? new Date() : null;
    }
}

Object.seal(PermissionUpdate);
export default PermissionUpdate;
