import IPermission from "./interfaces/IPermission";
declare class PermissionCreate {
    product: number;
    claim: number;
    fromRole: number;
    toRole: number;
    constructor(model: IPermission);
}
export default PermissionCreate;
