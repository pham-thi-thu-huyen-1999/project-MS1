import IPermission from "./interfaces/IPermission"; // eslint-disable-line

class PermissionCreate {
    product: number;
    claim: number;
    fromRole: number;
    toRole: number;

    constructor(model: IPermission) {
        if (!model)
            return;

        this.product = model.product;
        this.claim = model.claim;
        this.fromRole = model.fromRole;
        this.toRole = model.toRole ? model.toRole : null;
    }
}

Object.seal(PermissionCreate);
export default PermissionCreate;
